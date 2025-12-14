# 疑難排解指南 - 設備選單無法載入

如果太陽能板和逆變器下拉選單無法顯示資料，請按照以下步驟排查：

## 步驟 1: 檢查資料庫結構

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇您的專案
3. 前往 **Table Editor** 或 **SQL Editor**
4. 確認以下資料表是否存在：
   - `solar_panels`
   - `inverters`

如果資料表不存在，請執行 `supabase-equipment-schema.sql` 檔案。

## 步驟 2: 檢查資料表是否有資料

在 Supabase SQL Editor 中執行以下查詢：

```sql
-- 檢查太陽能板資料
SELECT COUNT(*) FROM solar_panels;

-- 檢查逆變器資料
SELECT COUNT(*) FROM inverters;

-- 查看太陽能板資料
SELECT * FROM solar_panels LIMIT 5;

-- 查看逆變器資料
SELECT * FROM inverters LIMIT 5;
```

如果資料表為空，請執行 `supabase-equipment-schema.sql` 檔案（包含範例資料）。

## 步驟 3: 檢查瀏覽器控制台

1. 開啟瀏覽器開發者工具（F12）
2. 前往 **Console** 標籤
3. 重新整理頁面
4. 查看是否有錯誤訊息

### 常見錯誤訊息：

#### 錯誤 1: `404 Not Found` 或 `relation "solar_panels" does not exist`
**原因**：資料表尚未建立
**解決方法**：執行 `supabase-equipment-schema.sql`

#### 錯誤 2: `permission denied for table solar_panels`
**原因**：RLS 政策設定不正確
**解決方法**：確認已執行 SQL 檔案中的 RLS 政策設定

#### 錯誤 3: `Failed to fetch` 或網路錯誤
**原因**：網路連線問題或 CORS 設定
**解決方法**：
- 檢查網路連線
- 確認 Supabase URL 和 API Key 是否正確
- 檢查瀏覽器是否封鎖了請求

#### 錯誤 4: `401 Unauthorized`
**原因**：API Key 不正確或已過期
**解決方法**：檢查 `supabase-config.js` 中的 API Key

## 步驟 4: 手動測試 API

在瀏覽器控制台中執行以下代碼，測試 API 連線：

```javascript
// 測試太陽能板 API
fetch('https://ntlmothsjvhdvcykcvex.supabase.co/rest/v1/solar_panels?order=name.asc', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0'
    }
})
.then(res => res.json())
.then(data => console.log('太陽能板資料:', data))
.catch(err => console.error('錯誤:', err));

// 測試逆變器 API
fetch('https://ntlmothsjvhdvcykcvex.supabase.co/rest/v1/inverters?order=name.asc', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0'
    }
})
.then(res => res.json())
.then(data => console.log('逆變器資料:', data))
.catch(err => console.error('錯誤:', err));
```

## 步驟 5: 使用重新載入按鈕

如果資料已存在但選單沒有顯示：
1. 點擊太陽能板選單旁的「🔄 重新載入」按鈕
2. 點擊逆變器選單旁的「🔄 重新載入」按鈕
3. 查看瀏覽器控制台的訊息

## 步驟 6: 手動插入測試資料

如果資料表存在但為空，可以在 Supabase SQL Editor 中執行：

```sql
-- 插入測試太陽能板
INSERT INTO solar_panels (name, manufacturer, model, pmod, vmpp, impp, voc, isc, alpha_voc, alpha_isc, description)
VALUES 
    ('400W 測試太陽能板', '測試製造商', 'TEST-400', 400, 41.0, 9.76, 49.5, 10.35, -0.27, 0.05, '測試用太陽能板');

-- 插入測試逆變器
INSERT INTO inverters (name, manufacturer, model, vinv_max, vinv_mppt_min, vinv_mppt_max, iinv_max, pinv_rated, iinv_rated, description)
VALUES 
    ('10kW 測試逆變器', '測試製造商', 'TEST-10K', 1000, 200, 800, 22, 10, 45.5, '測試用逆變器');
```

## 步驟 7: 檢查 RLS 政策

在 Supabase SQL Editor 中執行：

```sql
-- 檢查太陽能板 RLS 政策
SELECT * FROM pg_policies WHERE tablename = 'solar_panels';

-- 檢查逆變器 RLS 政策
SELECT * FROM pg_policies WHERE tablename = 'inverters';
```

如果沒有政策，請執行 `supabase-equipment-schema.sql` 中的 RLS 政策設定。

## 快速修復步驟

如果以上步驟都無法解決問題，請按照以下順序執行：

1. **重新執行 SQL 檔案**：
   ```sql
   -- 在 Supabase SQL Editor 中執行 supabase-equipment-schema.sql
   ```

2. **清除瀏覽器快取**：
   - 按 `Ctrl + Shift + Delete` (Windows) 或 `Cmd + Shift + Delete` (Mac)
   - 清除快取和 Cookie
   - 重新載入頁面

3. **檢查檔案路徑**：
   - 確認 `supabase-config.js` 檔案存在
   - 確認 `index.html` 中有正確引入 `<script src="supabase-config.js"></script>`

4. **使用無痕模式測試**：
   - 開啟瀏覽器無痕模式
   - 重新載入頁面測試

## 聯絡支援

如果問題仍然存在，請提供以下資訊：
- 瀏覽器控制台的完整錯誤訊息
- Supabase Dashboard 中的錯誤日誌
- 執行的 SQL 查詢結果
- 瀏覽器版本和作業系統

