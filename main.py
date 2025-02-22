from fastapi import APIRouter, FastAPI

router = APIRouter()


@router.get("/")
async def root() -> str:
    return "Hello"


app = FastAPI()
app.include_router(router)
