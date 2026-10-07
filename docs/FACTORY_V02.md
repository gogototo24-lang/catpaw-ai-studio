# CatPaw AI Factory v0.2 可執行 Mock

在既有 catpaw-ai-studio 增量加入 factory/mock_factory.py，沒有重建原工作台、n8n 或其他 repo。Python 3 標準函式庫即可執行，沒有網路呼叫、付費或發布 adapter。

```sh
python factory/mock_factory.py --output factory/results
python -m unittest discover -s tests -v
```

自訂任務：`python factory/mock_factory.py --job job.json --output factory/results`。輸入格式參見 `factory/mock-run-v02.json` 中各任務。正式 provider 在此版本一律不能執行。

## 本次實跑

| 產線 | 結果 | 完成步驟 | 成本 | 下一個候選（未啟用） |
|---|---|---|---|---|
| A 貓掌／喵台灣 | ready / success | prompt、first_frame、video、audio、compose | 0 TWD / 0 credits | threads-scheduler 現有 RunningHub video adapter |
| B 成人時尚寫真 | ready / success | identity、image、quality、package | 0 TWD / 0 credits | RunningHub 獨立圖片 AI App |
| C 音樂 MV | ready / success | lyrics、voice、music、video、mix、compose | 0 TWD / 0 credits | AI Music Studio v2 合成接口 |
| D 長篇漫劇 | ready / success | script、storyboard、video、voice、compose、package | 0 TWD / 0 credits | AI Music Studio v2 分段合成接口 |

這是任務機制閉環；素材全是 JSON mock_manifest，playable=false，不是假裝可播放的 MP4。approved_mock 是測試 fixture 核准，不代表中央資料庫角色、聲線或真人參考已核准。實跑 UTC 時間在 events。所有結果 published=false、next_provider_enabled=false。

## 狀態與閘門

draft → validated → queued → running → awaiting_review → ready；步驟例外轉 failed。未核准 input 直接拒絕；output pending 停在 awaiting_review。mode 必須 mock，paid_enabled 與 auto_publish 必須 false，publish 必須 pending。Mock 估算／預留／實際金額與 credits 全為零。

Provider 合約為 validate_inputs / submit / poll / fetch_outputs / normalize_result；目前只實作 MockProvider。未加入無效 HTTP 端點或假 RunningHub nodeId。

同一 job_id＋相同 input 回傳既有結果；變更 input 拒絕。此檔案式執行器適用單程序 Mock 驗證，並非 D1 多程序併發鎖或正式斷點續跑。正式中台再沿用 threads-scheduler D1 transaction/CAS、R2 與 media_jobs；不可直接拿本程式多實例排付費任務。

## 缺少設定與安全啟用順序

- A：RunningHub Secret、實際 WebApp ID/nodeInfo、核准首幀、中央 CANON gate；現有 n8n v2.2 尚需去敏匯出及 Factory 映射。
- B：獨立圖片 App、nodeInfo、Secret、成年身份／參考授權；不混用貓掌 CANON。
- C：Music Studio API base/health、已核准可播放影音、持久化結果；現有 BGM/TTS 不等同完整演唱 provider。
- D：劇集／鏡頭 bible、素材、分段合成設定、持久化依賴與續跑、Music Studio health；現有合成按最多 12 素材分批使用。

下一個最安全的外部接線是 **C 的 Music Studio 合成健康檢查＋本地已有素材合成**，無需影片生成點數；先確認 /health 和實際輸入格式，不在本次自動啟用。若要第一筆付費生成則選 A 的既有 RunningHub adapter，完成 node mapping、核准素材與預算後才單筆啟用。

現有 threads-scheduler 的影片發布尚未完成验证，四線保留下載／待審核交付，不啟用自動發布。PixVerse 前次 CLI 環境錯誤仍是獨立缺口，本次不宣稱已修復。

## 驗證與復用

3 組測試覆蓋四線閉環／去重、付費與發布拒絕、審核等待與未核准输入攔截。原 schemas/config/n8n 文件保持原樣；v0.2 契約獨立命名，後續接入需顯式映射，不靜默替換 v2.1 job。

復用：catpaw-ai-studio 作入口；threads-scheduler 的 RunningHub/PixVerse adapter、D1/R2/review/posts；ai-music-studio 前端；ai-music-studio-v2 音訊/MV；codexskills/video-prompt-builder 分鏡。此次只修改 CatPaw repo 的增量 Mock 目錄，沒有部署 production。
