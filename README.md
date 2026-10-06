# 貓掌煉金術 AI Studio v1.9

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v1.9 真實任務送出層
- 新增「送出目前任務」功能。
- 雙重保險：只有 `enabled=true` 且 `webhook_url` 是有效 HTTPS URL 才允許 POST。
- 預設仍為 `enabled:false`，所以公開版本不會自行外送。
- 最多 2 次重試，預設 12 秒 request timeout。
- 成功／失敗、job_id、嘗試次數與時間保存在本機 `catpaw_send_log`。
- 私密 webhook、API key、token 仍不寫入公開 GitHub。

## 下一階段 v2.0
把 webhook 從公開前端設定移到安全部署環境／後端，建立 n8n 回傳狀態、Google Sheet 影片紀錄更新，以及影片生成 provider 路由。正式啟用前先用測試 webhook 做端到端驗證。
