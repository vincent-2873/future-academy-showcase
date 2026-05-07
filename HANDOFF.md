# 未來學院 Student Showcase — 交接文件

> 給接手這個專案的下一個對話 / 開發者用。  
> 本文件存於 repo 根目錄並同步到 GitHub。

---

## 0. 一分鐘摘要

- **產品**：未來學院（Future Academy）銷售團隊用的「學員作品展示」單頁網站 + 20 個可登入的 fake demo 子站
- **目的**：在客戶 / 潛在學員面前展示「我們學員做的東西真的會動、有真實使用者、能玩」
- **技術原則**：純靜態 HTML/CSS/JS，**不用任何資料庫、不用 Supabase**，所有資料在 `data/*.js`
- **線上網址**：https://future-academy-showcase.zeabur.app
- **GitHub repo**：https://github.com/vincent-2873/future-academy-showcase
- **本機路徑**：`/Users/pagecinhong/Claude mac/`
- **本機開發伺服器**：`python3 -m http.server 8765`（背景跑著，port 8765）

---

## 1. 部署架構

```
本機 /Users/pagecinhong/Claude mac
        │
        │  git push（已綁 SSH key）
        ▼
GitHub  vincent-2873/future-academy-showcase  (public)
        │
        │  Zeabur 自動偵測 push、自動建置（static）
        ▼
Zeabur  專案 untitled-1 / 服務 future-academy-showcase
        │
        │  綁 .zeabur.app 子網域 + 自動 SSL
        ▼
公開    https://future-academy-showcase.zeabur.app
```

**改完直接 `git push` 就會自動重新部署**（30–60 秒上線），不用登入 Zeabur。

### 認證設定
- SSH key：`~/.ssh/id_ed25519`，公鑰已加到 GitHub `vincent-2873` 帳號（標題：Future Academy Deploy）
- `git remote -v` 顯示 `git@github.com:vincent-2873/future-academy-showcase.git`
- 不再需要 PAT（之前用過一次，已刪除）

---

## 2. 完整檔案結構

```
/Users/pagecinhong/Claude mac/
├── HANDOFF.md              ← 本檔
├── .gitignore              ← 排除 .DS_Store / .env 等
├── zeabur.json             ← Zeabur 部署設定（type: static）
│
├── index.html              ← 主展示頁
├── style.css               ← 主頁樣式（v=12）
├── script.js               ← 主頁互動（v=11）
│
├── data/
│   ├── works.js            ← ⭐ 20 個學員作品資料（要新增 / 修改在這裡）
│   └── extras.js           ← 見證、合作、媒體、成就（雙語）
│
└── demo/                   ← 20 個學員 demo 通用模板
    ├── index.html          ← 登入頁 + 主介面 shell
    ├── demo.css            ← demo 樣式（v=6）
    └── demo.js             ← demo 互動（v=7）
```

**沒有 build step**，沒有 npm/node，純檔案系統。

---

## 3. 主頁（`/`）長什麼樣

依序排列：
1. **頂部 nav**：未來學院 logo + 中／EN 切換 + LIVE 徽章
2. **LIVE Ticker**：跑馬燈，自動產的「Forge Studio 部署 v2.1」「Pulse 連續 7 天上榜」等
3. **Hero**：「不只是作業，是上線中的產品。」黑底 + 螢光綠 accent + 漂浮 mini cards
4. **巨型 Marquee 帶**：「EVERY PROJECT IS LIVE」斜體流動文字
5. **數字會說話**：6 格 KPI（240+ 學員 / 86 個產品 / 32.0 萬+ 使用者 / NT$4.8M+ 營收 / 94% 就業 / 4 期）
6. **20 個作品 · 都能登入**：搜尋 + 16 個分類 pills + 排序 + 3 欄毛玻璃卡片
7. **巨型 Marquee 帶 #2**
8. **HALL OF FAME**：7 張 featured 作品橫向 scroll-snap
9. **VOICES**：6 條 testimonials masonry
10. **巨型 Marquee 帶 #3**
11. **About**：3 根支柱（真題目 / 真上線 / 真迭代）
12. **Partners + Press**：12 個合作夥伴 + 5 條媒體報導
13. **Final CTA**：「現在看到的，18 週後可能就是你的。」

