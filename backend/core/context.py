from asyncio import Queue
from dataclasses import dataclass, field

from core.domain import (
    AudioChunkGeneratedMessage,
    FlowCommand,
    TextChunkGeneratedMessage,
    Topic,
)


@dataclass
class CustomerContext:
    text_queue: Queue[TextChunkGeneratedMessage] = field(default_factory=Queue)
    audio_queue: Queue[AudioChunkGeneratedMessage] = field(default_factory=Queue)
    command_queue: Queue[FlowCommand] = field(default_factory=Queue)
    topics: list[Topic] = field(default_factory=list)
