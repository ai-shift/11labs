from asyncio import Queue
from dataclasses import dataclass, field
from functools import lru_cache
from uuid import UUID

from core.service import Message, Topic


@dataclass
class CustomerContext:
    queue: Queue[Message] = field(default_factory=Queue)
    topics: list[Topic] = field(default_factory=list)


@lru_cache
def get_customer_context(_id: UUID) -> CustomerContext:
    return CustomerContext()
