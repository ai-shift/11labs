from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core import web

app = FastAPI()
app.include_router(web.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
