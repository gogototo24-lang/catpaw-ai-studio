# 貓掌煉金術 AI Studio v1.7

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v1.7 任務看板
- 首幀、PixVerse / Flow、尾幀、發布包可獨立複製。
- 保留完整製作包一鍵複製與草稿／待生成／待剪輯／完成狀態。
- 新增 `buildN8nPayload()`，統一產生自動化任務資料。
- 新增 `schemas/production-job.schema.json`，定義 n8n 接收 payload。
- webhook 仍預設關閉，不把任何私密網址、API key 或 token 放進公開前端。

## v1.8 方向
建立安全 webhook 發送層、失敗重試／回報狀態與 n8n workflow 範本，之後再串接實際影片生成服務。
