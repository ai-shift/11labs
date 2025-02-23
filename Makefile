format:
	uv run ruff format
	if { git diff --name-only --cached; git ls-files -m; } | grep '.sql'; then \
		uv run sqlfluff format --disable-progress-bar migrations/*.sql || echo "SQL format exited with non zero"; \
	fi

lint: format
	if { git diff --name-only --cached; git ls-files -m; } | grep '.py'; then \
		uv run ruff check --fix; \
		uv run mypy .; \
	fi
	uv run codespell --skip TAGS .
	if { git diff --name-only --cached; git ls-files -m; } | grep '.sql'; then \
		uv run sqlfluff lint --disable-progress-bar migrations/*.sql; \
	fi

lint-wps: lint
	uv run flake8 . --select=WPS

# Run fast and free tests
test: lint
	uv run pytest -m "not paid"


test-file: lint
	uv run pytest -s -v $$PYTEST_FILE_TO_TEST


pre-commit: lint

run:
	uv run python main.py

generate-requirements:
	uv export --no-hashes --format requirements-txt > requirements.txt
