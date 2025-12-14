# 太陽光電規劃系統 - 專案分析與部署指南

## 📋 專案概述

這是一個**太陽光電系統規劃計算工具**，用於計算太陽能板陣列配置、逆變器選型、線徑規劃和保護元件規格。系統採用純前端架構，使用 Supabase 作為後端資料庫服務。

### 核心功能

1. **計算功能**
   - 太陽能板陣列規劃（串並聯配置）
   - 逆變器選型驗證
   - DC/AC 側線徑計算與電壓降分析
   - 保護元件規格計算（保險絲、斷路器）

2. **設備資料庫**
   - 太陽能板型號選單（從 Supabase 載入）
   - 逆變器型號選單（從 Supabase 載入）
   - 支援手動輸入設備規格

3. **專案管理**
   - 保存計算結果到 Supabase
   - 載入已保存的專案
   - 專案列表查看與刪除

4. **報表功能**
   - PDF 報表匯出（使用瀏覽器列印功能）

## 🏗️ 技術架構

### 前端技術
- **語言**：純 HTML/CSS/JavaScript（無框架依賴）
- **UI**：響應式設計，模態框介面
- **PDF 匯出**：瀏覽器原生列印功能

### 後端服務
- **資料庫**：Supabase (PostgreSQL)
- **API**：Supabase REST API
- **資料格式**：JSONB 儲存專案資料
- **安全**：Row Level Security (RLS)

### 資料表結構

1. **projects** - 專案資料表
   - 儲存計算輸入參數和結果
   - JSONB 格式儲存複雜資料

2. **solar_panels** - 太陽能板資料表
   - 儲存太陽能板型號和規格

3. **inverters** - 逆變器資料表
   - 儲存逆變器型號和規格

## 📁 檔案結構

```
.
├── index.html                      # 主應用程式（所有功能都在此檔案）
├── supabase-config.js              # Supabase 客戶端配置
├── supabase-schema.sql             # 專案資料表結構
├── supabase-equipment-schema.sql   # 設備資料表結構
├── README.md                       # 使用說明
├── SUPABASE_SETUP.md              # Supabase 設定指南
├── INTEGRATION_GUIDE.md           # 整合現有資料表指南
├── TROUBLESHOOTING.md             # 疑難排解指南
└── DEPLOYMENT_GUIDE.md            # 本文件（部署指南）
```

## 🚀 部署方式

### 方式一：靜態網站託管（推薦）

由於這是純前端應用，最簡單的部署方式是使用靜態網站託管服務。

#### 選項 1：GitHub Pages（免費）

1. **建立 GitHub 儲存庫**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/solar-calculator.git
   git push -u origin main
   ```

2. **啟用 GitHub Pages**
   - 前往儲存庫 Settings → Pages
   - Source 選擇 `main` 分支
   - 儲存後，網站將在 `https://yourusername.github.io/solar-calculator/` 上線

3. **注意事項**
   - 確保 `supabase-config.js` 中的 API Key 是公開的（anon key）
   - 如果需要保護 API Key，考慮使用環境變數（需要構建工具）

#### 選項 2：Netlify（免費，推薦）

1. **準備部署**
   ```bash
   # 確保所有檔案都在專案根目錄
   ```

