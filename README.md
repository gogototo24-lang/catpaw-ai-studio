# 貓掌煉金術 AI Studio v1.8

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v1.8 自動化橋接
- 每個製作任務產生唯一 `job_id`。
- n8n 橋接採安全 TEST MODE，預設不送出外部請求。
- Payload 可先在本機建立、檢查，再交給正式 webhook。
- 自動化設定加入最多 2 次重試參數。
- 新增 `n8n/catpaw-production-bridge.template.json`，可作為 n8n Webhook → Validate Payload 的匯入範本。
- 私密 webhook、API key、token 不寫入公開 GitHub。

## 下一階段 v1.9
加入真正的「送出任務」函式，但只有在部署環境提供 webhook 且 enabled=true 時才允許發送；加入 HTTP 成功／失敗回報與任務狀態更新。
