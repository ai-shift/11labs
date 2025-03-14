from dataclasses import dataclass


@dataclass
class TextChunkGeneratedMessage:
    text: str


@dataclass
class AudioChunkGeneratedMessage:
    audio: bytes


@dataclass
class Topic:
    title: str


@dataclass
class StartRadioStreamFlowCommand:
    topics: list[Topic]


@dataclass
class DiveDeeperFlowCommand:
    topic: Topic
    commentary: None | str


@dataclass
class SkipTopicFlowCommand:
    topic: str


FlowCommand = StartRadioStreamFlowCommand | DiveDeeperFlowCommand | SkipTopicFlowCommand


@dataclass
class NewsItem:
    content: str
    url: str


@dataclass
class News:
    items: list[NewsItem]
