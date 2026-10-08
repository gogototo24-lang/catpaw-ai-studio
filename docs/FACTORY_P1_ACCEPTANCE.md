# CatPaw AI Factory v0.2 — P1 Mock 驗收

日期：2026-10-08

## 結論

A/B/C/D 四條產線各完成 1 筆完整 Mock 閉環，全部停在 `awaiting_review`。

| 產線 | Mock 結果 | 完成步驟 | 付費呼叫 | 發布呼叫 | 成本 |
|---|---|---:|---:|---:|---:|
| A 貓掌江湖＋喵台灣 | PASS | 6/6 | 0 | 0 | NT$0 |
| B 成年時尚寫真（非露骨） | PASS | 5/5 | 0 | 0 | NT$0 |
| C 音樂 MV | PASS | 7/7 | 0 | 0 | NT$0 |
| D 長篇漫劇 | PASS | 7/7 | 0 | 0 | NT$0 |

## 已完成

- 共用 `factory.job.v1` schema
- 狀態與 step 模型
- provider registry
- paid / publish 安全閘門
- 本機四線 Mock runner
- GitHub Pages 總控頁 `factory.html`
- 四線 Mock 驗收紀錄
- threads-scheduler D1 Factory Core migration

## 安全狀態

```text
factory_mode = mock
paid_enabled = false
publish_enabled = false
real_provider_calls = 0
mock_assets_publishable = false
```

B 產線只允許成年、非露骨、合法授權的時尚寫真內容。

## 下一個安全啟用 Provider

第一個真實 provider 建議只開：

```text
A 貓掌江湖／喵台灣
→ RunningHub
→ 單筆任務
→ 人工核准
→ 預算封頂
→ 完成後停在 awaiting_review
```

啟用前仍需要：
1. RunningHub API Key 放 Secret。
2. 核實低成本 AI App WebApp ID。
3. 核實 nodeInfo nodeId / fieldName mapping。
4. 設單筆預算上限。
5. 明確核准一次真實送單。

其他三線保持 Mock。
