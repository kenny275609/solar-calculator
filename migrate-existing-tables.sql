-- 遷移/整合現有資料表的腳本
-- 請先執行 check-existing-tables.sql 確認現有表結構
-- 然後根據實際情況修改此腳本

-- ========== 方案 1: 如果現有表結構與我們需要的不同 ==========
-- 需要根據實際表結構調整欄位對應

-- 範例：如果現有表名為 'solar_specs'，欄位名不同
-- 可以創建視圖或別名表來對應

-- ========== 方案 2: 如果現有表結構相同，只需確保 RLS 政策 ==========

-- 檢查並設定太陽能板表的 RLS（請替換表名）
-- ALTER TABLE your_solar_table_name ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Allow all operations for anon users" ON your_solar_table_name;
-- CREATE POLICY "Allow all operations for anon users" ON your_solar_table_name
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);

-- ========== 方案 3: 如果欄位名稱不同，創建對應視圖 ==========
-- 範例：假設現有表欄位為大寫或不同命名

-- CREATE OR REPLACE VIEW solar_panels AS
-- SELECT 
--     id,
--     name,
--     manufacturer,
--     model,
--     power AS pmod,           -- 假設原欄位名為 power
--     v_mpp AS vmpp,           -- 假設原欄位名為 v_mpp
--     i_mpp AS impp,           -- 假設原欄位名為 i_mpp
--     v_oc AS voc,             -- 假設原欄位名為 v_oc
--     i_sc AS isc,             -- 假設原欄位名為 i_sc
--     alpha_voc,
--     alpha_isc,
--     description,
--     created_at,
--     updated_at
-- FROM your_existing_solar_table;

-- ========== 方案 4: 如果表名不同，創建別名 ==========
-- CREATE OR REPLACE VIEW solar_panels AS
-- SELECT * FROM your_existing_solar_table_name;

-- ========== 方案 5: 合併現有資料到新表 ==========
-- 如果現有表有資料但結構不同，可以遷移資料

-- INSERT INTO solar_panels (name, manufacturer, model, pmod, vmpp, impp, voc, isc, alpha_voc, alpha_isc, description)
-- SELECT 
--     name,
--     manufacturer,
--     model,
--     power,      -- 請根據實際欄位名調整
--     v_mpp,      -- 請根據實際欄位名調整
--     i_mpp,      -- 請根據實際欄位名調整
--     v_oc,       -- 請根據實際欄位名調整
--     i_sc,       -- 請根據實際欄位名調整
--     alpha_voc,
--     alpha_isc,
--     description
-- FROM your_existing_solar_table
-- ON CONFLICT DO NOTHING;

