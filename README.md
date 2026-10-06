# 貓掌煉金術 AI Studio v1.6

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v1.6 製片流水線
- 任務狀態：草稿 → 待生成 → 待剪輯 → 完成。
- 一鍵複製目前完整製作包，方便貼入 PixVerse / Flow / 剪映流程。
- 任務狀態與製作包保存在本機瀏覽器，最多 50 筆。
- 新增 `config/automation.js`，預留 n8n webhook 自動化接口。
- 自動化預設 `enabled:false`，且不在公開 GitHub 保存 API key、token 或私密 webhook。

## 安全原則
Google Sheet、n8n、影片生成 API 的私密憑證應由安全後端、n8n Credentials 或環境變數管理，不直接寫進前端 JavaScript。

## 下一階段 v1.7
建立可操作的任務看板與輸出拆分按鈕（只複製首幀／PixVerse／尾幀／發布包），並準備 n8n 接收 payload 的 schema。
