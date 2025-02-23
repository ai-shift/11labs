from fastapi import FastAPI

from core import web

app = FastAPI()
app.include_router(web.router)