2. **部署步驟**
   - 前往 [Netlify](https://www.netlify.com/)
   - 註冊/登入帳號
   - 點擊 "Add new site" → "Deploy manually"
   - 將整個專案資料夾拖放到部署區域
   - 等待部署完成

3. **自訂網域**（可選）
   - 在 Netlify 設定中可綁定自訂網域

#### 選項 3：Vercel（免費）

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署**
   ```bash
   cd /Users/linzongyi/Desktop/yu
   vercel
   ```

3. **或使用網頁介面**
   - 前往 [Vercel](https://vercel.com/)
   - 匯入 GitHub 儲存庫或上傳檔案

#### 選項 4：Supabase Storage + CDN

1. **上傳檔案到 Supabase Storage**
   - 在 Supabase Dashboard 建立 Storage bucket
   - 上傳所有檔案到 bucket
   - 設定為公開存取

2. **使用 CDN**
   - 可以透過 Supabase Storage 的公開 URL 存取

### 方式二：傳統 Web 伺服器

#### Apache 伺服器

1. **上傳檔案**
   ```bash
   # 將所有檔案上傳到 Apache 的 DocumentRoot
   # 例如：/var/www/html/solar-calculator/
   ```

2. **設定虛擬主機**（可選）
   ```apache
   <VirtualHost *:80>
       ServerName solar-calculator.yourdomain.com
       DocumentRoot /var/www/html/solar-calculator
   </VirtualHost>
   ```

#### Nginx 伺服器

1. **上傳檔案**
   ```bash
   # 將所有檔案上傳到 Nginx 的網站目錄
   # 例如：/usr/share/nginx/html/solar-calculator/
   ```

2. **設定 Nginx**
   ```nginx
   server {
       listen 80;
       server_name solar-calculator.yourdomain.com;
       root /usr/share/nginx/html/solar-calculator;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### Node.js 簡單伺服器

如果需要本地測試或簡單部署：

1. **建立 server.js**
   ```javascript
   const http = require('http');
   const fs = require('fs');
   const path = require('path');
   
   const port = process.env.PORT || 3000;
   
   const mimeTypes = {
       '.html': 'text/html',
       '.js': 'text/javascript',
       '.css': 'text/css',
       '.json': 'application/json',
       '.png': 'image/png',
       '.jpg': 'image/jpg',
       '.gif': 'image/gif',
       '.svg': 'image/svg+xml'
   };
   
   const server = http.createServer((req, res) => {
       let filePath = '.' + req.url;
       if (filePath === './') filePath = './index.html';
       
       const extname = String(path.extname(filePath)).toLowerCase();
       const contentType = mimeTypes[extname] || 'application/octet-stream';
       
       fs.readFile(filePath, (error, content) => {
           if (error) {
               if (error.code === 'ENOENT') {
                   res.writeHead(404);
                   res.end('File not found');
               } else {
                   res.writeHead(500);
                   res.end('Server error');
               }
           } else {
               res.writeHead(200, { 'Content-Type': contentType });
               res.end(content, 'utf-8');
           }
       });
   });
   
   server.listen(port, () => {
       console.log(`Server running at http://localhost:${port}/`);
   });
   ```

2. **執行伺服器**
   ```bash
   node server.js
   ```

## ⚙️ 部署前準備

### 1. 設定 Supabase 資料庫

**重要**：在部署前端之前，必須先完成 Supabase 資料庫設定。

#### 步驟 1：建立資料表

在 Supabase SQL Editor 中依序執行：

1. **執行 `supabase-schema.sql`**
   - 建立 `projects` 資料表
   - 設定 RLS 政策

2. **執行 `supabase-equipment-schema.sql`**
   - 建立 `solar_panels` 和 `inverters` 資料表
   - 插入範例資料（可選）

#### 步驟 2：驗證資料表

```sql
-- 檢查資料表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'solar_panels', 'inverters');

-- 檢查資料筆數
SELECT 'projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'solar_panels', COUNT(*) FROM solar_panels
UNION ALL
SELECT 'inverters', COUNT(*) FROM inverters;
```

### 2. 確認 Supabase 配置

檢查 `supabase-config.js` 中的設定：

```javascript
const SUPABASE_URL = 'https://ntlmothsjvhdvcykcvex.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

**注意事項**：
- ✅ 使用 **anon key**（公開金鑰）是安全的，因為有 RLS 保護
- ❌ 不要使用 **service_role key**（會繞過 RLS）
- 如果更換 Supabase 專案，需要更新這兩個值

### 3. 測試本地連線

在部署前，先在本地測試：

```bash
# 使用 Python 簡單伺服器
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server

# 然後在瀏覽器開啟 http://localhost:8000
```

測試項目：
- [ ] 頁面正常載入
- [ ] 太陽能板選單可以載入資料
- [ ] 逆變器選單可以載入資料
- [ ] 可以執行計算
- [ ] 可以保存專案
- [ ] 可以載入專案
- [ ] 可以匯出 PDF

## 🔒 安全性考量

### 目前設定（開發/測試環境）

- 使用 anon key（公開金鑰）
- RLS 政策允許所有人讀寫（`USING (true) WITH CHECK (true)`）

### 生產環境建議

1. **加強 RLS 政策**
   ```sql
   -- 刪除寬鬆政策
   DROP POLICY IF EXISTS "Allow all operations for anon users" ON projects;
   
   -- 建立基於用戶的政策（需要 Supabase Auth）
   CREATE POLICY "Users can manage own projects" ON projects
       FOR ALL
       USING (auth.uid()::text = (inputs->>'userId')::text)
       WITH CHECK (auth.uid()::text = (inputs->>'userId')::text);
   ```

2. **啟用 Supabase Auth**
   - 在應用程式中整合用戶認證
   - 修改前端代碼以包含用戶 ID

3. **API 金鑰保護**
   - 雖然 anon key 可以公開，但建議使用環境變數
   - 考慮使用 Supabase Edge Functions 作為 API 中間層

## 📊 部署檢查清單

### 部署前

- [ ] Supabase 資料庫已設定完成
- [ ] 所有資料表已建立（projects, solar_panels, inverters）
- [ ] RLS 政策已設定
- [ ] 測試資料已插入（可選）
- [ ] `supabase-config.js` 中的 URL 和 Key 正確
- [ ] 本地測試通過

### 部署後

- [ ] 網站可以正常存取
- [ ] 所有功能正常運作
- [ ] 資料庫連線正常
- [ ] 設備選單可以載入
- [ ] 專案管理功能正常
- [ ] PDF 匯出功能正常
- [ ] 響應式設計在手機上正常顯示

## 🐛 常見部署問題

### 問題 1：CORS 錯誤

**症狀**：瀏覽器控制台顯示 CORS 錯誤

**解決方法**：
- Supabase 預設已處理 CORS
- 如果仍有問題，檢查 Supabase 專案設定
- 確認請求的 URL 正確

### 問題 2：404 錯誤（找不到資源）

**症狀**：某些檔案無法載入

**解決方法**：
- 確認所有檔案都已上傳
- 檢查檔案路徑是否正確
- 確認 `index.html` 中的 `<script src="supabase-config.js">` 路徑正確

### 問題 3：資料庫連線失敗

**症狀**：設備選單無法載入，專案無法保存

**解決方法**：
- 檢查 `supabase-config.js` 中的 URL 和 Key
- 確認 Supabase 專案狀態正常
- 檢查瀏覽器控制台的錯誤訊息
- 參考 `TROUBLESHOOTING.md` 進行排查

### 問題 4：PDF 匯出無法使用

**症狀**：點擊匯出 PDF 沒有反應

**解決方法**：
- 檢查瀏覽器是否允許彈出視窗
- 某些瀏覽器擴充功能可能阻擋列印功能
- 嘗試使用不同瀏覽器測試

## 📈 效能優化建議

### 1. 啟用 Gzip 壓縮

如果使用 Nginx 或 Apache，啟用 Gzip 壓縮可以減少傳輸時間。

### 2. 使用 CDN

將靜態資源（CSS、JS）放在 CDN 上可以加速載入。

### 3. 快取策略

設定適當的 HTTP 快取標頭：
```
Cache-Control: public, max-age=31536000
```

### 4. 程式碼優化

- 考慮將 JavaScript 程式碼拆分
- 使用 Web Workers 處理複雜計算（如果需要）

## 🔄 更新部署

當需要更新應用程式時：

1. **更新檔案**
   - 修改本地檔案
   - 測試確認無誤

2. **重新部署**
   - 如果使用 Git，推送更新後自動部署
   - 如果手動上傳，重新上傳修改的檔案

3. **清除快取**
   - 提醒用戶清除瀏覽器快取
   - 或使用版本號碼強制更新

## 📞 需要協助？

如果部署過程中遇到問題：

1. 查看 `TROUBLESHOOTING.md`
2. 檢查瀏覽器控制台錯誤訊息
3. 查看 Supabase Dashboard 的日誌
4. 確認所有設定步驟都已完成

## 🎯 快速部署流程總結

1. ✅ 在 Supabase 建立資料表（執行 SQL 檔案）
2. ✅ 確認 `supabase-config.js` 設定正確
3. ✅ 本地測試確認功能正常
4. ✅ 選擇部署平台（GitHub Pages / Netlify / Vercel）
5. ✅ 上傳檔案或連接 Git 儲存庫
6. ✅ 測試部署後的網站
7. ✅ 完成！

---

**祝您部署順利！** 🚀

