import asyncio
import base64
import json
import logging
from asyncio import Queue
from collections.abc import AsyncGenerator, Iterable
from typing import assert_never

import websockets
from openai import AsyncOpenAI
from pydantic import BaseModel
from tavily.async_tavily import AsyncTavilyClient

from core.context import CustomerContext
from core.domain import (
    AudioChunkGeneratedMessage,
    DiveDeeperFlowCommand,
    FlowCommand,
    News,
    NewsItem,
    SkipTopicFlowCommand,
    StartRadioStreamFlowCommand,
    Topic,
)

log = logging.getLogger(__name__)


async def extract_topics(client: AsyncOpenAI, text: str) -> list[Topic]:
    log.info("Extracting topics from %s", text)
    completion = await client.beta.chat.completions.parse(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {
                "role": "developer",
                "content": """
                I'll send u free speech text description of
                interesting for me topics. Extract them and output as list
                """,
            },
            {"role": "user", "content": text},
        ],
        response_format=_ExtractTopicsResponseModel,
    )
    result = completion.choices[0].message.parsed
    assert result
    topics = [Topic(topic_title) for topic_title in result.topics]
    log.info("Extracted topics: %s", topics)
    return topics


class _ExtractTopicsResponseModel(BaseModel):
    topics: list[str]


# TODO: Ask back qualifing question if command is unclear
async def classify_flow_command(client: AsyncOpenAI, command: str) -> FlowCommand:
    completion = await client.beta.chat.completions.parse(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {
                "role": "developer",
                "content": """
                You should classify given text into the following groups:
                - StartRadioStreamFlowCommand. It should contain topics
                  to describe as well
                - DiveDeeperFlowCommand. It should contain topic to dive deeper
                  and optional commentary
                - SkipTopicFlowCommand. It should contain topic to skip
                """,
            },
            {"role": "user", "content": command},
        ],
        response_format=_ClassifyFlowCommandResponseModel,
    )
    result = completion.choices[0].message.parsed
    assert result
    return result.command


class _ClassifyFlowCommandResponseModel(BaseModel):
    command: FlowCommand


async def start_command_processing(
    tavily_client: AsyncTavilyClient,
    openai_client: AsyncOpenAI,
    elevenlabs_api_key: str,
    context: CustomerContext,
) -> None:
    log.info("Starting command processing")
    task = None

    while True:
        command = await context.command_queue.get()
        log.info("Processing command %s", command)
        if task:
            task.cancel()

        match command:
            case StartRadioStreamFlowCommand(topics=topics):
                task = asyncio.create_task(
                    stream_radio(
                        tavily_client,
                        openai_client,
                        elevenlabs_api_key,
                        topics,
                        context.audio_queue,
                    )
                )

            case SkipTopicFlowCommand(topic=_topic):
                pass

            case DiveDeeperFlowCommand(topic=_topic, commentary=_commentary):
                raise NotImplementedError

            case _:
                assert_never(command)


async def stream_radio(
    tavily_client: AsyncTavilyClient,
    openai_client: AsyncOpenAI,
    eleven_labs_api_key: str,
    topics: Iterable[Topic],
    queue: Queue[AudioChunkGeneratedMessage],
) -> None:
    for topic in topics:
        log.info("Starting radio for topic %s", topic)
        news = await fetch_news(tavily_client, topic)
        script_chunks = generate_script(openai_client, news)
        audio_chunks = generate_audio(eleven_labs_api_key, script_chunks)
        log.info("Starting radio streaming")
        async for chunk in audio_chunks:
            await queue.put(AudioChunkGeneratedMessage(chunk))


async def fetch_news(client: AsyncTavilyClient, topic: Topic) -> News:
    response = await client.search(
        query=f"What's new in the field of {topic.title}",
        search_depth="advanced",
        topic="news",
        time_range="w",
        max_results=20,
    )
    news = News(
        [
            NewsItem(content=item["content"], url=item["url"])
            for item in response["results"]
        ]
    )
    log.info("Got %s news", len(news.items))
    return news


async def generate_script(client: AsyncOpenAI, news: News) -> AsyncGenerator[str]:
    stream = await client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                You are radio news author. Your task is to take the input text provided
                and turn it into an engaging, informative speech.
                Your goal is to extract the key points and interesting facts.
                Define all terms used carefully for a broad audience of listeners.
                """,
            },
            {
                "role": "user",
                "content": (
                    "Process the following news:"
                    f" {'\n'.join(item.content for item in news.items)}"
                ),
            },
            {
                "role": "user",
                "content": """
                Write your engaging, informative story tell here
                Use a conversational tone and include any necessary context
                or explanations to make the content accessible to a general audience.
                Design your output to be read aloud -- it will be directly converted
                into audio.

                Always note the author of the each news item and retell in the third
                person view. Include direct quotes of the authors to improve engagement.

                Make the monologue as long and detailed as possible,
                while still staying on topic and maintaining an engaging flow.
                Aim to use your full output capacity to create
                the longest podcast episode you can,
                while still communicating the key information from the input text
                in an entertaining way.

                Separate each speech part by two new line characters (`\n\n`)
                """,
            },
        ],
        model="gpt-4o",
        stream=True,
    )

    buffer = []
    async for chunk in stream:
        content = chunk.choices[0].delta.content or ""
        match content.split("\n\n"):
            case [single]:
                buffer.append(single)
            case [tail, *buffers]:
                buffer.append(tail)
                text = "".join(buffer)
                log.info("Yielding text chunk of size %s", len(text))
                yield text
                for buf in buffers:
                    yield buf
                buffer = []
            case _unexpected:
                raise ValueError


async def generate_audio(
    elevenlabs_api_key: str, text_chunks: AsyncGenerator[str]
) -> AsyncGenerator[str]:
    voice_id = "21m00Tcm4TlvDq8ikWAM"
    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id=eleven_flash_v2_5"
    async with websockets.connect(uri) as websocket:
        await websocket.send(
            json.dumps(
                {
                    "text": " ",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
                    "xi_api_key": elevenlabs_api_key,
                }
            )
        )

        async for text in text_chunks:
            log.info("Starting conversion to audio %s", text)
            await websocket.send(json.dumps({"text": text}))
            message = await websocket.recv()
            data = json.loads(message)
            if data.get("audio"):
                yield data["audio"]

        await websocket.send(json.dumps({"text": ""}))
