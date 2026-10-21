# CatPaw P5｜n8n 海巡授權接線（不發文）

## 此工作流做什麼

只有「Manual Trigger → GET /api/factory/p5/fastlane/health → 解析回傳」，**不會 POST 發布、建立排程、發送私訊或呼叫付費模型**。

## 前提

- Threads 授權中心截圖顯示：@water3838 OAuth 基本存取＋`threads_content_publish` 已經驗證。
- 海巡受限金鑰 `p5s_...` 已由使用者安全保存，不應傳給助理。

## 在 n8n Cloud 匯入

1. 開啟 https://gogototo24.app.n8n.cloud/ ，進入已有的工作區。
2. 建立新工作流（New Workflow），右上角 `…` 選 **Import from File**，選 `catpaw-p5-scout-auth-check.n8n.json`。
3. 開啟節點 **P5 授權健康檢查（GET）**。
4. Authentication 設 **Generic Credential Type** → **Header Auth**。
5. 建立一組新的 Header Auth credential：
   - **Name（Header Name）：** `x-p5-scout-key`
   - **Value：** 在你的密碼管理器取出已儲存的 `p5s_...` 金鑰，直接填在 n8n Credential 畫面。
   - 建議 Credential 名稱：`CatPaw P5 Scout - Worker`。
6. 在 HTTP 節點中選擇剛建立的 Credential，然後按 **Execute Workflow**。
7. 如果 HTTP 狀態是 200 且最後輸出 `P5_SCOUT_KEY_VALID_HTTP_200`，代表 n8n 的 Header Auth 已成功通過 Worker 的受保護入口；**這是授權驗收，不是實際發文成功**。

## 常見錯誤

- HTTP 401：n8n 未正確選 Credential、Header Name 拼錯、Key 貼錯，或發行後又輪替而造成舊 Key 失效。
- HTTP 404：Worker URL／部署版本不符。
- HTTP 500：Worker / D1 執行錯誤，需檢查 Cloudflare Logs。
- `worker_ready:false` 或 `threads_token_stored:false`：須檢查 Worker 與 Threads OAuth。
- `scout_key_configured:false` 只代表 Cloudflare 舊版環境變數 `P5_SCOUT_KEY` 未設定；現在使用的是資料庫發行的 scoped key，**只要 HTTP 200，就代表 scoped 驗證有過**，不需把密鑰重複加到 Cloudflare Workers 變數。

## 禁止事項

- 不要把金鑰直接寫在 HTTP Header 明文參數、Code 節點、n8n Export JSON、ChatGPT 對話、GitHub 或 Google Drive 文件。
- 先只跑本份唯讀測試；不要從未授權的公開 Webhook 自動 POST 快車道。
- 此測試不改動已排程的五篇 Metricool 貼文；新的正式內容發布路徑仍是 Cloudflare Worker → Threads 官方 API。

## 下一階段

授權通過後，才另外建立保護式的 P5 海巡候選入列流程，進一步驗證來源、去重、時效以及一筆真實 Threads ID／permalink。ChatGPT 排程本身若沒有可呼叫此受保護 API 的工具，仍不能宣稱已完成自動移交。
