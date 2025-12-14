# GitHub 上傳指令

## 步驟 1：在 GitHub 建立儲存庫

1. 前往 https://github.com/new
2. 填寫：
   - Repository name: `solar-calculator`
   - 選擇 Public 或 Private
   - **不要**勾選「Initialize this repository with a README」
3. 點擊「Create repository」

## 步驟 2：執行以下指令

將 `yourusername` 替換為您的 GitHub 用戶名：

```bash
cd /Users/linzongyi/Desktop/yu

# 連接遠端儲存庫（替換 yourusername）
git remote add origin https://github.com/yourusername/solar-calculator.git

# 重新命名分支為 main（如果需要的話）
git branch -M main

# 上傳到 GitHub
git push -u origin main
```

## 完成後

您的專案就會在 GitHub 上了！網址會是：
`https://github.com/yourusername/solar-calculator`

## 後續更新

之後如果要更新檔案：

```bash
cd /Users/linzongyi/Desktop/yu
git add .
git commit -m "更新說明"
git push
```