### 主頁互動
- ⌘K / Ctrl+K 聚焦搜尋
- 點任一卡片 → Modal 開啟（含操作流程動畫、亮點、4 格使用數據、技術棧、AI 模型、獎項、學員、登入帳密、開啟 Demo 按鈕）
- 中／EN 切換（i18n 字典在 script.js）
- ESC 關 modal、scroll reveal、3D 卡片傾斜、卡片邊光跟鼠標
- 自訂螢光綠 blob 游標（hover 互動元素時放大）
- 全頁 grain 雜訊膠片（z-index: -1，不影響文字）

---

## 4. 20 個學員作品（`data/works.js`）

| ID | 名稱 | 類別 | Featured |
|---|---|---|---|
| 01 | NeuroShop 神經電商 | 電商 | ★ |
| 02 | DineFlow Pro 餐廳神經中樞 | 餐飲 | ★ |
| 03 | ReelForge 影音鑄造廠 | 影音 | ★ |
| 04 | Nomad 城市網路 | 社群 | |
| 05 | Oasis 客服元宇宙 | AI 應用 | |
| 06 | Forge Studio 內容鍛造廠 | 自動化 | |
| 07 | Ensemble 智慧合奏團 | AI 應用 | ★ |
| 08 | CanvasForge 視覺工坊 | 工具 | ★ |
| 09 | Pulse 智慧問卷 | 工具 | |
| 10 | Pocket CFO 個人財務長 | 個人財務 | ★ |
| 11 | Vital AI 生命體徵管家 | 健康 | |
| 12 | Codex 知識萃取室 | 學習 | |
| 13 | Wanderlust 旅遊智囊 | 旅遊 | ★ |
| 14 | Resume Lab 履歷實驗室 | 職涯 | |
| 15 | Mood Atlas 靈感地圖 | 設計 | |
| 16 | Voicebox 聲音實驗室 | 內容創作 | |
| 17 | Athenaeum 二手書殿堂 | 社群 | |
| 18 | PetMind 寵物大腦 | 生活 | |
| 19 | LingoLink 雙語助讀 | 學習 | |
| 20 | Synapse 知識神經網 | 工具 | |

每筆作品的欄位：

```js
{
  id, title, subtitle, category, icon, gradient: [g1, g2],
  summary, description,
  highlights: [...],         // 3 條亮點 KPI（modal 顯示）
  features: [...],           // 15-20 條功能（modal 顯示）
  tech: [...],               // 一般技術棧（灰色標籤）
  modelsUsed: [...],         // AI 模型（紫色標籤）
  metrics: { users, mau, ... },  // 使用數據（卡片右上 + modal 4 格）
  awards: [...],             // 業界肯定（金色徽章）
  student: { name, cohort, role },
  demo: { url: '/demo/?id=NN', account, password },
  status: 'LIVE',
  featured: true/false,
}
```

**新增作品 = 在 `data/works.js` 的 `WORKS` 陣列加一筆**，主頁與 demo 兩邊都會自動長出來。

---

## 5. 20 個 Demo 子站（`/demo/?id=NN`）

每個 demo 都是 **登入頁 → 客製儀表板** 的兩段式體驗，全部用 `demo/index.html` 通用模板渲染，根據 `?id=NN` 載入對應作品。

### 每個 demo 都有的 SaaS 樣貌
- 上方 **navbar**：logo / 全域搜尋 ⌘K / 說明 / 通知鈴 (badge 3) / 使用者 / 登出
- 左側 **sidebar**：3 區段 × 8–9 個項目，每分類專屬選單（電商：訂單/商品/客戶...；AI：對話/Agents/知識庫...）
- 上方 **Tab bar**：總覽 / 明細 / 趨勢分析 / 設定（4 個 tab 真的會切換內容）
- 上方 **Toolbar**：篩選 / 排序 / 匯出 / 重新整理（旋轉動畫）
- 右下 **FAB**：點 → 彈出快速建立選單
- 左下 **LIVE EVENTS**：浮動串流，每 2-4 秒新事件 pop-in
- 主 panel **雷達脈動 + 呼吸發光邊框**
- KPI 數字 **進場滾動 + 自動 tick up**

