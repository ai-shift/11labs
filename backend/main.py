import logging

import uvicorn

logging.basicConfig(level=logging.INFO)


def main() -> None:
    uvicorn.run("core.app:app", port=5000, log_config=None)


if __name__ == "__main__":
    main()
