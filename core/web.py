import logging
import uuid
from collections.abc import AsyncGenerator
from typing import Annotated, ClassVar
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, HTTPException, Response, WebSocket
from fastapi.responses import FileResponse, StreamingResponse
from humps import camel
from openai import AsyncOpenAI
from pydantic import BaseModel
from tavily.async_tavily import AsyncTavilyClient

from core import factory, service, storage
from core.domain import StartRadioStreamFlowCommand

router = APIRouter()
log = logging.getLogger(__name__)

AsyncOpenAIDependency = Annotated[AsyncOpenAI, Depends(factory.get_openai_client)]
AsyncTavilyClientDependency = Annotated[
    AsyncTavilyClient, Depends(factory.get_tavily_client)
]
ElevenlabsApiKeyDependency = Annotated[str, Depends(factory.get_elevenlabs_api_key)]


class ElevenLabsModel(BaseModel):
    class Config:
        alias_generator = camel.case
        populate_by_name = True
        json_encoders: ClassVar[dict[type, type]] = {
            UUID: str,
        }


class CookiesModel(BaseModel):
    session_id: UUID


Cookies = Annotated[CookiesModel, Cookie()]


@router.get("/")
async def get_index() -> FileResponse:
    return FileResponse("index.html", media_type="text/html")


@router.post("/sessions", status_code=201)
async def init_session(
    tavily_client: AsyncTavilyClientDependency,
    openai_client: AsyncOpenAIDependency,
    elevenlabs_api_key: ElevenlabsApiKeyDependency,
    background_tasks: BackgroundTasks,
    response: Response,
) -> None:
    session_id = uuid.uuid4()
    log.info("Generated session id %s", session_id)
    context = storage.get_customer_context(session_id)
    response.set_cookie(key="session_id", value=str(session_id))
    background_tasks.add_task(
        service.start_command_processing,
        tavily_client=tavily_client,
        openai_client=openai_client,
        elevenlabs_api_key=elevenlabs_api_key,
        context=context,
    )


class SetTopicsRequestModel(ElevenLabsModel):
    text: str


@router.post("/topics", status_code=201)
async def set_topics(
    openai_client: AsyncOpenAIDependency, req: SetTopicsRequestModel, cookies: Cookies
) -> None:
    context = storage.get_customer_context(cookies.session_id)
    context.topics = await service.extract_topics(openai_client, req.text)
    # TODO: Fetch topics info in a background


@router.websocket("/radio-streams")
async def start_radio_stream(
    websocket: WebSocket,
    cookies: Cookies,
) -> None:
    context = storage.get_customer_context(cookies.session_id)
    await context.command_queue.put(StartRadioStreamFlowCommand(topics=context.topics))

    await websocket.accept()
    
    while True:
        chunk = await context.audio_queue.get()
        log.info("Yielding chunk of audio of %s bytes", len(chunk.audio))
        await websocket.send_text(chunk.audio)
        await websocket.receive_text()

        
class ProcessFlowCommandRequestModel(ElevenLabsModel):
    text: str


@router.post(
    "/radio-streams/flow-commands",
    status_code=201,
    responses={400: {"description": "Failed to recognized flow command"}},
)
async def process_flow_command(
    client: AsyncOpenAIDependency, req: ProcessFlowCommandRequestModel, cookies: Cookies
) -> None:
    try:
        flow_command = await service.classify_flow_command(client, req.text)
    except ValueError:
        raise HTTPException(status_code=400) from None

    context = storage.get_customer_context(cookies.session_id)
    await context.command_queue.put(flow_command)
