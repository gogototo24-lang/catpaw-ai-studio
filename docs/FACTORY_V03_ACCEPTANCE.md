# CatPaw Factory v0.3：P1 驗收＋A 線啟用前檢查

此增量接續 v0.2，不改原 UI、n8n 或現有 provider；B/C/D 仍為 Mock。

## 執行

```sh
python -m unittest discover -s tests -v
python factory/mock_factory.py --output factory/results
python factory/preflight_a.py --config factory/a-runninghub-preflight.example.json --canon /path/to/central-v3.json --output factory/a-preflight-result-v03.json
```

preflight 返回 2 表示被安全閘門阻擋，不是工具故障。配置範例不放金鑰；credential_configured 只是部署者確認，不能代替伺服器驗證 Secret。

## 驗收

6 組測試通過：四線完整 Mock／冪等、付費與發布拒絕、審核等待、A 線限定與單筆限制、中央 CANON 不被 payload 覆寫、readiness 通過仍不執行。

A/B/C/D 既有實跑紀錄仍在 factory/mock-run-v02.json，全部 ready、成本 0、published=false。v0.3 沒有再生成付費影片。

A 線啟用前檢查本次使用使用者提供中央 v3：舞魅喵 MZ_019、AST_0008。結果 blocked；缺少：預算、RunningHub Secret 確認、實際 App ID、verified node mapping、CANON 鎖定、角色素材 READY／審核核准、素材核准／HTTPS URL、單筆付費批次核准。詳見 a-preflight-result-v03.json。

此版本預備 5 秒、1 筆測片；程式內 100 TWD 是預備配置上限，不代表使用者已授權 100 元，實際 max_cost_twd 仍空白。角色審核狀態僅接受 APPROVED/PASS，若正式中央資料庫另有核准枚舉，須先確認後增加顯式映射；不可透過改狀態繞過。

## 下一個真實 provider

只允許優先準備 **A＋threads-scheduler 現有 RunningHub 影片 adapter**。不啟用 B/C/D、PixVerse 或自動發布。接線前需：

1. 使用者核准舞魅喵定稿素材，透過正常資料庫變更記錄更新角色／素材。
2. RunningHub App 的實際 API Call/nodeInfo（不能照抄範例）；確認支援 5 秒與目標比例。
3. 在既有 Cloudflare Secret 配置 Key，服務端驗證可用性。
4. 設定單筆预算、成本查核方式與批次核准。
5. Staging 单笔提交，保存 taskId；未知提交不得自動再發。成品回 R2，進人工審核，不排發布。

preflight 是離線配置檢查，**不是完整 live adapter**。ready_for_manual_enable 也不代表 URL 可讀、真實扣款已知或 App 已測通。正式提交仍由原 Worker adapter，需補 Factory→media_jobs 映射；本次不部署、不合併 PR。
