// Supabase 配置
const SUPABASE_URL = 'https://htkdzkkggdfqkkixzrjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2R6a2tnZ2RmcWtraXh6cmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NTY4MTMsImV4cCI6MjA4MTIzMjgxM30.j_-mC4sYil7G_ZblwCgI6pQxHv-hIABEYQKGgjLJGOs';

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
    
    // 獲取所有太陽能板
    async getSolarPanels() {
        return this.request('solar_panels?order=name.asc');
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
    
    // 獲取所有逆變器
    async getInverters() {
        return this.request('inverters?order=name.asc');
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
}

// 創建全局 Supabase 客戶端實例
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

