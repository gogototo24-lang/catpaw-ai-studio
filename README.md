# CatPaw AI Studio / CatPaw AI Factory v0.2

《貓掌江湖》CANON 製片工具已升級為四產線共用總控的 P1 Mock 可執行版。

## 四條產線

- A：貓掌江湖＋喵台灣
- B：成年、非露骨時尚寫真
- C：音樂 MV
- D：長篇漫劇

## P1 驗收

A/B/C/D 已各跑 1 筆完整 Mock：

- 4/4 PASS
- 付費 provider 呼叫：0
- 自動發布呼叫：0
- 實際成本：NT$0
- 所有任務停在 `awaiting_review`

總控入口：`factory.html`

驗收紀錄：
- `factory/mock-results-p1.json`
- `docs/FACTORY_P1_ACCEPTANCE.md`

共用 Job Schema：
- `schemas/factory-job.schema.json`

## 安全原則

- `paid_enabled=false`
- `publish_enabled=false`
- Mock 資產不得進正式發布
- API Key／webhook／token 不提交 Git
- B 產線只允許成年、非露骨、合法授權的時尚寫真內容

## 下一階段

第一個真實 provider 僅建議：
A 產線 → RunningHub → 單筆低成本測試 → 人工審核。

RunningHub WebApp ID、nodeInfo mapping、Secret 與單筆預算封頂未完成前，不切 live。


## v0.3 / P2

P2 已加入「A 產線 → RunningHub → 單筆 5 秒真實測片」的受控入口。

安全限制：
- 只允許 pipeline A
- provider 固定 runninghub
- 一次只允許 1 筆 active job
- 片長固定 5 秒
- 單筆預算上限預設 NT$15
- 必須帶明確核准字串 `APPROVE_SINGLE_PAID_TEST`
- `FACTORY_LIVE_ENABLED=false` 時一律拒絕
- `FACTORY_PUBLISH_ENABLED=false` 必須保持關閉
- 完成後只停在審核，不自動發布

公開總控頁會讀取：
`GET /api/factory/p2/status`

管理端真實提交：
`POST /api/factory/p2/submit`

目前預設仍為鎖定，不會送出付費任務。
