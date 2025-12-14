// Supabase 配置
const SUPABASE_URL = 'https://ntlmothsjvhdvcykcvex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bG1vdGhzanZoZHZjeWtjdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzEwMzIsImV4cCI6MjA4MTE0NzAzMn0.Fk2zZB7myLQnwx4Hiw678ggQYZ8ZaZDAW7UHH8eobO0';

// 初始化 Supabase 客戶端（如果使用 @supabase/supabase-js）
// 注意：這裡使用 fetch API 直接調用 Supabase REST API
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    async request(endpoint, options = {}) {
        const url = `${this.url}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        };

        try {
            console.log('Supabase 請求:', { method: options.method || 'GET', endpoint, url });
            
            const response = await fetch(url, {
                ...options,
                headers
            });

            console.log('Supabase 響應狀態:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.error('Supabase 錯誤詳情:', errorData);
                } catch (e) {
                    const errorText = await response.text();
                    console.error('Supabase 錯誤回應:', errorText);
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // 處理 204 No Content 響應
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            console.log('Supabase 回應資料:', data);
            return data;
        } catch (error) {
            console.error('Supabase request error:', error);
            console.error('請求詳情:', { url, endpoint, method: options.method || 'GET' });
            throw error;
        }
    }

    // 獲取所有專案
    async getProjects() {
        return this.request('projects?order=created_at.desc');
    }

    // 獲取單個專案
    async getProject(id) {
        return this.request(`projects?id=eq.${id}`);
    }

    // 創建新專案
    async createProject(projectData) {
        return this.request('projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    // 更新專案
    async updateProject(id, projectData) {
        return this.request(`projects?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(projectData)
        });
    }

    // 刪除專案
    async deleteProject(id) {
        return this.request(`projects?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ========== 太陽能板資料 ==========
    
    // 獲取所有太陽能板（支援多種表名）
    async getSolarPanels(tableName = null) {
        const table = tableName || 'solar_panels';
        // 嘗試讀取，如果失敗則嘗試其他可能的表名
        try {
            // 先嘗試不帶排序的查詢，看看表是否存在
            let data = await this.request(`${table}?limit=1`);
            // 如果成功，再查詢所有資料（嘗試按 id 排序，因為所有表應該都有 id）
            return await this.request(`${table}?order=id.asc`);
        } catch (error) {
            // 如果表名是 solar_panels，嘗試 solar_modules
            if (table === 'solar_panels') {
                console.log('嘗試使用 solar_modules 表...');
                try {
                    // 先測試表是否存在
                    await this.request('solar_modules?limit=1');
                    // 如果存在，查詢所有資料
                    return await this.request('solar_modules?order=id.asc');
                } catch (e) {
                    throw error; // 拋出原始錯誤
                }
            }
            throw error;
        }
    }

    // 獲取單個太陽能板
    async getSolarPanel(id) {
        return this.request(`solar_panels?id=eq.${id}`);
    }

    // 創建太陽能板
    async createSolarPanel(panelData) {
        return this.request('solar_panels', {
            method: 'POST',
            body: JSON.stringify(panelData)
        });
    }

    // 更新太陽能板
    async updateSolarPanel(id, panelData) {
        return this.request(`solar_panels?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(panelData)
        });
    }

    // 刪除太陽能板
    async deleteSolarPanel(id) {
        return this.request(`solar_panels?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ========== 逆變器資料 ==========
    
    // 獲取所有逆變器（支援多種表名）
    async getInverters(tableName = null) {
        const table = tableName || 'inverters';
        // 嘗試讀取，如果失敗則嘗試其他可能的表名
        try {
            // 先嘗試不帶排序的查詢，看看表是否存在
            let data = await this.request(`${table}?limit=1`);
            // 如果成功，再查詢所有資料（嘗試按 id 排序）
            return await this.request(`${table}?order=id.asc`);
        } catch (error) {
            // 如果表名是 inverters，嘗試 delta_inverters
            if (table === 'inverters') {
                console.log('嘗試使用 delta_inverters 表...');
                try {
                    // 先測試表是否存在
                    await this.request('delta_inverters?limit=1');
                    // 如果存在，查詢所有資料
                    return await this.request('delta_inverters?order=id.asc');
                } catch (e) {
                    throw error; // 拋出原始錯誤
                }
            }
            throw error;
        }
    }

    // 獲取單個逆變器
    async getInverter(id) {
        return this.request(`inverters?id=eq.${id}`);
    }

    // 創建逆變器
    async createInverter(inverterData) {
        return this.request('inverters', {
            method: 'POST',
            body: JSON.stringify(inverterData)
        });
    }

    // 更新逆變器
    async updateInverter(id, inverterData) {
        return this.request(`inverters?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(inverterData)
        });
    }

    // 刪除逆變器
    async deleteInverter(id) {
        return this.request(`inverters?id=eq.${id}`, {
            method: 'DELETE'
        });
    }

    // ========== 載流量表資料 ==========
    
    // 獲取載流量表（金屬線材，60°C）
    async getAmpacityMetal60C() {
        return this.request('ampacity_metal_60c?order=nominal_area_mm2.asc');
    }

    // 獲取載流量表（金屬線材，75°C）
    async getAmpacityMetal75C() {
        return this.request('ampacity_metal_75c?order=nominal_area_mm2.asc');
    }

    // 獲取載流量表（金屬線材，90°C）
    async getAmpacityMetal90C() {
        return this.request('ampacity_metal_90c?order=nominal_area_mm2.asc');
    }

    // 獲取載流量表（PVC 線材，60°C）
    async getAmpacityPVC60C() {
        return this.request('ampacity_pvc_60c?order=nominal_area_mm2.asc');
    }

    // 根據線徑和溫度獲取載流量
    async getAmpacity(nominalArea, wireType = 'metal', temperature = 60) {
        let tableName = '';
        if (wireType === 'metal') {
            if (temperature === 60) tableName = 'ampacity_metal_60c';
            else if (temperature === 75) tableName = 'ampacity_metal_75c';
            else if (temperature === 90) tableName = 'ampacity_metal_90c';
        } else if (wireType === 'pvc') {
            tableName = 'ampacity_pvc_60c';
        }
        
        if (!tableName) {
            throw new Error(`不支援的線材類型或溫度: ${wireType}, ${temperature}°C`);
        }
        
        // 查詢指定線徑的載流量
        return this.request(`${tableName}?nominal_area_mm2=eq.${nominalArea}`);
    }

    // ========== 電纜阻抗資料 ==========
    
    // 獲取電纜阻抗表
    async getCableImpedance() {
        return this.request('cable_impedance_25c?order=nominal_area_mm2.asc');
    }

    // 根據線徑獲取阻抗
    async getCableImpedanceBySize(nominalArea) {
        return this.request(`cable_impedance_25c?nominal_area_mm2=eq.${nominalArea}`);
    }

    // ========== 導管尺寸資料 ==========
    
    // 獲取導管尺寸表（非金屬導管）
    async getConduitSizingNonMetallic() {
        return this.request('conduit_sizing_non_metallic?order=conduit_size.asc');
    }

    // 獲取導管尺寸表（厚金屬導管）
    async getConduitSizingThickMetal() {
        return this.request('conduit_sizing_thick_metal?order=conduit_size.asc');
    }

    // 獲取導管尺寸表（薄金屬導管）
    async getConduitSizingThinMetal() {
        return this.request('conduit_sizing_thin_metal?order=conduit_size.asc');
    }

    // 獲取導管尺寸表（可彎曲非金屬導管）
    async getConduitSizingFlexNonMetallic() {
        return this.request('conduit_sizing_flex_non_metallic?order=conduit_size.asc');
    }

    // ========== 接地相關資料 ==========
    
    // 獲取接地類型
    async getGroundingTypes() {
        return this.request('grounding_types?order=id.asc');
    }

    // 獲取接地線尺寸表
    async getGroundingWireSizing() {
        return this.request('grounding_wire_sizing?order=id.asc');
    }

    // ========== 通用方法：讀取任何表 ==========
    
    // 通用方法：讀取任何資料表
    async getTable(tableName, filters = {}, orderBy = null, limit = null) {
        let query = tableName;
        const params = [];
        
        // 添加篩選條件
        if (Object.keys(filters).length > 0) {
            const filterParts = Object.entries(filters).map(([key, value]) => {
                return `${key}=eq.${encodeURIComponent(value)}`;
            });
            query += '?' + filterParts.join('&');
        } else {
            query += '?';
        }
        
        // 添加排序
        if (orderBy) {
            query += (query.includes('?') && !query.endsWith('?')) ? '&' : '';
            query += `order=${orderBy}`;
        }
        
        // 添加限制
        if (limit) {
            query += (query.includes('?') && !query.endsWith('?')) ? '&' : '';
            query += `limit=${limit}`;
        }
        
        return this.request(query);
    }

    // 通用方法：根據條件查詢
    async queryTable(tableName, options = {}) {
        const {
            select = '*',
            filters = {},
            orderBy = null,
            orderDirection = 'asc',
            limit = null,
            offset = null
        } = options;
        
        let query = `${tableName}?select=${select}`;
        
        // 添加篩選條件
        Object.entries(filters).forEach(([key, value]) => {
            query += `&${key}=eq.${encodeURIComponent(value)}`;
        });
        
        // 添加排序
        if (orderBy) {
            query += `&order=${orderBy}.${orderDirection}`;
        }
        
        // 添加限制
        if (limit) {
            query += `&limit=${limit}`;
        }
        
        // 添加偏移
        if (offset) {
            query += `&offset=${offset}`;
        }
        
        return this.request(query);
    }
}

// 創建全局 Supabase 客戶端實例
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

