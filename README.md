# 貓掌煉金術 AI Studio v1.4

《貓掌江湖》CANON 鎖定 AI 短影音製片工作台。

## v1.4
- 中央角色資料新增 Master 圖 URL 與驗證狀態欄位。
- 新增 Google Sheets 同步設定 `config/sync.js`，指向既有中央角色資料庫與角色／圖片／武器／招式／異動／影片紀錄分頁。
- 目前同步模式為 `manual_bridge`：先建立安全接口，不在瀏覽器暴露憑證。
- 每次按「開始煉製」會在瀏覽器 localStorage 保存最近 50 筆製作任務，供後續製作紀錄頁使用。
- 保留 CANON Lock：未知資料不猜測，Master 圖未驗證不得自動當正式素材。

## 下一階段 v1.5
製作「任務紀錄」面板、Master 圖預覽與資料完整度檢查；再評估以安全後端／n8n 連接 Google Sheet，避免把金鑰放進前端。
