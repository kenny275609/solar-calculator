# 資料表欄位對應說明

本文檔記錄了資料庫表結構與程式碼中使用的欄位名稱對應關係。

## 📊 solar_modules 表

### 欄位對應

| 程式碼使用 | 資料庫欄位 | 資料類型 | 說明 |
|-----------|-----------|---------|------|
| 顯示名稱 | `manufacturer` + `series` + `model_number` | text | 製造商 + 系列 + 型號 |
| `Pmod` | `p_max` | numeric | 最大功率 (W) |
| `Vmpp` | `v_mp` | numeric | 最大功率點電壓 (V) |
| `Impp` | `i_mp` | numeric | 最大功率點電流 (A) |
| `Voc` | `v_oc` | numeric | 開路電壓 (V) |
| `Isc` | `i_sc` | numeric | 短路電流 (A) |
| `alphaVoc` | `temp_coef_voc` | numeric | 電壓溫度係數 (%/°C) |
| `alphaIsc` | `temp_coef_isc` | numeric | 電流溫度係數 (%/°C) |

### 完整欄位列表

- `id` (uuid) - 主鍵
- `manufacturer` (text) - 製造商
- `series` (text) - 系列
- `model_number` (text) - 型號
- `p_max` (numeric) - 最大功率
- `v_oc` (numeric) - 開路電壓
- `i_sc` (numeric) - 短路電流
- `v_mp` (numeric) - 最大功率點電壓
- `i_mp` (numeric) - 最大功率點電流
- `efficiency` (numeric) - 效率
- `temp_coef_voc` (numeric) - 電壓溫度係數
- `temp_coef_isc` (numeric) - 電流溫度係數
- `temp_coef_pmax` (numeric) - 功率溫度係數
- `is_bifacial` (boolean) - 是否雙面
- `created_at` (timestamp) - 建立時間

## ⚡ delta_inverters 表

### 欄位對應

| 程式碼使用 | 資料庫欄位 | 資料類型 | 說明 |
|-----------|-----------|---------|------|
| 顯示名稱 | `model_name` | text | 型號名稱 |
| `VinvMax` | `max_input_voltage_v` | numeric | 最大輸入電壓 (V) |
| `VinvMpptMin` | `mppt_voltage_range_v` | text | MPPT 電壓範圍最小值（需解析） |
| `VinvMpptMax` | `mppt_voltage_range_v` | text | MPPT 電壓範圍最大值（需解析） |
| `IinvMax` | `max_input_current_total_a` | text | 最大輸入電流 (A) |
| `PinvRated` | `rated_output_power_kw` | numeric | 額定輸出功率 (kW) |
| `IinvRated` | `max_output_current_a` | text | 最大輸出電流 (A) |

### 重要欄位說明

- `mppt_voltage_range_v` 是文字格式，可能為 "200-800" 或 "200V~800V"，程式碼會自動解析
- `max_input_current_total_a` 和 `max_output_current_a` 可能是文字格式，程式碼會自動提取數字

### 完整欄位列表（主要欄位）

- `id` (uuid) - 主鍵
- `model_name` (text) - 型號名稱
- `max_input_voltage_v` (numeric) - 最大輸入電壓
- `mppt_voltage_range_v` (text) - MPPT 電壓範圍
- `max_input_current_total_a` (text) - 最大輸入電流
- `rated_output_power_kw` (numeric) - 額定輸出功率
- `max_output_current_a` (text) - 最大輸出電流
- ... (還有許多其他規格欄位)

## 📏 載流量表 (ampacity_*)

### 表名

- `ampacity_metal_60c` - 金屬線材，60°C
- `ampacity_metal_75c` - 金屬線材，75°C
- `ampacity_metal_90c` - 金屬線材，90°C
- `ampacity_pvc_60c` - PVC 線材，60°C

### 欄位對應

| 程式碼使用 | 資料庫欄位 | 資料類型 | 說明 |
|-----------|-----------|---------|------|
| 線徑 | `nominal_area_mm2` | text | 標稱截面積 (mm²) |
| 3 條線載流量 | `amp_3_be...` | int4 | 3 條線捆紮時的載流量 |
| 4 條線載流量 | `amp_4` | int4 | 4 條線捆紮時的載流量 |
| 5-6 條線載流量 | `amp_5_6` | int4 | 5-6 條線捆紮時的載流量 |
| 7-9 條線載流量 | `amp_7_9` | int4 | 7-9 條線捆紮時的載流量 |

