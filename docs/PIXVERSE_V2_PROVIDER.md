# PixVerse v2 provider

CatPaw AI Factory server-side PixVerse integration.

## Official API contract
- Base URL: https://app-api.pixverse.ai/openapi/v2
- Auth headers: `API-KEY` and a unique `Ai-trace-id`
- Image-to-video: `POST /video/img/generate`
- Text-to-video: `POST /video/text/generate`
- Poll: `GET /video/result/{video_id}`
- Success status: `1`; processing: `5`; moderation failed: `7`; generation failed: `8`

## Security
Never store the API key in browser code or GitHub. Use `PIXVERSE_API_KEY` in the secure backend/n8n environment.

## Production guardrails
The supplied n8n workflow is:
- single-job only
- auto-publish locked
- batch locked
- defaults to v6 / 720p / 5s
- status polling every 5 seconds
- returns a stable provider contract: `provider/status/video_id/video_url`

## Smoke test
Use one low-cost 5s I2V job only after `PIXVERSE_API_KEY` is present in n8n.
