from functools import lru_cache
from uuid import UUID

from core.context import CustomerContext


@lru_cache
def get_customer_context(_id: UUID) -> CustomerContext:
    return CustomerContext()
