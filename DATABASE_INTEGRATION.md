# 資料庫整合說明

## 📊 支援的資料表

程式碼現在可以從 Supabase 資料庫讀取以下資料表：

### 1. 設備資料表

#### 太陽能板
- **表名**：`solar_panels` 或 `solar_modules`
- **自動切換**：如果 `solar_panels` 不存在，會自動嘗試 `solar_modules`
- **使用方法**：
  ```javascript
  const panels = await supabase.getSolarPanels();
  ```

#### 逆變器
- **表名**：`inverters` 或 `delta_inverters`
- **自動切換**：如果 `inverters` 不存在，會自動嘗試 `delta_inverters`
- **使用方法**：
  ```javascript
  const inverters = await supabase.getInverters();
  ```

### 2. 載流量表（Ampacity Tables）

#### 金屬線材載流量表
- `ampacity_metal_60c` - 金屬線材，60°C
- `ampacity_metal_75c` - 金屬線材，75°C
- `ampacity_metal_90c` - 金屬線材，90°C

#### PVC 線材載流量表
- `ampacity_pvc_60c` - PVC 線材，60°C

#### 使用方法
```javascript
// 載入特定載流量表
const ampacity60 = await supabase.getAmpacityMetal60C();
const ampacity75 = await supabase.getAmpacityMetal75C();
const ampacity90 = await supabase.getAmpacityMetal90C();
const ampacityPVC = await supabase.getAmpacityPVC60C();

// 根據線徑和條件查詢
const data = await supabase.getAmpacity(25, 'metal', 60); // 25mm², 金屬, 60°C
```

### 3. 電纜阻抗表

- **表名**：`cable_impedance_25c`
- **使用方法**：
  ```javascript
  const impedance = await supabase.getCableImpedance();
  const impedanceBySize = await supabase.getCableImpedanceBySize(25); // 25mm²
  ```

### 4. 導管尺寸表

- `conduit_sizing_non_metallic` - 非金屬導管
- `conduit_sizing_thick_metal` - 厚金屬導管
- `conduit_sizing_thin_metal` - 薄金屬導管
- `conduit_sizing_flex_non_metallic` - 可彎曲非金屬導管

#### 使用方法
```javascript
const nonMetallic = await supabase.getConduitSizingNonMetallic();
const thickMetal = await supabase.getConduitSizingThickMetal();
const thinMetal = await supabase.getConduitSizingThinMetal();
const flexNonMetallic = await supabase.getConduitSizingFlexNonMetallic();
```

### 5. 接地相關表

- `grounding_types` - 接地類型
- `grounding_wire_sizing` - 接地線尺寸

#### 使用方法
```javascript
const groundingTypes = await supabase.getGroundingTypes();
const wireSizing = await supabase.getGroundingWireSizing();
```

## 🔧 通用查詢方法

### 讀取任何表
```javascript
// 基本查詢
const data = await supabase.getTable('table_name');

// 帶篩選條件
const data = await supabase.getTable('table_name', { column: 'value' });

// 帶排序和限制
const data = await supabase.getTable('table_name', {}, 'column_name', 10);
```

### 進階查詢
```javascript
const data = await supabase.queryTable('table_name', {
    select: 'column1,column2',
    filters: { column1: 'value1', column2: 'value2' },
    orderBy: 'column1',
    orderDirection: 'asc',
    limit: 100,
    offset: 0
});
```

## 📋 資料表欄位對應

### 載流量表欄位結構

根據 `ampacity_metal_60c` 等表的結構：

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| `id` | int4 | 主鍵 |
| `wire_type` | text | 線材類型（單線/絞線） |
| `nominal_area_mm2` | text | 標稱截面積 (mm²) |
| `structure_diameter` | text | 結構直徑 |
| `amp_3_be...i...` | int4 | 3 條線的載流量 |
| `amp_4` | int4 | 4 條線的載流量 |
| `amp_5_6` | int4 | 5-6 條線的載流量 |
| `amp_7_9` | int4 | 7-9 條線的載流量 |

### 使用載流量表進行線徑計算

程式碼會自動：
1. 根據線材類型（metal/pvc）和溫度選擇正確的表
2. 根據線材結構（3/4/5-6/7-9 條線）選擇對應的載流量欄位
3. 應用溫度修正係數
4. 選擇符合載流量要求的最小線徑

## 🚀 自動功能

### 自動表名切換

當讀取設備資料時，如果預設表名不存在，會自動嘗試其他可能的表名：

- `solar_panels` → `solar_modules`
- `inverters` → `delta_inverters`

### 自動載入載流量表

在頁面初始化時，會自動載入預設的載流量表（金屬線材，60°C，3 條線）。

## 📝 範例：在計算中使用資料庫資料

```javascript
// 1. 載入載流量表
await loadAmpacityTable('metal', 60, '3');

// 2. 計算所需線徑
const requiredCurrent = 50; // A
const wireTemp = 40; // °C
const cableSize = await selectCableSize(requiredCurrent, wireTemp, 'metal', '3');

// 3. 查詢電纜阻抗
const impedance = await supabase.getCableImpedanceBySize(cableSize);

// 4. 計算電壓降
const voltageDrop = calculateVoltageDrop(length, current, voltage, cableSize, impedance);
```

## ⚙️ 設定 RLS 政策

確保所有資料表都有正確的 RLS 政策：

```sql
-- 範例：為載流量表設定 RLS
ALTER TABLE ampacity_metal_60c ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for anon users" ON ampacity_metal_60c
    FOR ALL USING (true) WITH CHECK (true);
```

## 🔍 測試資料庫連線

使用 `test-supabase-connection.html` 來測試：
1. 基本連線
2. 資料表是否存在
3. 資料是否可以讀取

## 📌 注意事項

1. **表名對應**：如果您的表名不同，可以：
   - 修改 `supabase-config.js` 中的表名
   - 或使用 `getTable()` 通用方法直接指定表名

2. **欄位名稱**：如果欄位名稱不同，需要：
   - 修改對應的讀取函數
   - 或使用 `queryTable()` 方法並指定 `select` 參數

3. **效能考量**：載流量表會在頁面載入時預載入，避免每次計算都查詢資料庫。

4. **錯誤處理**：如果資料庫查詢失敗，會自動回退到硬編碼的預設值。

