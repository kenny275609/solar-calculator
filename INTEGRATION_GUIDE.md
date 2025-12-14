# 整合現有 Supabase 資料表指南

如果您在 Supabase 中已經有現有的資料表（如截圖中顯示的 "SQL Solar specs"、"SQL Delta inverter specifications" 等），請按照以下步驟整合：

## 步驟 1: 檢查現有資料表結構

1. 在 Supabase SQL Editor 中執行 `check-existing-tables.sql`
2. 記錄以下資訊：
   - 資料表名稱（例如：`solar_specs`、`delta_inverters` 等）
   - 欄位名稱和資料型別
   - 是否已有資料

## 步驟 2: 選擇整合方案

根據您的現有資料表結構，選擇以下方案之一：

### 方案 A: 表名和欄位名完全相同

如果您的表名是 `solar_panels` 和 `inverters`，且欄位名稱與我們定義的相同：
- 只需執行 RLS 政策設定部分（從 `supabase-equipment-schema.sql` 中提取）
- 不需要重新建立表

### 方案 B: 表名不同但欄位名相同

如果欄位名稱相同但表名不同（例如：`solar_specs`、`delta_inverters`）：
- 創建視圖（VIEW）來對應表名
- 或修改 `supabase-config.js` 中的表名

### 方案 C: 欄位名稱不同

如果欄位名稱不同：
- 創建視圖來對應欄位名稱
- 或修改應用程式代碼以符合現有結構

### 方案 D: 完全不同的結構

如果結構完全不同：
- 可以保留現有表用於其他用途
- 創建新的 `solar_panels` 和 `inverters` 表
- 或遷移現有資料到新表

## 步驟 3: 修改應用程式代碼（如需要）

### 如果表名不同

修改 `supabase-config.js` 中的方法：

```javascript
// 如果您的表名是 'solar_specs' 而不是 'solar_panels'
async getSolarPanels() {
    return this.request('solar_specs?order=name.asc');  // 修改表名
}
```

### 如果欄位名稱不同

修改 `index.html` 中的 `loadSolarPanelSpecs()` 函數：

```javascript
function loadSolarPanelSpecs() {
    // ...
    // 如果欄位名是 'power' 而不是 'pmod'
    document.getElementById('Pmod').value = panel.power || '';  // 修改欄位名
    // ...
}
```

## 步驟 4: 建立對應視圖（推薦方案）

如果不想修改現有表結構，可以建立視圖：

```sql
-- 範例：如果現有表為 'solar_specs'，欄位為 'power', 'v_mpp' 等
CREATE OR REPLACE VIEW solar_panels AS
SELECT 
    id,
    name,
    manufacturer,
    model,
    power AS pmod,
    v_mpp AS vmpp,
    i_mpp AS impp,
    v_oc AS voc,
    i_sc AS isc,
    alpha_voc,
    alpha_isc,
    description,
    created_at,
    updated_at
FROM solar_specs;

-- 對逆變器也做同樣處理
CREATE OR REPLACE VIEW inverters AS
SELECT 
    id,
    name,
    manufacturer,
    model,
    max_voltage AS vinv_max,
    mppt_min AS vinv_mppt_min,
    mppt_max AS vinv_mppt_max,
    max_current AS iinv_max,
    rated_power AS pinv_rated,
    rated_current AS iinv_rated,
    description,
    created_at,
    updated_at
FROM delta_inverters;  -- 請替換為實際表名
```

## 步驟 5: 設定 RLS 政策

無論使用哪種方案，都需要確保 RLS 政策正確設定：

```sql
-- 對視圖或表設定 RLS
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for anon users" ON solar_panels
    FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE inverters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for anon users" ON inverters
    FOR ALL USING (true) WITH CHECK (true);
```

## 快速診斷查詢

執行以下查詢來快速了解現有結構：

```sql
-- 1. 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- 2. 查看特定表的欄位（請替換表名）
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'your_table_name';

-- 3. 查看資料筆數
SELECT 'solar_specs' as table_name, COUNT(*) as count FROM solar_specs
UNION ALL
SELECT 'delta_inverters', COUNT(*) FROM delta_inverters;
```

## 需要協助？

請提供以下資訊，我可以幫您建立客製化的整合腳本：

1. 現有資料表名稱
2. 欄位名稱列表
3. 資料型別
4. 是否已有資料

然後我可以為您建立對應的視圖或修改腳本。

