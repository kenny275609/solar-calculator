-- 取得所有資料表的結構資訊
-- 在 Supabase SQL Editor 中執行此查詢

-- ========== 1. 列出所有資料表 ==========
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========== 2. 取得所有表的欄位結構 ==========
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.ordinal_position
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- ========== 3. 取得每個表的範例資料（前 1 筆） ==========
-- 這會顯示每個表的實際欄位名稱和資料格式

-- solar_modules 表
SELECT 'solar_modules' as table_name, * FROM solar_modules LIMIT 1;

-- delta_inverters 表
SELECT 'delta_inverters' as table_name, * FROM delta_inverters LIMIT 1;

-- grounding_types 表
SELECT 'grounding_types' as table_name, * FROM grounding_types LIMIT 1;

-- grounding_wire_sizing 表
SELECT 'grounding_wire_sizing' as table_name, * FROM grounding_wire_sizing LIMIT 1;

-- inverter_images 表（如果有資料）
SELECT 'inverter_images' as table_name, * FROM inverter_images LIMIT 1;