### 各分類專屬 dashboard layout（20 個都不一樣）

| ID | 分類 | UI 範式 |
|---|---|---|
| 01 | 電商 | 銷售儀表板 + AI 文案生成 + 推薦引擎 + 庫存預警 |
| 02 | 餐飲 | 即時桌況格（T01-T08 紅綠黃）+ 訂單列 + 訂位 + 廚房監控 |
| 03 | 影音 | 影片渲染隊列（進度條）+ AI 數位人 + 配音音色 |
| 04 | 社群 | 附近活動列 + 朋友圈動態 + 信任分數 |
| 05 | AI 應用 | 對話 + 情緒監控 + Agent 狀態 + 成本追蹤 + **終端機 log** + AI 對話輸入框 |
| 06 | 自動化 | **Kanban 看板**（草稿/審核/發佈，可拖拉）+ token 消耗折線 |
| 07 | AI 應用（Multi-Agent）| **SVG Agent 網路圖**（中央決策者 + 4 個衛星 Agent 動畫線）|
| 08 | 工具 | default layout + 技術棧 + AI 模型清單 |
| 09 | 工具 | **三欄問卷編輯器**（題目列表 / 預覽 / 即時統計）|
| 10 | 個人財務 | 月度概況 + 交易列 + AI 找回支出 + 財務目標 |
| 11 | 健康 | 健康總覽 + 飲食辨識 + AI 教練對話 + 體重進度 |
| 12 | 學習 | **書牆**（12 本書 3D flip）+ 金句卡 + 閱讀統計 |
| 13 | 旅遊 | **網格地圖** + 7 個景點 pin + 逐日時間軸 |
| 14 | 職涯 | **履歷編輯器** + 即時 A4 預覽 + AI 優化建議 |
| 15 | 設計 | **Pinterest masonry** + AI 配色 DNA |
| 16 | 內容創作 | **音訊波形**編輯 + 章節時間軸 |
| 17 | 社群 | **二手書市集**卡片網格 |
| 18 | 生活 | **寵物個人檔**大頭照 + AI 行為偵測 |
| 19 | 學習 | **三欄雙語閱讀器**（英 / 中 / 單字本） |
| 20 | 工具 | **SVG 知識圖譜**（中央 AI 應用 + 8 個學科衛星節點） |

### 共通互動（所有 demo）
- 點任一 row / tile / card / book → **滑入式 drawer**（440px 從右邊滑入）顯示詳細
- nav 搜尋框輸入 → **即時過濾** 列表
- Tab 切到「明細」→ 12 列資料表格；切到「趨勢」→ 30 天折線 + 24h 熱區 + YoY/MoM；切到「設定」→ 8 區設定 + toggle 開關
- 點 FAB + → 快速建立 action menu（分類專屬）
- 點重新整理 → 圖示旋轉 + KPI 閃光
- AI 應用 / 自動化 / 工具 自動加 **CPU/GPU/記憶體 環形 gauge** + **黑底終端機 log streaming**
- Oasis (id=05) AI 對話真的會回應（typing-dots 動畫 + 1.4s 後 AI 回覆）
- Forge Studio (id=06) Kanban 卡片可拖拉換欄、drop 後 toast

---

## 6. 設計系統

### 配色（CSS 變數）
```css
--bg-base: #07080A         /* 近黑底 */
--bg-elev-1: #0E1014       /* 卡片底 */
--bg-elev-2: #15171D       /* 內層元素 */
--accent: #6BFF8E          /* 螢光薄荷綠 */
--accent-text: #0A0A0B     /* accent 上的文字 */
--text-primary: #F5F6F8
--text-secondary: #B8BCC4
--text-tertiary: #6E727B
```

### 字型
- 中文：Noto Sans TC（300/400/500/700/900）
- 英文 / 數字：Inter（400-900）
- Mono / display：Space Grotesk（500/600/700）

