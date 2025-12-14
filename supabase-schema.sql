-- 太陽光電規劃系統 - Supabase 資料庫結構
-- 在 Supabase SQL Editor 中執行此檔案

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
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- 建立更新時間的自動更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 設定 RLS 政策（允許所有人讀寫，因為使用 anon key）
-- 注意：在生產環境中，您應該設定更嚴格的安全政策
DROP POLICY IF EXISTS "Allow all operations for anon users" ON projects;

CREATE POLICY "Allow all operations for anon users" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 插入測試資料（可選）
-- INSERT INTO projects (name, description, inputs, results)
-- VALUES (
--     '測試專案',
--     '這是一個測試專案',
--     '{
--         "Psys": 10000,
--         "Vgrid": 220,
--         "Tmin": -10,
--         "Tmax": 40,
--         "Pmod": 400,
--         "Vmpp": 41.0,
--         "Impp": 9.76,
--         "Voc": 49.5,
--         "Isc": 10.35,
--         "alphaVoc": -0.0027,
--         "alphaIsc": 0.0005,
--         "VinvMax": 1000,
--         "VinvMpptMin": 200,
--         "VinvMpptMax": 800,
--         "IinvMax": 22,
--         "PinvRated": 10000,
--         "IinvRated": 45.5,
--         "Ldc": 50,
--         "Lac": 20,
--         "Twire": 40,
--         "rho": 0.0172
--     }'::jsonb,
--     '{
--         "Nseries": 20,
--         "Nparallel": 2,
--         "Ntotal": 40,
--         "VocTmin": 58.2,
--         "VmppTmax": 38.5,
--         "IscTmax": 10.52,
--         "Varray": 820,
--         "Iarray": 21.04,
--         "Nmin": 18,
--         "Nmax": 22,
--         "PinvRated": 10000,
--         "inverterCheck": true,
--         "IDcMax": 26.3,
--         "AdcMin": 6,
--         "VdcDrop": 1.5,
--         "Ldc": 50,
--         "IAcMax": 56.875,
--         "AacMin": 10,
--         "VacDrop": 2.1,
--         "Lac": 20,
--         "Ifuse": 13,
--         "Vfuse": 70,
--         "IDcBreaker": 27,
--         "VDcBreaker": 70,
--         "IAcBreaker": 57,
--         "VAcBreaker": 264
--     }'::jsonb
-- );

