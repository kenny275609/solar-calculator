# Supabase 資料庫設定說明

本文件說明如何在 Supabase 中設定太陽光電規劃系統所需的資料庫結構。

## 步驟 1: 登入 Supabase Dashboard

1. 前往 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇您的專案：`ntlmothsjvhdvcykcvex`

## 步驟 2: 建立資料表

### 建立 `projects` 資料表

在 Supabase SQL Editor 中執行以下 SQL 語句：

```sql
-- 建立專案資料表
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    inputs JSONB NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

-- 建立更新時間的自動更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 設定 RLS 政策（允許所有人讀寫，因為使用 anon key）
-- 注意：在生產環境中，您應該設定更嚴格的安全政策
CREATE POLICY "Allow all operations for anon users" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## 步驟 3: 驗證資料表結構

執行以下查詢確認資料表已正確建立：

```sql
-- 檢查資料表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'projects';

-- 檢查資料表結構
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects';
```

## 資料表結構說明

### `projects` 資料表欄位

| 欄位名稱 | 資料型別 | 說明 |
|---------|---------|------|
| `id` | BIGSERIAL | 主鍵，自動遞增 |
| `name` | TEXT | 專案名稱（必填） |
| `description` | TEXT | 專案描述（選填） |
| `inputs` | JSONB | 儲存計算輸入參數的 JSON 物件 |
| `results` | JSONB | 儲存計算結果的 JSON 物件 |
| `created_at` | TIMESTAMPTZ | 建立時間 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

### `inputs` JSONB 結構範例

```json
{
  "Psys": 10000,
  "Vgrid": 220,
  "Tmin": -10,
  "Tmax": 40,
  "Pmod": 400,
  "Vmpp": 41.0,
  "Impp": 9.76,
  "Voc": 49.5,
  "Isc": 10.35,
  "alphaVoc": -0.0027,
  "alphaIsc": 0.0005,
  "VinvMax": 1000,
  "VinvMpptMin": 200,
  "VinvMpptMax": 800,
  "IinvMax": 22,
  "PinvRated": 10000,
  "IinvRated": 45.5,
  "Ldc": 50,
  "Lac": 20,
  "Twire": 40,
  "rho": 0.0172
}
```

### `results` JSONB 結構範例

```json
{
  "Nseries": 20,
  "Nparallel": 2,
  "Ntotal": 40,
  "VocTmin": 58.2,
  "VmppTmax": 38.5,
  "IscTmax": 10.52,
  "Varray": 820,
  "Iarray": 21.04,
  "Nmin": 18,
  "Nmax": 22,
  "PinvRated": 10000,
  "inverterCheck": true,
  "IDcMax": 26.3,
  "AdcMin": 6,
  "VdcDrop": 1.5,
  "Ldc": 50,
  "IAcMax": 56.875,
  "AacMin": 10,
  "VacDrop": 2.1,
  "Lac": 20,
  "Ifuse": 13,
  "Vfuse": 70,
  "IDcBreaker": 27,
  "VDcBreaker": 70,
  "IAcBreaker": 57,
  "VAcBreaker": 264
}
```

## 安全設定建議

### 生產環境建議

在生產環境中，建議修改 RLS 政策以加強安全性：

```sql
-- 刪除原有的寬鬆政策
DROP POLICY IF EXISTS "Allow all operations for anon users" ON projects;

-- 建立更嚴格的政策（需要認證用戶）
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT
    USING (auth.uid()::text = (inputs->>'userId')::text);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT
    WITH CHECK (auth.uid()::text = (inputs->>'userId')::text);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE
    USING (auth.uid()::text = (inputs->>'userId')::text);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE
    USING (auth.uid()::text = (inputs->>'userId')::text);
```

## 測試資料

您可以插入一筆測試資料來驗證設定：

```sql
INSERT INTO projects (name, description, inputs, results)
VALUES (
    '測試專案',
    '這是一個測試專案',
    '{
        "Psys": 10000,
        "Vgrid": 220,
        "Tmin": -10,
        "Tmax": 40,
        "Pmod": 400,
        "Vmpp": 41.0,
        "Impp": 9.76,
        "Voc": 49.5,
        "Isc": 10.35,
        "alphaVoc": -0.0027,
        "alphaIsc": 0.0005,
        "VinvMax": 1000,
        "VinvMpptMin": 200,
        "VinvMpptMax": 800,
        "IinvMax": 22,
        "PinvRated": 10000,
        "IinvRated": 45.5,
        "Ldc": 50,
        "Lac": 20,
        "Twire": 40,
        "rho": 0.0172
    }'::jsonb,
    '{
        "Nseries": 20,
        "Nparallel": 2,
        "Ntotal": 40
    }'::jsonb
);
```

## 疑難排解

### 問題：無法建立資料表

- 確認您有足夠的權限
- 檢查 SQL 語法是否正確
- 查看 Supabase Dashboard 的錯誤訊息

### 問題：無法插入或查詢資料

- 確認 RLS 政策已正確設定
- 檢查 API Key 是否正確
- 查看瀏覽器控制台的錯誤訊息

### 問題：CORS 錯誤

- Supabase 預設已處理 CORS，如果仍有問題，檢查 Supabase 專案設定

## 相關資源

- [Supabase 文件](https://supabase.com/docs)
- [PostgreSQL JSONB 文件](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security 文件](https://supabase.com/docs/guides/auth/row-level-security)