### 風格 keyword
- Glassmorphism（毛玻璃 backdrop-filter）
- Dark theme，螢光綠當唯一強調色
- 每個作品有自己的漸層雙色（gradient: [g1, g2]）
- 雷達脈動、呼吸邊框、流動 marquee、3D 傾斜這些細節讓畫面「一直在動」

### 已知踩過的雷
- ⚠️ `transform` 殘留會讓巨型中文字模糊（GPU compositing layer 渲染）→ 動畫結束後務必設 `transform: none`
- ⚠️ 隱藏 modal 的 CSS `display: flex` 會蓋掉 HTML `hidden` attribute → 加 `[hidden] { display: none !important }`
- ⚠️ `body { overflow-x: hidden }` 會把 body 變成 scroll container，導致 `window.scrollTo` 失效 → 改放在 `html`
- ⚠️ Lenis 平滑滾動在 macOS 觸控板會黏滯 → 已停用
- ⚠️ JS 同檔案內兩個 `function setupTabs(){}` → 後者覆蓋前者，要記得清理重複定義

---

## 7. RWD 斷點

| 元件 | 桌機 | 平板 | 手機 |
|---|---|---|---|
| 成就格 | 6 (≥1180) | 3 (720-1180) | 2 (≤720) |
| 作品 grid | 3 | 2 (≤1024) | 1 (≤640) |
| Hero 浮動卡 | 顯示 | 隱藏 (≤1180) | 隱藏 |
| Hero 主標 | clamp 132px | 自動縮 | 40px line-height 1.1 |
| About | 1.2fr 1fr | 1 欄 (≤900) | 1 欄 |
| 見證 masonry | 3 | 2 (≤980) | 1 (≤640) |
| 合作網格 | 4 | 2 (≤720) | 2 |
| Demo sidebar | 240px | 64px icons (≤1024) | 隱藏 (≤720) |
| Demo Reader (id=19) | 3 欄 | 1 欄 (≤1100) | 1 欄 |
| Demo Resume (id=14) | 2 欄 | 1 欄 (≤1100) | 1 欄 |

---

## 8. 完整 commit 歷史（最新到最舊）

```
73efde5 fix: KPI numbers no longer wrap + tighter RWD breakpoints
8bffda7 feat: full interactivity layer on every demo (drawer/tabs/search/FAB/AI chat/gauges/kanban)
78f5476 feat: full SaaS chrome on every demo (sidebar + tabs + toolbar + bell + FAB)
8b4e4b3 feat: LiveFX engine for demos (events stream / terminal log / radar / breathing)
3add969 fix: hero floating mini cards no longer cut off at viewport edge
804e186 feat: per-category operation flow animation in main modal
5713565 feat: 12 more visually distinct demo layouts so no two demos look alike
672ba1c feat: add 20 student-work demo sites under /demo/?id=NN
b66dac3 fix: hidden modal was covering whole page with backdrop-filter blur
4885ef3 fix: kill all blur sources on hero text
5226102 feat: ZH/EN toggle + Lenis smooth scroll + sharper visuals
7c3c8c5 feat: PREMIUM upgrade (custom cursor / marquees / hall of fame / voices / partners / final CTA)
3eaf3c4 feat: upgrade 20 projects (cutting-edge features / metrics / highlights / awards / AI models)
9229f0b init: Future Academy student showcase v1
```

---

## 9. 目前狀態 / 已知未完成

### ✅ 已完成
- 主頁完整功能 + 雙語切換
- 20 個作品全部有專屬 demo（沒有兩個長一樣）
- 全部互動：drawer / search / tabs / FAB / AI chat / gauges / Kanban drag
- LiveFX：浮動事件、終端機、雷達、呼吸、KPI tick
- Modal 操作流程動畫（每個分類 4 個節點循環高亮）
- 部署到 Zeabur，自動 redeploy 鏈路完整
- RWD 三斷點（手機 / 平板 / 桌機）
- Bilingual 資料（`extras.js` 的 testimonials / partners / press 都有 `_en` 欄位可切換）

