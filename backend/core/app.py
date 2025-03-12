from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core import web

app = FastAPI()
app.include_router(web.router)

allow_origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
