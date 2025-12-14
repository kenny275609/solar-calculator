-- 太陽光電規劃系統 - 設備資料表（太陽能板和逆變器）
-- 在 Supabase SQL Editor 中執行此檔案

-- ========== 太陽能板資料表 ==========
CREATE TABLE IF NOT EXISTS solar_panels (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    manufacturer TEXT,
    model TEXT,
    pmod NUMERIC NOT NULL,              -- 單片功率 (W)
    vmpp NUMERIC NOT NULL,               -- 最大功率點電壓 (V)
    impp NUMERIC NOT NULL,               -- 最大功率點電流 (A)
    voc NUMERIC NOT NULL,                -- 開路電壓 (V)
    isc NUMERIC NOT NULL,                -- 短路電流 (A)
    alpha_voc NUMERIC NOT NULL,          -- 電壓溫度係數 (%/°C)
    alpha_isc NUMERIC NOT NULL,          -- 電流溫度係數 (%/°C)
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_solar_panels_name ON solar_panels(name);
CREATE INDEX IF NOT EXISTS idx_solar_panels_manufacturer ON solar_panels(manufacturer);

-- 更新時間觸發器
CREATE TRIGGER update_solar_panels_updated_at 
    BEFORE UPDATE ON solar_panels
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 啟用 RLS
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;

-- RLS 政策
DROP POLICY IF EXISTS "Allow all operations for anon users" ON solar_panels;
CREATE POLICY "Allow all operations for anon users" ON solar_panels
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ========== 逆變器資料表 ==========
CREATE TABLE IF NOT EXISTS inverters (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    manufacturer TEXT,
    model TEXT,
    vinv_max NUMERIC NOT NULL,          -- 最大輸入電壓 (V)
    vinv_mppt_min NUMERIC NOT NULL,     -- MPPT 最小電壓 (V)
    vinv_mppt_max NUMERIC NOT NULL,     -- MPPT 最大電壓 (V)
    iinv_max NUMERIC NOT NULL,          -- 最大輸入電流 (A)
    pinv_rated NUMERIC NOT NULL,        -- 額定輸出功率 (kW)
    iinv_rated NUMERIC NOT NULL,        -- 額定輸出電流 (A)
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_inverters_name ON inverters(name);
CREATE INDEX IF NOT EXISTS idx_inverters_manufacturer ON inverters(manufacturer);

-- 更新時間觸發器
CREATE TRIGGER update_inverters_updated_at 
    BEFORE UPDATE ON inverters
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 啟用 RLS
ALTER TABLE inverters ENABLE ROW LEVEL SECURITY;

-- RLS 政策
DROP POLICY IF EXISTS "Allow all operations for anon users" ON inverters;
CREATE POLICY "Allow all operations for anon users" ON inverters
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ========== 插入範例資料 ==========

-- 插入範例太陽能板資料
INSERT INTO solar_panels (name, manufacturer, model, pmod, vmpp, impp, voc, isc, alpha_voc, alpha_isc, description)
VALUES 
    ('400W 單晶矽太陽能板', '範例製造商A', 'SP-400', 400, 41.0, 9.76, 49.5, 10.35, -0.27, 0.05, '高效能單晶矽太陽能板'),
    ('450W 單晶矽太陽能板', '範例製造商A', 'SP-450', 450, 41.8, 10.77, 50.2, 11.15, -0.27, 0.05, '大功率單晶矽太陽能板'),
    ('500W 單晶矽太陽能板', '範例製造商B', 'PV-500', 500, 42.5, 11.76, 51.0, 12.35, -0.28, 0.05, '超高功率太陽能板'),
    ('350W 多晶矽太陽能板', '範例製造商C', 'MP-350', 350, 38.5, 9.09, 46.5, 9.65, -0.30, 0.04, '經濟型多晶矽太陽能板')
ON CONFLICT DO NOTHING;

-- 插入範例逆變器資料
INSERT INTO inverters (name, manufacturer, model, vinv_max, vinv_mppt_min, vinv_mppt_max, iinv_max, pinv_rated, iinv_rated, description)
VALUES 
    ('10kW 逆變器', '範例製造商X', 'INV-10K', 1000, 200, 800, 22, 10, 45.5, '10kW 單相逆變器，適用於220V電網'),
    ('15kW 逆變器', '範例製造商X', 'INV-15K', 1000, 200, 800, 30, 15, 68.2, '15kW 單相逆變器，適用於220V電網'),
    ('20kW 逆變器', '範例製造商Y', 'INV-20K', 1100, 250, 900, 40, 20, 30.4, '20kW 三相逆變器，適用於380V電網'),
    ('30kW 逆變器', '範例製造商Y', 'INV-30K', 1100, 250, 900, 60, 30, 45.6, '30kW 三相逆變器，適用於380V電網')
ON CONFLICT DO NOTHING;