### 🟡 可選的下一步（非阻塞）
1. **真實截圖**：目前 demo 預覽都是 CSS 漸層 + emoji，學員作品真的上線後可在 `data/works.js` 加 `cover: '/assets/works/01.png'` 欄位讓主頁卡片用真截圖
2. **GA4 / Hotjar**：`index.html` `<head>` 已埋 GA4 placeholder，把 `G-XXXXXXXXXX` 換成 Measurement ID 取消註解即可
3. **真實學員照片**：`data/works.js` 每筆 `student` 加 `avatar: '/assets/students/01.jpg'`
4. **修真實 Demo URL**：目前 `data/works.js` 的 `demo.url` 都指 `/demo/?id=NN` 我們的 fake demo，學員真產品上線後可換成 `https://student-real-product.com`
5. **聯絡表單**：footer 的聯絡欄位現在是純連結，要做表單可接 Formspree（一行 form action）

### ⚠️ 不要做的事
- **不要重新啟用 Lenis** smooth scroll —— 在 macOS 觸控板上會黏滯
- **不要把 `body` 設 `overflow-x: hidden`** —— 會破壞 scrollTo
- **不要在 Hero 重新加 word-by-word reveal animation** —— 會讓中文字 GPU raster 模糊
- **不要把 modal 的 `[hidden] { display: none !important }` 拿掉** —— 一拿掉整頁會被 modal 罩住

---

## 10. 對下一個對話的建議

### 如果使用者要 / 我要新增作品
1. 編輯 `data/works.js` 的 `WORKS` 陣列加一筆（schema 看上面）
2. 如果是新分類（`category` 不在現有 15 個內），到 `demo/demo.js` 的 `LAYOUTS` 加一個專屬 dashboard，否則會用 default
3. 如果是新分類，到 `demo/demo.js` 的 `RAIL_BY_CAT` 加 sidebar 選單
4. 也要更新 `script.js` 的 `operationFlow` 函式（modal 動畫節點）
5. `git add . && git commit && git push` → Zeabur 自動部署

### 如果使用者要改文案
- 主頁文案：`script.js` 的 i18n 字典（`I18N` 物件）+ `index.html` 直接寫死的部分
- 作品文案：`data/works.js` 該筆的 `description` / `summary` / `highlights`
- 見證 / 合作 / 媒體：`data/extras.js`（已雙語）

### 如果使用者要改顏色
- 全站主色：`style.css` 開頭 `:root` 的 `--accent`
- 個別作品漸層：`data/works.js` 該筆的 `gradient: [g1, g2]`

### 如果使用者要改 demo 的 dashboard 內容
- `demo/demo.js` 的 `LAYOUTS['電商']`、`LAYOUTS['__06']`（per-id override）等
- 共用元件：`chartLine()`、`gauge`、`heartbeat`、`waveform`、`terminal`...

### 部署有問題時
1. 本機驗證：開瀏覽器 `http://localhost:8765`（Python 伺服器跑著）
2. Zeabur 部署狀態：dashboard 看 `untitled-1` 專案的 `future-academy-showcase` 服務
3. 強制重部署：在 Zeabur 服務頁點「重新部署」
4. SSL / DNS 沒生效：通常 5–10 分鐘內會好

---

## 11. 工具備忘

| 工具 | 是否可用 |
|---|---|
| `git` | ✅（含 SSH 認證已設定） |
| `python3` | ✅（用 http.server 跑本機） |
| `node` / `npm` | ❌ 沒裝 |
| `gh` (GitHub CLI) | ❌ 沒裝 |
| `brew` | ❌ 沒裝 |
| Chrome MCP | ✅（user 有授權） |
| Zeabur dashboard | ✅（user 已登入） |
| GitHub web | ✅（user 已登入 vincent-2873） |

---

## 12. 緊急聯絡

- **本機檔案位置**：`/Users/pagecinhong/Claude mac/`
- **背景跑的 Python server**：bash background id `buq4fdifj`（如果還活著）
- **Zeabur 專案 ID**：`project-69fb6faf450d7ad456f07435`
- **Zeabur 服務 ID**：`service-69fb6ffa0d582306fc768fad`

---

_文件最後更新：2026-05-07，commit 73efde5 之後_
