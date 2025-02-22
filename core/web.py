import uuid
from typing import Annotated, ClassVar
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from humps import camel
from openai import AsyncOpenAI
from pydantic import BaseModel

from core import factory, service, storage
from core.service import StartRadioStreamFlowCommand

router = APIRouter()

AsyncOpenAIDependency = Annotated[AsyncOpenAI, Depends(factory.get_openai_client)]


class ElevenLabsModel(BaseModel):
    class Config:
        alias_generator = camel.case
        populate_by_name = True
        json_encoders: ClassVar[dict[type, type]] = {
            UUID: str,
        }


class CookiesModel(BaseModel):
    session_id: UUID


Cookies = Annotated[CookiesModel, CookiesModel()]


@router.post("/sessions", status_code=201)
async def init_session(response: Response) -> None:
    session_id = uuid.uuid4()
    storage.get_customer_context(session_id)
    response.set_cookie(key="session_id", value=str(session_id))


class SetTopicsRequestModel(ElevenLabsModel):
    text: str


@router.post("/topics", status_code=201)
async def set_topics(
    client: AsyncOpenAIDependency, req: SetTopicsRequestModel, cookies: Cookies
) -> None:
    context = storage.get_customer_context(cookies.session_id)
    context.topics = await service.extract_topics(client, req.text)
    # TODO: Fetch topics info in a background


@router.get("/radio-streams")
async def start_radio_stream(
    client: AsyncOpenAIDependency, cookies: Cookies
) -> StreamingResponse:
    context = storage.get_customer_context(cookies.session_id)
    stream = service.process_queue(client, context.queue)
    await service.execute_flow_command(
        client, StartRadioStreamFlowCommand(topics=context.topics), context.queue
    )
    return StreamingResponse(stream, media_type="audio/wav")


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
    await service.execute_flow_command(client, flow_command, context.queue)
