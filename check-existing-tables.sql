-- 檢查現有資料表結構
-- 在 Supabase SQL Editor 中執行此查詢

-- ========== 檢查所有資料表 ==========
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========== 檢查太陽能板相關資料表 ==========
-- 查看是否有 solar_panels 或類似的表
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public' 
    AND (
        table_name ILIKE '%solar%' 
        OR table_name ILIKE '%panel%'
        OR table_name ILIKE '%pv%'
    );

-- ========== 檢查逆變器相關資料表 ==========
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public' 
    AND (
        table_name ILIKE '%inverter%'
        OR table_name ILIKE '%delta%'
    );

-- ========== 檢查線材相關資料表 ==========
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public' 
    AND (
        table_name ILIKE '%cable%'
        OR table_name ILIKE '%wire%'
    );

-- ========== 如果找到 solar_panels 表，查看其結構 ==========
-- 請將 'solar_panels' 替換為您實際的表名
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'solar_panels'  -- 請替換為實際表名
ORDER BY ordinal_position;

-- ========== 如果找到 inverters 表，查看其結構 ==========
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'inverters'  -- 請替換為實際表名
ORDER BY ordinal_position;

-- ========== 查看現有資料 ==========
-- 如果表存在，查看資料筆數
-- SELECT COUNT(*) FROM solar_panels;  -- 請替換為實際表名
-- SELECT COUNT(*) FROM inverters;     -- 請替換為實際表名

