import os

from openai import AsyncOpenAI
from tavily.async_tavily import AsyncTavilyClient


def get_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI()


def get_tavily_client() -> AsyncTavilyClient:
    return AsyncTavilyClient(os.environ["TAVILY_API_KEY"])


def get_elevenlabs_api_key() -> str:
    return os.environ["ELEVENLABS_API_KEY"]
