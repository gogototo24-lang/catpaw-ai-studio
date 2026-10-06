# 貓掌煉金術 AI Studio v1.2

《貓掌江湖》CANON 鎖定短影音製作系統。

## v1.2
- 保留 v1.1 的爆款鉤子、3 鏡分鏡、PixVerse / Flow、首尾幀、口白/BGM、剪映與 YouTube Shorts 輸出。
- 新增 `data/characters.js` 中央角色資料層。
- 角色資料包含：角色 ID、母喵設定、CANON 狀態、外觀、武器、屬性能量、招式與口白。
- 網頁載入中央資料層並顯示資料庫版本。

## 資料安全規則
只有已確認設定可標記 CANON_LOCKED；未知資料保持空白，不自行猜測。角色改名保留既有 ID 與別名映射。Master 圖 URL 必須是實際可讀取且經確認的素材。

## 下一階段
v1.3：讓角色選單與製作包直接由中央資料層動態生成，再預留 Google Sheet / API 同步介面。
