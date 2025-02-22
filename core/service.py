from asyncio import Queue
from dataclasses import dataclass

from openai import AsyncOpenAI
from tavily.async_tavily import AsyncTavilyClient


@dataclass
class TextChunkGeneratedMessage:
    text: str


@dataclass
class AudioChunkGeneratedMessage:
    audio: bytes


Message = TextChunkGeneratedMessage | AudioChunkGeneratedMessage


@dataclass
class Topic:
    title: str


async def extract_topics(client: AsyncOpenAI, text: str) -> list[Topic]:
    raise NotImplementedError


@dataclass
class NewsItem:
    content: str
    url: str


@dataclass
class News:
    items: list[NewsItem]


async def fetch_news(client: AsyncTavilyClient, topic: Topic) -> News:
    raise NotImplementedError


@dataclass
class DiveDeeperFlowCommand:
    topic: str
    comment: None | str


@dataclass
class SkipTopicCommand:
    topic: str


FlowCommand = DiveDeeperFlowCommand


async def classify_flow_command(client: AsyncOpenAI, command: str) -> FlowCommand:
    raise NotImplementedError


async def execute_flow_command(
    client: AsyncOpenAI, command: FlowCommand, queue: Queue[Message]
) -> None:
    raise NotImplementedError


async def text_to_speech(queue: Queue[Message]) -> None:
    raise NotImplementedError
