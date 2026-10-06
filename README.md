# 貓掌煉金術 AI Studio v2.1

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v2.1 Mock 閉環
新增可匯入 n8n 的 `n8n/catpaw-v2.1-mock-closed-loop.json`：

Webhook → Payload 驗證 → CANON / Master Gate → Provider Router → PixVerse MOCK → Callback + Google Sheet Row。

### 安全測試原則
- PixVerse 目前是 MOCK，不呼叫正式 API、不消耗影片點數。
- workflow 預設 `active:false`。
- 公開 GitHub 不保存 n8n webhook、PixVerse key、Google 憑證。
- Master 未核准時只允許 mock 測試，不應進正式生成。

## 下一步 v2.2
在 n8n 實際匯入此 workflow 後，用一筆舞魅喵測試 payload 驗證完整資料流；確認成功後才加入 Google Sheets 真實 Append Row 與 PixVerse 正式 provider 節點。
