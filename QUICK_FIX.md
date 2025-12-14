# 快速修復指南 - 無法讀取 Supabase 資料

## 立即診斷步驟

### 步驟 1: 使用診斷工具

1. 在瀏覽器中開啟 `test-supabase-connection.html`
2. 點擊「執行完整診斷」按鈕
3. 查看診斷報告，確認問題所在

### 步驟 2: 檢查瀏覽器控制台

1. 開啟 `index.html`
2. 按 F12 開啟開發者工具
3. 前往 Console 標籤
4. 重新整理頁面
5. 查看是否有錯誤訊息

## 常見問題與解決方法

### 問題 1: 資料表不存在

**症狀**：控制台顯示 `404 Not Found` 或 `relation "solar_panels" does not exist`

**解決方法**：
1. 登入 Supabase Dashboard
2. 前往 SQL Editor
3. 執行 `supabase-equipment-schema.sql` 檔案
4. 確認執行成功（應該看到 "Success" 訊息）

### 問題 2: 資料表存在但沒有資料

**症狀**：選單顯示「資料庫中尚無太陽能板資料」

**解決方法**：
1. 在 Supabase SQL Editor 中執行：
```sql
-- 檢查資料筆數
SELECT COUNT(*) FROM solar_panels;
SELECT COUNT(*) FROM inverters;
```

2. 如果為 0，執行 `supabase-equipment-schema.sql` 中的 INSERT 語句

### 問題 3: RLS 政策未設定

**症狀**：控制台顯示 `permission denied` 或 `403 Forbidden`

**解決方法**：
在 Supabase SQL Editor 中執行：
```sql
-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('solar_panels', 'inverters');

-- 如果 rowsecurity 為 false，執行：
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE inverters ENABLE ROW LEVEL SECURITY;

-- 建立政策
DROP POLICY IF EXISTS "Allow all operations for anon users" ON solar_panels;
CREATE POLICY "Allow all operations for anon users" ON solar_panels
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for anon users" ON inverters;
CREATE POLICY "Allow all operations for anon users" ON inverters
    FOR ALL USING (true) WITH CHECK (true);
```

### 問題 4: API Key 問題

**症狀**：控制台顯示 `401 Unauthorized`

**解決方法**：
1. 確認 `supabase-config.js` 中的 API Key 是否正確
2. 在 Supabase Dashboard > Settings > API 中確認 anon key
3. 如果 key 已更新，請更新 `supabase-config.js`

### 問題 5: CORS 或網路問題

**症狀**：控制台顯示 `Failed to fetch` 或 `Network error`

**解決方法**：
1. 檢查網路連線
2. 確認 Supabase 專案狀態（Dashboard 中查看）
3. 嘗試使用無痕模式開啟頁面
4. 檢查瀏覽器是否封鎖了請求

## 快速測試 SQL

在 Supabase SQL Editor 中執行以下查詢來快速診斷：

```sql
-- 1. 檢查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('solar_panels', 'inverters');

-- 2. 檢查資料筆數
SELECT 
    'solar_panels' as table_name, 
    COUNT(*) as count 
FROM solar_panels
UNION ALL
SELECT 
    'inverters', 
    COUNT(*) 
FROM inverters;

-- 3. 查看前 3 筆資料
SELECT * FROM solar_panels LIMIT 3;
SELECT * FROM inverters LIMIT 3;

-- 4. 檢查 RLS 狀態
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('solar_panels', 'inverters');
```

## 手動測試 API

在瀏覽器控制台中執行：

```javascript
// 測試太陽能板 API
fetch('https://ntlmothsjvhdvcykcvex.supabase.co/rest/v1/solar_panels?limit=1', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0'
    }
})
.then(res => res.json())
.then(data => console.log('✅ 成功:', data))
.catch(err => console.error('❌ 失敗:', err));
```

## 如果以上都無法解決

1. **檢查 Supabase 專案狀態**：
   - 登入 Dashboard
   - 確認專案是否正常運行
   - 查看是否有任何警告或錯誤

2. **檢查檔案路徑**：
   - 確認 `supabase-config.js` 與 `index.html` 在同一目錄
   - 確認檔案名稱正確（大小寫敏感）

3. **清除瀏覽器快取**：
   - 按 Ctrl+Shift+Delete
   - 清除快取和 Cookie
   - 重新載入頁面

4. **使用測試頁面**：
   - 開啟 `test-supabase-connection.html`
   - 執行所有測試
   - 將結果截圖或複製給我

## 聯絡支援

如果問題仍然存在，請提供：
- 瀏覽器控制台的完整錯誤訊息
- `test-supabase-connection.html` 的診斷結果
- Supabase Dashboard 中的錯誤日誌（如果有）
