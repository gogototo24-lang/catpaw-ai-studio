# 喵掌台灣江湖宇宙大樓｜CatPaw HQ v1

> 狀態：已建總部網站與 D1 持久化任務底座；廠長及 Muse 工人尚未連接外部 AI API。
> 最重要：本版本不能真實執行四家模型，不會扣 RunningHub 幣，也不會在 Threads 發文。

## 0. 入口

- **總部正式入口：** \`https://catpaw-universe-hq.onrender.com/hq.html\`（Render 靜態站，已部署）\n- GitHub Pages 備援：\`https://gogototo24-lang.github.io/catpaw-ai-studio/hq.html\`（尚未啟用 Pages；目前不能使用）
- 舊版四線 Mock：\`https://gogototo24-lang.github.io/catpaw-ai-studio/factory.html\`
- 中央控制器：\`https://threads-scheduler.gogototo24.workers.dev\`
- 原有發布器：\`https://threads-scheduler.gogototo24.workers.dev/\`

總部公開資料 \`GET /api/factory/hq/public\` 只展示席位與 Mock 數量；個別任務與角色任命，需要既有 Cloudflare Worker \`ADMIN_KEY\`。

## 1. 大樓樓層／招募席位

| 席位 | 工作內容 | 候選廠長 | 目前接線狀態 |
|---|---|---|---|
| HQ｜總指揮塔 | 統籌、故障交接、驗收 | Gemini Enterprise | 候選，尚無 Connector |
| A｜貓掌／喵台灣 | 電影級布袋戲母喵武戲、24H 海巡、Threads 內容 | GPT-6 | 候選，既有工具可分別操作，但未接總部接口 |
| B｜成年時尚視覺 | 合法、非露骨風格寫真與商品圖 | Grok | 候選 |
| C｜音樂 MV | AI Music Studio + MV 鏡頭／節拍＋品質驗收 | Gemini | 候選 |
| D｜長影片漫劇 | 劇本、分集、連戲、長片規劃 | Claude | 候選 |
| W｜工人區 | 低成本標註、初稿、拆鏡、QA | Muse Spark | 候選 |

任命操作只記錄人事狀態：\`candidate\`、\`interviewing\`、\`appointed\`。**不會自動將 \`connector_verified\` 設為 1**；那需要 API 實際通過獨立驗收。

## 2. 同一張工單，四家 AI 均可理解

總部使用現有 D1 \`factory_jobs\`，保留 \`job_id\`、\`pipeline_id\`、\`status\`、\`input_json\`、\`idempotency_key\` 和成本審核欄位。

v1 僅建立零成本 \`mode=mock\` 工單，統一停在 \`awaiting_review\`。工單不觸發 provider，不觸發發布器。

未來導入模型時，請先確定：

1. 唯一任務 ID、\`idempotency_key\`（避免重複扣點／重複發文）。
2. 外部模型透過最小權限 Adapter 收取任務，不直接讀取管理金鑰。
3. 生成結果先進 R2，寫回 \`factory_assets\`；支出寫 \`factory_costs\`。
4. CANON／QA 通過、產線成本批准、發布批准分別獨立。
5. 任何模型回報完成，都要有 \`provider_task_id\`、成品 URL、可查的成本與驗收記錄。
6. 關鍵失敗採 \`needs_human_review\`，不允許無上限重試。
7. 社群最終發布只能走 \`threads-scheduler\` 的 Threads 官方 API；既有五篇 Metricool 既有排程為特例，不移轉、不重發。

## 3. 與《貓掌江湖》中央資料庫 v3 對齊

本次依據使用者提供的 2026-10-03 \`貓掌江湖_中央資料庫_v3.json\` 設計。

規則：
- \`character_id\` 不變；改名保留別名。
- \`asset_status\` 缺真實可讀圖片網址不得設 \`READY\`。
- 衣服／皇冠 CANON 鎖定與 QA PASS/FAIL 不可混寫。
- 缺失保持空白，不以推測補齊。
- 自動生成只允許經核准角色與角色 Master 圖。
- 每次正史改動需 \`change_log\` 並遞增 \`revision\`。
- Shot02/Shot03 必須使用上一鏡真正尾幀。

出於著作權與素材管理考量，尚未公開的原始中央資料庫不直接複製到公開 GitHub 網站。

## 4. API 安全

後端位於 \`threads-scheduler\`，遷移 \`migrations/0012_universe_hq.sql\`。

| 方法 | 路徑 | 權限 | 效果 |
|---|---|---|---|
| GET | \`/api/factory/hq/public\` | 公開 | 安全摘要，不含私有工單 |
| GET | \`/api/factory/hq/state\` | 管理員 | 席位、Mock 工單、稽核紀錄 |
| PATCH | \`/api/factory/hq/roles/{HQ,A,B,C,D,W}\` | 管理員 | 記錄面試／任命 |
| POST | \`/api/factory/hq/jobs\` | 管理員 | 建立零成本 Mock 待審工單 |
| POST | \`/api/factory/hq/mock-run\` | 管理員 | 四線各建立一筆 Mock，按批次鍵去重 |

前端管理金鑰只保存在瀏覽器當前 JavaScript 記憶體；重新載入或關閉分頁即消失。後端驗證 \`x-admin-key\`，CORS 只允許指定 GitHub Pages 域名及同源；CORS 本身不是身分驗證。

\`POST /api/factory/hq/jobs\` 範例：

\`\`\`json
{
  "pipeline_id": "C",
  "title": "舞魅喵 MV 鏡頭測試",
  "brief": "以原有角色正史設定拆分成六鏡，僅建立 Mock 待審工單",
  "mode": "mock",
  "paid_enabled": false,
  "publish_enabled": false,
  "budget_max_twd": 0,
  "idempotency_key": "catpaw-hq-example-20261020-C"
}
\`\`\`

輸入 \`mode=live\`、\`publish_enabled=true\`、\`paid_enabled=true\` 或非零預算，後端會拒絕建立工單。

## 5. 用人面試流程（使用者會自己選廠長）

1. 打開總部，使用 Worker 原有 ADMIN_KEY 登入。
2. 選擇 HQ／A／B／C／D／W 席位、填上面試結果。
3. 先登記 \`interviewing\`；確認合作後改為 \`appointed\`。
4. 確認各家 API、權限、帳單、資料保護條款。此階段不要輸入 API Key 到公開 repo／介面欄位。
5. 用四線 Mock 壓測檢查工單與事件寫入。
6. 只有個別 API 端到端測試通過，才將未來的 Connector 正式接通。

## 6. 驗收邊界

- GitHub Actions 語法、單元測試與 Wrangler dry-run = **程式層**。
- Cloudflare 部署成功、D1 migration 成功 = **基礎設施層**。
- 網站可以安全登入、讀寫任命與 Mock 工單 = **控制層**。
- 各家的廠長真正能連線、自動消化工單、生成影片並交回驗收 = **尚未實作的執行層**。

絕不可將「已任命」、「Mock PASS」或「已入列」說成「AI 已接通」、「影片已完成」或「貼文已發布」。