### 完整欄位列表

- `id` (int4) - 主鍵
- `wire_type` (text) - 線材類型（單線/絞線）
- `nominal_area_mm2` (text) - 標稱截面積
- `structure_diameter` (text) - 結構直徑
- `amp_3_be...` (int4) - 3 條線載流量
- `amp_4` (int4) - 4 條線載流量
- `amp_5_6` (int4) - 5-6 條線載流量
- `amp_7_9` (int4) - 7-9 條線載流量

## 🔌 電纜阻抗表 (cable_impedance_25c)

### 欄位列表

- `id` (int4) - 主鍵
- `insulation_type` (text) - 絕緣類型（PVC/XLPE）
- `wire_size_label` (text) - 線徑標籤
- `total_area_mm2` (numeric) - 總截面積
- `r_o...` (numeric) - 電阻值 (Ω/km)
- `x_o...` (numeric) - 電抗值 (Ω/km)
- `x_emt_gip_ohm` (numeric) - 其他電抗值

## 📐 導管尺寸表 (conduit_sizing_*)

### 表名

- `conduit_sizing_non_metallic` - 非金屬導管
- `conduit_sizing_thick_metal` - 厚金屬導管
- `conduit_sizing_thin_metal` - 薄金屬導管
- `conduit_sizing_flex_non_metallic` - 可彎曲非金屬導管

### 欄位列表

- `id` (int4) - 主鍵
- `wire_type` (text) - 線材類型
- `wire_size_mm` (text) - 線徑 (mm)
- `wires_1` (int4) - 1 條線時的導管尺寸
- `wires_2` (int4) - 2 條線時的導管尺寸
- `wires_3` (int4) - 3 條線時的導管尺寸
- ... (依此類推到 `wires_9`)

## 🔗 接地相關表

### grounding_types

- `id` (integer) - 主鍵
- `type_name` (text) - 接地類型名稱
- `application` (text) - 應用場景
- `resistance_ohms` (text) - 電阻值

### grounding_wire_sizing

- `id` (integer) - 主鍵
- `protection_rating_amp` (text) - 保護額定電流
- `copper_single_mm` (text) - 銅單線尺寸
- `copper_stranded_mm2` (text) - 銅絞線尺寸

## 📸 inverter_images

- `id` (uuid) - 主鍵
- `inverter_model` (text) - 逆變器型號
- `image_filename_placeholder` (text) - 圖片檔名
- `description` (text) - 描述
- `storage_url` (text) - 儲存 URL

## 🔄 程式碼對應邏輯

### 太陽能板載入

```javascript
// 顯示名稱：manufacturer + series + model_number
const displayName = `${manufacturer} ${series} ${model_number}`;

// 規格對應
Pmod = p_max
Vmpp = v_mp
Impp = i_mp
Voc = v_oc
Isc = i_sc
alphaVoc = temp_coef_voc
alphaIsc = temp_coef_isc
```

### 逆變器載入

```javascript
// 顯示名稱：model_name
const displayName = model_name;

// 規格對應
VinvMax = max_input_voltage_v
VinvMpptMin/Max = 解析 mppt_voltage_range_v (如 "200-800")
IinvMax = max_input_current_total_a (提取數字)
PinvRated = rated_output_power_kw
IinvRated = max_output_current_a (提取數字)
```

### 載流量表載入

```javascript
// 根據線材結構選擇欄位
if (wireStructure === '3') → amp_3_be...
if (wireStructure === '4') → amp_4
if (wireStructure === '5' || '6') → amp_5_6
if (wireStructure === '7' || '8' || '9') → amp_7_9
```

## ⚠️ 注意事項

1. **文字格式欄位**：某些欄位（如 `mppt_voltage_range_v`）是文字格式，需要解析
2. **數值提取**：某些欄位可能包含單位（如 "22A"），程式碼會自動提取數字
3. **溫度係數**：`temp_coef_voc` 和 `temp_coef_isc` 在資料庫中是數值，程式碼直接使用（不需要轉換為百分比）
4. **NULL 值處理**：程式碼會檢查 NULL 值並使用預設值或空字串

