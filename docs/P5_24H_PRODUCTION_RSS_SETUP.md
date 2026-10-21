# CatPaw P5｜一次性啟用正式 24H 海巡（文化部官方 RSS → Threads）

> 這不是之前的三節點授權測試，而是 **4 個節點的正式來源監測與發文工作流**。
> 非政治低風險消息，可由已授權的 Cloudflare Worker 直接發布；政治與敏感內容會被擋下，不會透過 Metricool。

## 一次性 n8n 啟用（不必下載 JSON）

1. 打開 `https://gogototo24.app.n8n.cloud/`，**新建另一個 Workflow**（舊的授權測試工作流保留不動）。
2. 編輯器上方工作流名稱右側 `⋯ → Import → From URL`，貼入：
   `https://raw.githubusercontent.com/gogototo24-lang/catpaw-ai-studio/main/n8n/catpaw-p5-production-official-rss-to-threads.n8n.json`
3. 會出現四個節點：
   - 官方文化新聞 RSS｜新文章才啟動
   - P5｜官方來源＋新鮮度＋政治敏感防線
   - P5｜Cloudflare Fastlane → Threads 官方 API
   - P5｜真實 ID／網址回報
4. **只需要在第三個「HTTP Request」節點**設定 Authentication → Generic Credential Type → Header Auth，**選擇之前已成功做 HTTP 200 測試的同一組 `x-p5-scout-key` Credential**。切勿重新生成、貼進 JSON、GitHub 或聊天。
5. 儲存。檢查 RSS Trigger 的 URL 是文化部原始 RSS，確認每 10 分鐘檢查，然後在 n8n 編輯器點 **Publish／Activate** 讓它持續監測。這次不必再要求你手動跑一次 Mock。
6. 後續新發布的**官方且 90 分鐘內**消息，符合關鍵字、防政治敏感、來源檢查等條件，會向 Cloudflare P5 Fastlane 發出原創文字 POST（每批上限 1 則）。
7. Fastlane 由 Cloudflare D1 去重、限流、原子發布，回傳 `action_id`、`status`、`published`、`thread_id`、`permalink`，最後節點顯示真實發布結果。**只有 `published=true` 且有 Threads ID 才算正式發布。**

## 重要限制與失敗診斷

- Cloudflare 直接抓這個文化部 RSS 來源，在 2026-10-21 已觀測到 HTTP **403**，因此 `FACTORY_P5_OFFICIAL_SCOUT_ENABLED=false`，避免 Worker 空跑；**新來源收集改為 n8n RSS Trigger**，是否能從 n8n 讀到該 RSS 仍須由實際運行紀錄判斷，不能保證源站允許 n8n Cloud。
- 工作流只會掃描**文化部官方發布的藝文消息**，**不是完整台灣熱門 Threads 或全網爆點巡查**。這是已可交接的一條正式、來源可靠的子線；原有 ChatGPT P5 24H 社群海巡仍依原排程搜尋並提供熱門文案，但目前沒有直接自動轉入 n8n 的已驗證連接器。
- RSS Trigger 只會對新文章觸發；啟用後沒看到新執行紀錄，不代表登入失敗。若 RSS 本身 HTTP 403，應先換用有授權的可用官方資料源，不能繞過網站安全機制。
- 這版是僅使用標題與來源的原創純文字投稿，不複製媒體或未驗證的文章細節。沒有新的文章就不發文。
- 不會新建 Metricool 草稿。原來五篇既有排程不動。禁止私訊；政治與敏感消息保留人工審核。
- 若 `status=publish_unknown`，不能再次提交或自動重發；先查 Threads 是否已有貼文。
- 需要停止時，在 n8n Workflow 取消發布／停用；無須刪除 Worker、重新設定 ADMIN_KEY 或 Threads OAuth。

## 工程驗收

- GitHub `tests/p5-production-official-rss.test.mjs` 檢查四節點 JSON 完整、無憑證、非政治過濾、最近 90 分鐘、正式發布回條語意。
- Worker `tests/p5-official-autoscout.test.mjs` 模擬官方 RSS → Fastlane → Threads 發布 ID／permalink。
- **真實發文與流量成績**必須以 n8n 實際執行紀錄及 Threads 公開網址為準。僅 GitHub Actions 綠燈不能當作真實 API 發布成功。
