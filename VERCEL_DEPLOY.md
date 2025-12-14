# Vercel 部署指南

## 🚀 使用 Vercel 部署（推薦）

Vercel 是最簡單快速的部署方式，特別適合靜態網站。

## 方法一：使用 Vercel CLI（最快）

### 步驟 1：安裝 Vercel CLI

```bash
npm install -g vercel
```

如果沒有 Node.js，可以先安裝：
- 前往 https://nodejs.org/ 下載安裝
- 或使用 Homebrew：`brew install node`

### 步驟 2：登入 Vercel

```bash
vercel login
```

會開啟瀏覽器讓您登入（可以用 GitHub 帳號登入）

### 步驟 3：部署

在專案目錄執行：

```bash
cd /Users/linzongyi/Desktop/yu
vercel
```

按照提示：
1. 是否要連結到現有專案？選擇 `N`（第一次部署）
2. 專案名稱：直接按 Enter 使用預設名稱，或輸入自訂名稱
3. 目錄：直接按 Enter（使用當前目錄）
4. 是否要覆蓋設定？選擇 `N`

### 步驟 4：完成

部署完成後，Vercel 會提供一個網址，例如：
```
https://solar-calculator.vercel.app
```

## 方法二：使用 Vercel 網頁介面（最簡單）

### 步驟 1：準備檔案

確保所有檔案都在 `/Users/linzongyi/Desktop/yu` 目錄中

### 步驟 2：上傳到 GitHub（可選但推薦）

```bash
cd /Users/linzongyi/Desktop/yu

# 初始化 Git（如果還沒有）
git init

# 建立 .gitignore（避免上傳不必要的檔案）
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore

# 加入所有檔案
git add .

# 提交
git commit -m "Initial commit"

# 在 GitHub 建立新儲存庫，然後執行：
# git remote add origin https://github.com/yourusername/solar-calculator.git
# git push -u origin main
```

### 步驟 3：在 Vercel 部署

1. 前往 https://vercel.com/
2. 使用 GitHub 帳號登入
3. 點擊「Add New Project」
4. 選擇您的 GitHub 儲存庫（或選擇「Import Git Repository」）
5. 設定：
   - Framework Preset: Other
   - Root Directory: `./`（預設）
   - Build Command: 留空（純靜態網站不需要）
   - Output Directory: 留空
6. 點擊「Deploy」

### 步驟 4：完成

幾秒鐘後，您的網站就會上線！

## 方法三：直接拖放部署（最快速）

1. 前往 https://vercel.com/
2. 登入帳號
3. 點擊「Add New Project」
4. 選擇「Upload」或「Browse」
5. 選擇整個 `yu` 資料夾
6. 點擊「Deploy」

## ⚙️ 部署後設定

### 自訂網域（可選）

1. 在 Vercel 專案設定中
2. 前往「Settings」→「Domains」
3. 輸入您的網域
4. 按照指示設定 DNS

### 環境變數（如果需要）

目前不需要，因為 API Key 已經在 `supabase-config.js` 中。

如果未來需要保護 API Key，可以在 Vercel 設定環境變數。

## 🔄 更新部署

### 如果使用 Git：

```bash
git add .
git commit -m "Update"
git push
```

Vercel 會自動重新部署！

### 如果直接上傳：

重新上傳檔案即可。

## 📝 檢查清單

部署前確認：
- [ ] Supabase 資料庫已設定完成
- [ ] `supabase-config.js` 中的 URL 和 Key 正確
- [ ] 本地測試通過
- [ ] 所有檔案都在專案目錄中

部署後測試：
- [ ] 網站可以正常開啟
- [ ] 太陽能板選單可以載入
- [ ] 逆變器選單可以載入
- [ ] 計算功能正常
- [ ] 專案保存功能正常

## 🆘 常見問題

### 問題：部署後無法連線資料庫

**解決方法**：
- 檢查 `supabase-config.js` 中的 URL 和 Key
- 確認 Supabase 專案狀態正常
- 檢查瀏覽器控制台的錯誤訊息

### 問題：某些功能無法使用

**解決方法**：
- 清除瀏覽器快取
- 檢查 Vercel 部署日誌
- 確認所有檔案都已上傳

## 🎉 完成！

部署完成後，您的網站就可以在網路上使用了！

---

**其他部署選項**：如果不想用 Vercel，也可以考慮：
- **Netlify**：類似 Vercel，也很簡單
- **GitHub Pages**：免費但功能較少
- **Cloudflare Pages**：速度快，免費

