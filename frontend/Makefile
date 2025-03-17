dev:
	pnpm exec vite

check:
	pnpm exec biome check --write .

compile: check
	pnpm exec tsc

# Requires running backend to get OpenAPI schema
generate-openapi-types-v1:
	wget http://localhost:5000/openapi.json
	pnpm exec openapi-typescript ./openapi.json -o ./src/shared/api/v1.d.ts
	rm openapi.json
