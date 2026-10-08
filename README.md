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
