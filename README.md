# 貓掌煉金術 AI Studio v2.0

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v2.0 製片閉環骨架
流程：AI Studio → 安全 n8n／後端 → 影片 Provider → callback → Google Sheet 影片紀錄。

- 新增 `config/providers.js`：PixVerse 為預設影片 Provider，採 n8n_proxy；Flow 保留 manual_handoff。
- Provider 預設未啟用，公開前端不保存任何 API key。
- 新增 `schemas/job-callback.schema.json`：received / generating / generated / editing / completed / failed。
- 工作台可建立 Google Sheet「影片紀錄」回寫 payload 預覽。
- callback 狀態可在本機保存，供後續任務看板顯示。
- CANON / Master 驗證仍是生成前置條件。

## 下一步
建立 n8n v2 workflow：Webhook → 驗證 → Provider Router → PixVerse → 狀態 callback → Google Sheet 影片紀錄。先使用測試憑證／測試 webhook 端到端驗證，再考慮正式啟用。
