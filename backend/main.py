import logging
from typing import NoReturn

import uvicorn

logging.basicConfig(level=logging.INFO)


def main() -> NoReturn:
    uvicorn.run("core.app:app", port=5000, log_config=None)
    raise AssertionError


if __name__ == "__main__":
    main()
