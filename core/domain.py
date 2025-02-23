import time
from dataclasses import dataclass, field


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
class _FlowCommandBase:
    timestamp: float = field(default_factory=time.time, init=False)


@dataclass
class StartRadioStreamFlowCommand(_FlowCommandBase):
    topics: list[Topic]


@dataclass
class DiveDeeperFlowCommand(_FlowCommandBase):
    topic: Topic
    commentary: None | str


@dataclass
class SkipTopicFlowCommand(_FlowCommandBase):
    topic: str


FlowCommand = (
    StartRadioStreamFlowCommand | DiveDeeperFlowCommand | StartRadioStreamFlowCommand
)


@dataclass
class NewsItem:
    content: str
    url: str


@dataclass
class News:
    items: list[NewsItem]
