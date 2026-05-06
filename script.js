// ============================================================
//  未來學院 STUDENT SHOWCASE — 互動邏輯
// ============================================================
//
//  功能清單：
//   1. 渲染分類 pills
//   2. 渲染作品卡片
//   3. 分類篩選
//   4. 即時搜尋（標題、副標、簡介、技術、學員）
//   5. 排序切換
//   6. 卡片整張可點 → 開新分頁到 demo
//   7. 帳密複製（不觸發整張卡片跳轉）
//   8. 點卡片右下「詳細」按鈕 → 彈出 modal
//   9. ESC / 背景點擊關閉 modal
//  10. 鍵盤 ⌘K / Ctrl+K 聚焦搜尋
//  11. Toast 提示複製成功
// ============================================================

(function () {
  const works = window.WORKS || [];

  // ============================================================
  // i18n 字典（UI 靜態文字）
  // ============================================================
  const I18N = {
    zh: {
      // nav
      navWorks: '作品', navCategories: '分類', navHall: '名人堂', navVoices: '見證', navAbout: '關於',
      navSearch: '搜尋', navStatus: '學員作品 · LIVE',
      // hero
      heroEyebrow: 'STUDENT SHOWCASE / 2025',
      heroTitleA: '不只是', heroTitleStrike: '作業', heroTitleB: '，',
      heroTitleC: '是', heroAccent: '上線中', heroTitleD: '的產品。',
      heroLead: '每一個作品，都是學員在 18 週內從 0 推到上線。不是 PPT、不是 demo、不是「假裝有功能」——是真的可以登入、可以點、有真實使用者在用的東西。',
      heroCta: '看 20 個作品',
      statWorks: '上線作品', statCategories: '應用領域', statLogin: '可登入體驗', statPpt: 'PPT 作業',
      // achievements
      achEyebrow: 'BY THE NUMBERS', achTitle: '數字會說話',
      achStudents: '結業學員', achProducts: '上線產品', achUsers: '累計使用者',
      achRevenue: '學員作品營收', achHire: '結業就業率', achCohorts: '已開期數',
      // projects
      projectsEyebrow: 'ALL PROJECTS', projectsTitle: '20 個作品 · 都能登入',
      searchPlaceholder: '搜尋作品、領域、技術…（試試「電商」「AI」「Next.js」）',
      sortLabel: '排序：', sortFeatured: '推薦', sortNewest: '最新', sortAlpha: '名稱',
      resultDefault: '顯示全部作品',
      resultAll: (n) => `顯示全部 ${n} 個作品`,
      resultFiltered: (n) => `共 ${n} 個符合條件的作品`,
      // empty
      emptyTitle: '沒有符合條件的作品', emptyDesc: '試試其他關鍵字，或點上方「全部」看看所有作品。',
      emptyReset: '清除所有篩選',
      // hall
      hallEyebrow: 'HALL OF FAME', hallTitle: '本期最受矚目作品',
      hallLead: '這些作品已經拿過獎、被業界肯定、進駐企業客戶。隨手點開都能秒懂為什麼。',
      // voices
      voicesEyebrow: 'VOICES', voicesTitle: '他們怎麼說',
      // about
      aboutEyebrow: 'ABOUT',
      aboutTitleA: '為什麼這些作品都', aboutTitleAccent: '真的上線', aboutTitleB: '？',
      aboutP1: '未來學院的訓練不是看影片、不是寫作業、不是做投影片。我們要學員從第一週就決定一個要解決的問題，然後在課程結束時，把它變成可被陌生人使用的產品。',
      aboutP2: '上面 20 個作品都是這樣長出來的。每一個都有真實使用者、真實流量、真實 bug，學員自己處理上線、自己面對使用者回饋、自己迭代。',
      pillar1Title: '真題目', pillar1Desc: '不是練習題，是學員自己關心的真實問題。',
      pillar2Title: '真上線', pillar2Desc: '結業前必須部署到公開網域，給陌生人使用。',
      pillar3Title: '真迭代', pillar3Desc: '結業後仍持續維護，這裡看到的是進行式。',
      // partners
      partnersEyebrow: 'PARTNERS & PRESS', partnersTitle: '業界都在看',
      pressTitle: '媒體報導 / Press Coverage',
      // cta
      ctaTitleA: '現在', ctaTitleAccent1: '看到', ctaTitleB: '的，',
      ctaTitleC: '18 週後可能就是', ctaTitleAccent2: '你', ctaTitleD: '的。',
      ctaLead: '第 5 期招生中 · 線上線下混合 · 18 週 · 名額有限',
      ctaPrimary: '立即報名第 5 期', ctaSecondary: '下載完整課程介紹',
      // footer
      footerContact: '聯絡我們', footerSocial: '社群', footerNote: '說明',
      footerNoteText: '所有 demo 帳密皆為公開測試帳號，請勿上傳真實資料。',
      // card / modal
      cardCta: '看完整介紹 · 開啟 Demo',
      cardAccount: '帳號', cardPassword: '密碼', cardCopy: '複製', cardCopied: '✓ 已複製',
      cardStudent: '學員',
      cardRibbon: '★ 推薦',
      modalCta: (name) => `開啟 ${name} · 立即測試`,
      modalFeatures: (n) => `功能特色 · ${n} 項`,
      modalTech: '技術棧', modalAi: '使用 AI 模型', modalAwards: '業界肯定',
      modalStudent: '學員', modalStatus: '狀態', modalLogin: '登入測試帳號',
      copySuccess: '已複製到剪貼簿', copyFail: '複製失敗，請手動選取',
    },
    en: {
      navWorks: 'Works', navCategories: 'Categories', navHall: 'Hall of Fame', navVoices: 'Voices', navAbout: 'About',
      navSearch: 'Search', navStatus: 'Student Works · LIVE',
      heroEyebrow: 'STUDENT SHOWCASE / 2025',
      heroTitleA: "It's not just ", heroTitleStrike: 'homework', heroTitleB: ',',
      heroTitleC: "they're ", heroAccent: 'live products', heroTitleD: '.',
      heroLead: 'Every single project here was built by a student in 18 weeks—from zero to live. Not slides, not demos, not "pretend functionality." Real products you can log into, click around, and where real users actually exist.',
      heroCta: 'See 20 projects',
      statWorks: 'live projects', statCategories: 'categories', statLogin: 'loggable', statPpt: 'PPT homework',
      achEyebrow: 'BY THE NUMBERS', achTitle: 'Numbers speak louder',
      achStudents: 'graduates', achProducts: 'live products', achUsers: 'total users',
      achRevenue: 'student revenue', achHire: 'hire rate', achCohorts: 'cohorts run',
      projectsEyebrow: 'ALL PROJECTS', projectsTitle: '20 Projects · All Loggable',
      searchPlaceholder: 'Search projects, categories, tech… (try "Commerce", "AI", "Next.js")',
      sortLabel: 'Sort:', sortFeatured: 'Featured', sortNewest: 'Newest', sortAlpha: 'A–Z',
      resultDefault: 'Showing all projects',
      resultAll: (n) => `Showing all ${n} projects`,
      resultFiltered: (n) => `${n} project${n === 1 ? '' : 's'} match your filter`,
      emptyTitle: 'No projects match', emptyDesc: 'Try a different keyword or hit "All" above.',
      emptyReset: 'Clear all filters',
      hallEyebrow: 'HALL OF FAME', hallTitle: "This cohort's standouts",
      hallLead: "These projects have won awards, earned industry praise, and onboarded enterprise clients. Click any to see why.",
      voicesEyebrow: 'VOICES', voicesTitle: 'What they say',
      aboutEyebrow: 'ABOUT',
      aboutTitleA: 'Why are all these projects ', aboutTitleAccent: 'actually live', aboutTitleB: '?',
      aboutP1: "Future Academy doesn't teach by lectures, homework, or slides. From week one, students pick a real problem they want to solve. By the end of the program, it has to be a working product strangers can use.",
      aboutP2: "All 20 projects above grew this way. Each has real users, real traffic, real bugs. Students handle deployment, real feedback, and iteration—on their own.",
      pillar1Title: 'Real problems', pillar1Desc: "Not exercises—real problems students personally care about.",
      pillar2Title: 'Real launches', pillar2Desc: "Must deploy to a public domain for strangers to use, before graduating.",
      pillar3Title: 'Real iteration', pillar3Desc: "Maintained after graduation. What you see is in progress.",
      partnersEyebrow: 'PARTNERS & PRESS', partnersTitle: 'The industry is watching',
      pressTitle: 'Press Coverage',
      ctaTitleA: 'What you ', ctaTitleAccent1: 'see now', ctaTitleB: ',',
      ctaTitleC: 'in 18 weeks could be ', ctaTitleAccent2: 'yours', ctaTitleD: '.',
      ctaLead: 'Cohort 5 enrollment · Hybrid · 18 weeks · Limited seats',
      ctaPrimary: 'Apply for Cohort 5', ctaSecondary: 'Download full curriculum',
      footerContact: 'Contact', footerSocial: 'Social', footerNote: 'Note',
      footerNoteText: 'All demo credentials are public test accounts. Do not upload real data.',
      cardCta: 'See full info · Open Demo',
      cardAccount: 'User', cardPassword: 'Pass', cardCopy: 'Copy', cardCopied: '✓ Copied',
      cardStudent: 'Student',
      cardRibbon: '★ Featured',
      modalCta: (name) => `Open ${name} · Try now`,
      modalFeatures: (n) => `Features · ${n} items`,
      modalTech: 'Tech stack', modalAi: 'AI models used', modalAwards: 'Industry recognition',
      modalStudent: 'Student', modalStatus: 'Status', modalLogin: 'Demo login credentials',
      copySuccess: 'Copied to clipboard', copyFail: 'Copy failed, please select manually',
    },
  };

  function t(key) {
    return I18N[state.lang][key] ?? I18N.zh[key] ?? key;
  }

  // 取得作品 / extras 的當語言欄位（fallback to zh）
  function L(obj, field) {
    if (!obj) return '';
    if (state.lang === 'en' && obj[field + '_en'] != null) return obj[field + '_en'];
    return obj[field];
  }

  function categoryList() {
    return state.lang === 'en' ? (window.CATEGORIES_EN || window.CATEGORIES) : window.CATEGORIES;
  }

  // === 狀態 ===
  const state = {
    category: '全部',
    keyword: '',
    sort: 'featured',
    lang: localStorage.getItem('lang') || 'zh',
  };

  // === DOM 取參考 ===
  const $pills = document.getElementById('categoryPills');
  const $grid = document.getElementById('worksGrid');
  const $empty = document.getElementById('worksEmpty');
  const $resetFilters = document.getElementById('resetFilters');
  const $resultCount = document.getElementById('resultCount');
  const $search = document.getElementById('searchInput');
  const $searchClear = document.getElementById('searchClear');
  const $sort = document.getElementById('sortSelect');
  const $statWorks = document.getElementById('statWorks');
  const $statCategories = document.getElementById('statCategories');
  const $modal = document.getElementById('modal');
  const $modalBody = document.getElementById('modalBody');
  const $toast = document.getElementById('toast');
  const $navSearchBtn = document.getElementById('navSearchBtn');

  // === 初始 stats ===
  if ($statWorks) $statWorks.textContent = works.length;
  if ($statCategories) $statCategories.textContent = categories.length - 1;

  // ============================================================
  // 渲染分類 pills（雙語：data-cat 永遠存 zh canonical）
  // ============================================================
  function renderPills() {
    const cats = window.CATEGORIES;
    const labels = categoryList();
    $pills.innerHTML = cats
      .map((c, i) => {
        const display = labels[i] || c;
        return `<button class="pill ${c === state.category ? 'pill--active' : ''}" data-cat="${escapeAttr(c)}">
          ${escapeHtml(display)}${c === '全部' ? '' : ` <span style="opacity:.5;font-size:11px">${countByCat(c)}</span>`}
        </button>`;
      })
      .join('');
  }
  function countByCat(c) {
    return works.filter((w) => w.category === c).length;
  }

  // ============================================================
  // 渲染卡片
  // ============================================================
  function renderCards() {
    const list = filteredAndSorted();
    $resultCount.textContent =
      list.length === works.length ? t('resultAll')(works.length) : t('resultFiltered')(list.length);

    if (list.length === 0) {
      $grid.innerHTML = '';
      $empty.hidden = false;
      return;
    }
    $empty.hidden = true;

    $grid.innerHTML = list
      .map((w, i) => cardTpl(w, i))
      .join('');
  }

  function cardTpl(w, i) {
    const [g1, g2] = w.gradient;
    const studentInitial = (w.student.name || '?')[0];
    const awards = L(w, 'awards') || w.awards || [];
    const metricsHtml = w.metrics
      ? `<div class="card__metrics">
          ${Object.entries(w.metrics).slice(0, 2)
            .map(([k, v]) => `<span class="metric"><span class="metric__val">${escapeHtml(v)}</span><span class="metric__lab">${escapeHtml(metricLabel(k))}</span></span>`).join('')}
        </div>` : '';
    const awardsHtml = awards.length
      ? `<div class="card__award" title="${escapeAttr(awards.join(' · '))}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9 2 9.5l5 5L5.5 22 12 18l6.5 4-1.5-7.5 5-5L16 9z"/></svg>
          ${escapeHtml(awards[0])}
        </div>` : '';
    return `
      <article class="card ${w.featured ? 'card--featured' : ''}" style="--g1:${g1};--g2:${g2};animation-delay:${i * 40}ms" data-id="${w.id}">
        ${w.featured ? `<span class="card__ribbon">${escapeHtml(t('cardRibbon'))}</span>` : ''}
        <div class="card__cover">
          <div class="card__shapes"><span class="card__shape card__shape--1"></span><span class="card__shape card__shape--2"></span><span class="card__shape card__shape--3"></span></div>
          <span class="card__id">No. ${w.id}</span>
          <span class="card__status">${escapeHtml(w.status || 'LIVE')}</span>
          <span class="card__icon">${w.icon}</span>
          <div class="card__mockup"><div class="card__mockup-bar"><span class="card__mockup-dot"></span><span class="card__mockup-dot"></span><span class="card__mockup-dot"></span></div><div class="card__mockup-line card__mockup-line--medium"></div><div class="card__mockup-line card__mockup-line--short"></div><div class="card__mockup-line card__mockup-line--accent"></div></div>
        </div>
        <div class="card__body">
          <div class="card__head">
            <span class="card__category">${escapeHtml(L(w, 'category'))}</span>
            ${metricsHtml}
          </div>
          <h3 class="card__title">${escapeHtml(L(w, 'title'))}</h3>
          <p class="card__subtitle">${escapeHtml(w.subtitle)}</p>
          <p class="card__summary">${escapeHtml(L(w, 'summary'))}</p>

          ${awardsHtml}

          <div class="card__tags">
            ${w.tech.slice(0, 4).map((tg) => `<span class="card__tag">${escapeHtml(tg)}</span>`).join('')}
            ${w.tech.length > 4 ? `<span class="card__tag">+${w.tech.length - 4}</span>` : ''}
          </div>

          <div class="card__student">
            <span class="card__avatar">${escapeHtml(studentInitial)}</span>
            <span>${escapeHtml(t('cardStudent'))} · <strong>${escapeHtml(w.student.name)}</strong> / ${escapeHtml(w.student.cohort)}${w.student.role ? ` · ${escapeHtml(w.student.role)}` : ''}</span>
          </div>

          <div class="creds">
            <div class="cred">
              <span class="cred__label">${escapeHtml(t('cardAccount'))}</span>
              <span class="cred__value">${escapeHtml(w.demo.account)}</span>
              <button class="cred__copy" data-copy="${escapeAttr(w.demo.account)}" data-stop>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                ${escapeHtml(t('cardCopy'))}
              </button>
            </div>
            <div class="cred">
              <span class="cred__label">${escapeHtml(t('cardPassword'))}</span>
              <span class="cred__value">${escapeHtml(w.demo.password)}</span>
              <button class="cred__copy" data-copy="${escapeAttr(w.demo.password)}" data-stop>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                ${escapeHtml(t('cardCopy'))}
              </button>
            </div>
          </div>

          <div class="card__cta">
            <span>${escapeHtml(t('cardCta'))}</span>
            <svg class="card__cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      </article>
    `;
  }

  // ============================================================
  // Modal 內：依分類產生「操作流程動畫」
  // 每個流程 4 個節點循環高亮，搭配資料流動光點
  // ============================================================
  function operationFlow(w) {
    const isEn = state.lang === 'en';
    const FLOWS = {
      '電商': isEn
        ? [['🛍️', 'Browse'], ['🤖', 'AI Match'], ['💬', 'AI Copy'], ['💳', 'Checkout']]
        : [['🛍️', '瀏覽商品'], ['🤖', 'AI 配對'], ['💬', 'AI 生成文案'], ['💳', '結帳']],
      '餐飲': isEn
        ? [['📱', 'QR Scan'], ['🍜', 'Order'], ['👨‍🍳', 'Kitchen'], ['📊', 'Analytics']]
        : [['📱', 'QR 掃碼'], ['🍜', '點餐'], ['👨‍🍳', '廚房製作'], ['📊', '銷售分析']],
      '影音': isEn
        ? [['📝', 'Text Input'], ['🎙️', 'AI Voice'], ['🎬', 'Render'], ['📺', 'Publish']]
        : [['📝', '文字腳本'], ['🎙️', 'AI 配音'], ['🎬', '渲染影片'], ['📺', '一鍵發佈']],
      '社群': isEn
        ? [['📍', 'Discover'], ['👥', 'Match'], ['🎉', 'Meet-up'], ['⭐', 'Rate']]
        : [['📍', '發現附近'], ['👥', '揪團媒合'], ['🎉', '線下參加'], ['⭐', '評分回饋']],
      'AI 應用': isEn
        ? [['💬', 'Question'], ['🧠', 'Reasoning'], ['🔧', 'Tool Use'], ['✨', 'Answer']]
        : [['💬', '使用者提問'], ['🧠', 'AI 推理'], ['🔧', '呼叫工具'], ['✨', '生成回答']],
      '自動化': isEn
        ? [['🎯', 'Trigger'], ['🤖', 'Agent'], ['📦', 'Process'], ['📤', 'Deliver']]
        : [['🎯', '主題輸入'], ['🤖', 'Agent 工作'], ['📦', '產出內容'], ['📤', '排程發佈']],
      '工具': isEn
        ? [['📥', 'Input'], ['⚙️', 'Process'], ['🪄', 'AI Polish'], ['📤', 'Output']]
        : [['📥', '資料輸入'], ['⚙️', '系統處理'], ['🪄', 'AI 優化'], ['📤', '匯出結果']],
      '個人財務': isEn
        ? [['🏦', 'Sync Banks'], ['🤖', 'Auto-Tag'], ['📊', 'Analyze'], ['💡', 'Advice']]
        : [['🏦', '同步銀行'], ['🤖', 'AI 分類'], ['📊', '財務分析'], ['💡', 'AI 建議']],
      '健康': isEn
        ? [['📷', 'Photo'], ['🧬', 'AI Detect'], ['💪', 'Track'], ['🎯', 'Goal']]
        : [['📷', '拍照記錄'], ['🧬', 'AI 偵測'], ['💪', '追蹤進度'], ['🎯', '達標']],
      '學習': isEn
        ? [['📖', 'Read'], ['💡', 'Extract'], ['🃏', 'Card'], ['🔁', 'Review']]
        : [['📖', '閱讀內容'], ['💡', 'AI 萃取'], ['🃏', '生成卡片'], ['🔁', '間隔複習']],
      '旅遊': isEn
        ? [['🗣️', 'Tell AI'], ['🔍', 'Compare'], ['📅', 'Plan'], ['✈️', 'Travel']]
        : [['🗣️', '告訴 AI'], ['🔍', '500 平台比價'], ['📅', '規劃行程'], ['✈️', '出發']],
      '職涯': isEn
        ? [['📝', 'Resume'], ['🎯', 'Job Match'], ['🤖', 'Mock Interview'], ['🎉', 'Offer']]
        : [['📝', '填資料'], ['🎯', '職缺匹配'], ['🤖', 'AI 模擬面試'], ['🎉', '錄取']],
      '設計': isEn
        ? [['📷', 'Collect'], ['🎨', 'AI Color'], ['🧩', 'Blend'], ['✨', 'System']]
        : [['📷', '收集靈感'], ['🎨', 'AI 配色'], ['🧩', '融合 DNA'], ['✨', '產出系統']],
      '內容創作': isEn
        ? [['🎤', 'Audio'], ['📝', 'Transcribe'], ['📌', 'Chapters'], ['📤', 'Publish']]
        : [['🎤', '上傳音檔'], ['📝', '逐字稿'], ['📌', '章節摘要'], ['📤', '一鍵發佈']],
      '生活': isEn
        ? [['📷', 'Photo'], ['🤖', 'AI Detect'], ['📊', 'Record'], ['🔔', 'Alert']]
        : [['📷', '拍照記錄'], ['🤖', 'AI 偵測'], ['📊', '健康紀錄'], ['🔔', '異常提醒']],
    };
    const flow = FLOWS[w.category] || FLOWS['工具'];
    const flowLabel = isEn ? 'OPERATION FLOW' : '操作流程動畫';
    return `
      <div class="m__demo-anim">
        <span class="m__demo-anim__label">${flowLabel}</span>
        <div class="flow">
          ${flow.map(([icon, label], i) => `
            <div class="flow-node" data-state="${i + 1}">
              <span class="flow-node__icon">${icon}</span>
              <span>${escapeHtml(label)}</span>
            </div>
            ${i < flow.length - 1 ? '<div class="flow-arrow"><span class="pulse"></span></div>' : ''}
          `).join('')}
        </div>
      </div>
    `;
  }

  function metricLabel(key) {
    const zhMap = {
      users: '使用者', mau: '月活躍', orders: '訂單', videos: '產出影片', chats: '對話',
      tasks: '任務', sites: '網站', responses: '回收', books: '本', hours: '小時',
      pets: '隻', notes: '筆', trips: '次', resumes: '份', boards: '個', posts: '篇',
      rating: '評分', uptime: '穩定性',
    };
    const enMap = {
      users: 'users', mau: 'MAU', orders: 'orders', videos: 'videos', chats: 'chats',
      tasks: 'tasks', sites: 'sites', responses: 'responses', books: 'books', hours: 'hours',
      pets: 'pets', notes: 'notes', trips: 'trips', resumes: 'resumes', boards: 'boards', posts: 'posts',
      rating: 'rating', uptime: 'uptime',
    };
    const map = state.lang === 'en' ? enMap : zhMap;
    return map[key] || key;
  }

  // ============================================================
  // 過濾 + 排序
  // ============================================================
  function filteredAndSorted() {
    let list = works.filter((w) => {
      if (state.category !== '全部' && w.category !== state.category) return false;
      if (state.keyword) {
        const k = state.keyword.toLowerCase();
        const hay = (
          w.title + (w.title_en || '') + w.subtitle + w.summary + (w.summary_en || '') +
          w.category + (w.category_en || '') + w.tech.join(' ') + w.student.name
        ).toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });

    if (state.sort === 'featured') {
      list.sort((a, b) => (b.featured === a.featured ? Number(a.id) - Number(b.id) : b.featured - a.featured));
    } else if (state.sort === 'newest') {
      list.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (state.sort === 'alpha') {
      list.sort((a, b) => L(a, 'title').localeCompare(L(b, 'title'), state.lang === 'en' ? 'en' : 'zh-Hant'));
    }
    return list;
  }

  // ============================================================
  // 事件：分類 pill 點擊
  // ============================================================
  $pills.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderPills();
    renderCards();
  });

  // ============================================================
  // 事件：搜尋
  // ============================================================
  $search.addEventListener('input', (e) => {
    state.keyword = e.target.value.trim();
    $searchClear.hidden = !state.keyword;
    renderCards();
  });
  $searchClear.addEventListener('click', () => {
    state.keyword = '';
    $search.value = '';
    $searchClear.hidden = true;
    renderCards();
  });
  if ($navSearchBtn) {
    $navSearchBtn.addEventListener('click', () => {
      $search.focus();
      $search.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ⌘K / Ctrl+K 聚焦搜尋
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $search.focus();
      $search.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (e.key === 'Escape') closeModal();
  });

  // ============================================================
  // 事件：排序
  // ============================================================
  $sort.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderCards();
  });

  // ============================================================
  // 事件：清除篩選
  // ============================================================
  if ($resetFilters) {
    $resetFilters.addEventListener('click', () => {
      state.category = '全部';
      state.keyword = '';
      $search.value = '';
      $searchClear.hidden = true;
      renderPills();
      renderCards();
    });
  }

  // ============================================================
  // 事件：卡片點擊（事件委派）
  // ============================================================
  $grid.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      e.stopPropagation();
      copyToClipboard(copyBtn.dataset.copy, copyBtn);
      return;
    }
    if (e.target.closest('[data-stop]')) {
      e.stopPropagation();
      return;
    }
    const card = e.target.closest('.card');
    if (!card) return;
    const work = works.find((w) => w.id === card.dataset.id);
    if (!work) return;
    openModal(work);
  });

  // ============================================================
  // 複製到剪貼簿
  // ============================================================
  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const original = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = t('cardCopied');
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = original;
        }, 1500);
      }
      showToast(t('copySuccess'));
    }).catch(() => showToast(t('copyFail')));
  }

  // ============================================================
  // Toast
  // ============================================================
  let toastTimer;
  function showToast(msg) {
    $toast.textContent = msg;
    $toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $toast.hidden = true;
    }, 2000);
  }

  // ============================================================
  // Modal：作品詳情
  // ============================================================
  function openModal(w) {
    const [g1, g2] = w.gradient;
    const highlights = L(w, 'highlights') || w.highlights || [];
    const features = L(w, 'features') || w.features || [];
    const awards = L(w, 'awards') || w.awards || [];

    const highlightsHtml = highlights.length
      ? `<div class="m__highlights">
          ${highlights.map((h) => `<div class="m__highlight"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>${escapeHtml(h)}</span></div>`).join('')}
        </div>` : '';
    const metricsHtml = w.metrics
      ? `<div class="m__metrics">
          ${Object.entries(w.metrics).map(([k, v]) => `<div class="m__metric"><p class="m__metric-val">${escapeHtml(v)}</p><p class="m__metric-lab">${escapeHtml(metricLabel(k))}</p></div>`).join('')}
        </div>` : '';
    const awardsHtml = awards.length
      ? `<p class="m__sec-title">${escapeHtml(t('modalAwards'))}</p>
        <div class="m__awards">
          ${awards.map((a) => `<span class="m__award"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9 2 9.5l5 5L5.5 22 12 18l6.5 4-1.5-7.5 5-5L16 9z"/></svg>${escapeHtml(a)}</span>`).join('')}
        </div>` : '';
    const modelsHtml = w.modelsUsed && w.modelsUsed.length
      ? `<p class="m__sec-title">${escapeHtml(t('modalAi'))}</p>
        <div class="m__tech">${w.modelsUsed.map((m) => `<span class="m__tech-item m__tech-item--ai">${escapeHtml(m)}</span>`).join('')}</div>` : '';

    $modalBody.innerHTML = `
      <div class="m__cover" style="--g1:${g1};--g2:${g2}">
        <span class="m__id">No. ${w.id} · ${escapeHtml(w.subtitle)}</span>
        <span class="m__icon">${w.icon}</span>
      </div>
      <div class="m__body">
        <span class="m__category">${escapeHtml(L(w, 'category'))}</span>
        <h2 class="m__title">${escapeHtml(L(w, 'title'))}</h2>
        <p class="m__subtitle">${escapeHtml(w.subtitle)}</p>
        <p class="m__desc">${escapeHtml(L(w, 'description'))}</p>

        ${operationFlow(w)}

        ${highlightsHtml}
        ${metricsHtml}

        <p class="m__sec-title">${escapeHtml(t('modalFeatures')(features.length))}</p>
        <ul class="m__features">
          ${features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>

        <p class="m__sec-title">${escapeHtml(t('modalTech'))}</p>
        <div class="m__tech">
          ${w.tech.map((tg) => `<span class="m__tech-item">${escapeHtml(tg)}</span>`).join('')}
        </div>

        ${modelsHtml}
        ${awardsHtml}

        <div class="m__row">
          <div class="m__info">
            <p class="m__info-label">${escapeHtml(t('modalStudent'))}</p>
            <p class="m__info-val">${escapeHtml(w.student.name)} · ${escapeHtml(w.student.cohort)}${w.student.role ? `<br><span style="font-size:12px;color:var(--text-tertiary);font-weight:400">${escapeHtml(w.student.role)}</span>` : ''}</p>
          </div>
          <div class="m__info">
            <p class="m__info-label">${escapeHtml(t('modalStatus'))}</p>
            <p class="m__info-val" style="color:var(--accent)">● ${escapeHtml(w.status)}</p>
          </div>
        </div>

        <p class="m__sec-title">${escapeHtml(t('modalLogin'))}</p>
        <div class="creds" style="margin-bottom:24px">
          <div class="cred">
            <span class="cred__label">${escapeHtml(t('cardAccount'))}</span>
            <span class="cred__value">${escapeHtml(w.demo.account)}</span>
            <button class="cred__copy" data-copy="${escapeAttr(w.demo.account)}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              ${escapeHtml(t('cardCopy'))}
            </button>
          </div>
          <div class="cred">
            <span class="cred__label">${escapeHtml(t('cardPassword'))}</span>
            <span class="cred__value">${escapeHtml(w.demo.password)}</span>
            <button class="cred__copy" data-copy="${escapeAttr(w.demo.password)}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              ${escapeHtml(t('cardCopy'))}
            </button>
          </div>
        </div>

        <a href="${escapeAttr(w.demo.url)}" target="_blank" rel="noopener" class="m__cta">
          ${escapeHtml(t('modalCta')(L(w, 'title')))}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><line x1="7" y1="17" x2="17" y2="7"/></svg>
        </a>
      </div>
    `;
    $modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if ($modal.hidden) return;
    $modal.hidden = true;
    document.body.style.overflow = '';
  }

  $modal.addEventListener('click', (e) => {
    if (e.target.dataset.close !== undefined) closeModal();
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      e.stopPropagation();
      copyToClipboard(copyBtn.dataset.copy, copyBtn);
    }
  });

  // ============================================================
  // Helpers
  // ============================================================
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  // ============================================================
  // v3 增強：活動 ticker / 數字滾動 / 3D 傾斜 / scroll reveal
  // ============================================================

  // --- 活動 ticker（雙語） ---
  function buildTicker() {
    const $track = document.getElementById('tickerTrack');
    if (!$track) return;
    const isEn = state.lang === 'en';
    const templates = isEn ? [
      { icon: '🚀', tpl: (n) => `${n} shipped v${(2 + Math.random()).toFixed(1)}, ${Math.floor(Math.random() * 25 + 8)}% faster` },
      { icon: '✨', tpl: (n, num) => `${n} crossed ${num.toLocaleString()} cumulative users` },
      { icon: '📈', tpl: (n, num) => `${n} hit ${num.toLocaleString()} interactions this month` },
      { icon: '🎯', tpl: (n) => `${n} reached ${Math.floor(Math.random() * 30 + 70)} days without downtime` },
      { icon: '⭐', tpl: (n) => `${n} maintains a ${(4.6 + Math.random() * 0.3).toFixed(1)}-star rating` },
      { icon: '🔥', tpl: (n) => `${n} trended ${Math.floor(Math.random() * 14 + 3)} days in a row` },
      { icon: '👥', tpl: (n, num) => `${n} added ${num.toLocaleString()} active users` },
      { icon: '🌟', tpl: (n) => `${n} added to Future Academy picks` },
      { icon: '🎉', tpl: (n, num) => `${n} weekly actives hit ${num.toLocaleString()}` },
      { icon: '💚', tpl: (n, num) => `${n} got their ${num.toLocaleString()}th 5-star review` },
      { icon: '⚡', tpl: (n) => `${n} uptime hit ${(99 + Math.random() * 0.99).toFixed(2)}%` },
      { icon: '🎁', tpl: (n, num) => `${n} invited ${num.toLocaleString()} testers to Beta` },
    ] : [
      { icon: '🚀', tpl: (n) => `${n} 部署了 v${(2 + Math.random()).toFixed(1)} 版本，效能提升 ${Math.floor(Math.random() * 25 + 8)}%` },
      { icon: '✨', tpl: (n, num) => `${n} 累計使用人次突破 ${num.toLocaleString()}` },
      { icon: '📈', tpl: (n, num) => `${n} 本月互動數達 ${num.toLocaleString()} 次` },
      { icon: '🎯', tpl: (n) => `${n} 達成 ${Math.floor(Math.random() * 30 + 70)} 天連續無故障運行` },
      { icon: '⭐', tpl: (n) => `${n} 評分維持在 ${(4.6 + Math.random() * 0.3).toFixed(1)} 星` },
      { icon: '🔥', tpl: (n) => `${n} 連續 ${Math.floor(Math.random() * 14 + 3)} 天上榜熱門產品` },
      { icon: '👥', tpl: (n, num) => `${n} 新增 ${num.toLocaleString()} 位活躍使用者` },
      { icon: '🌟', tpl: (n) => `${n} 被加入未來學院精選` },
      { icon: '🎉', tpl: (n, num) => `${n} 週活躍使用者達 ${num.toLocaleString()}` },
      { icon: '💚', tpl: (n, num) => `${n} 獲得第 ${num.toLocaleString()} 則五星好評` },
      { icon: '⚡', tpl: (n) => `${n} 上線時間連續突破 ${(99 + Math.random() * 0.99).toFixed(2)}%` },
      { icon: '🎁', tpl: (n, num) => `${n} 邀請 ${num.toLocaleString()} 位試用者進入 Beta` },
    ];
    const times = isEn
      ? ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '23 min ago', '34 min ago', '47 min ago', '1 hr ago', '2 hr ago']
      : ['剛剛', '2 分鐘前', '5 分鐘前', '8 分鐘前', '12 分鐘前', '15 分鐘前', '23 分鐘前', '34 分鐘前', '47 分鐘前', '1 小時前', '2 小時前'];
    const pool = [...works].sort(() => Math.random() - 0.5);
    const items = [];
    for (let i = 0; i < 18; i++) {
      const w = pool[i % pool.length];
      const tt = templates[Math.floor(Math.random() * templates.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      const num = Math.floor(Math.random() * 9 + 1) * 1000 + Math.floor(Math.random() * 1000);
      const nameHtml = `<span class="ticker__item-name">${escapeHtml(L(w, 'title'))}</span>`;
      items.push(
        `<div class="ticker__item"><span class="ticker__item-time">${time}</span><span class="ticker__item-icon">${tt.icon}</span>${tt.tpl(nameHtml, num)}</div>`,
      );
    }
    $track.innerHTML = `<div class="ticker__track-inner">${items.join('')}${items.join('')}</div>`;
  }

  // --- 數字滾動動畫 ---
  function animateNumber(el, target, duration = 1400) {
    if (!el) return;
    const isPercent = String(target).includes('%');
    const finalNum = parseInt(String(target).replace(/[^0-9]/g, ''), 10);
    if (isNaN(finalNum)) return;
    const start = performance.now();
    el.classList.add('is-animating');
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.floor(eased * finalNum);
      el.textContent = isPercent ? `${v}%` : v;
      if (t < 1) requestAnimationFrame(frame);
      else {
        el.textContent = String(target);
        setTimeout(() => el.classList.remove('is-animating'), 300);
      }
    }
    requestAnimationFrame(frame);
  }

  function animateHeroStats() {
    document.querySelectorAll('.stat__num').forEach((el, i) => {
      const target = el.textContent;
      el.textContent = '0';
      setTimeout(() => animateNumber(el, target), 100 + i * 120);
    });
  }

  // --- 3D 卡片傾斜 ---
  function setupTilt() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      let rafId;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = -y * 5;
        const tiltY = x * 5;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.classList.add('is-tilting');
          card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  // --- Scroll reveal（不含 hero 內元素，hero 已用 setupHeroReveal 整段淡入） ---
  function setupReveal() {
    const targets = document.querySelectorAll('.about__grid, .pillar');
    targets.forEach((t) => t.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // 動畫結束後釋放 GPU 圖層，避免巨型字次像素糊化
            setTimeout(() => entry.target.classList.add('is-settled'), 700);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
  }

  // ============================================================
  // v4 PREMIUM 升級
  // ============================================================

  // --- 自訂游標（blob + dot + label） ---
  function setupCursor() {
    if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const $cursor = document.getElementById('cursor');
    const $blob = $cursor.querySelector('.cursor__blob');
    const $dot = $cursor.querySelector('.cursor__dot');
    const $label = document.getElementById('cursorLabel');
    let mx = 0, my = 0, bx = 0, by = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      $dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    function loop() {
      bx += (mx - bx) * 0.18;
      by += (my - by) * 0.18;
      $blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`;
      $label.style.transform = `translate(${bx}px, ${by}px)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.addEventListener('mouseenter', () => ($cursor.style.opacity = '1'));
    document.addEventListener('mouseleave', () => ($cursor.style.opacity = '0'));
    document.addEventListener('mousedown', () => $cursor.classList.add('is-clicking'));
    document.addEventListener('mouseup', () => $cursor.classList.remove('is-clicking'));

    // hover 互動類元素時放大 + 顯示 label
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, .pill, .card, [data-cursor]');
      if (interactive) {
        $cursor.classList.add('is-hovering');
        const labelText =
          interactive.dataset.cursor ||
          (interactive.classList.contains('card') ? '查看詳情' : '');
        if (labelText) {
          $label.textContent = labelText;
          $cursor.classList.add('has-label');
        }
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('a, button, .pill, .card, [data-cursor]')) {
        $cursor.classList.remove('is-hovering', 'has-label');
      }
    });
  }

  // --- 磁吸按鈕（鼠標靠近會輕微吸附） ---
  function setupMagnetic() {
    if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
  }

  // --- Hero 標題：整段淡入（不拆字、不 inline-block、不 transform） ---
  function setupHeroReveal() {
    const $hero = document.getElementById('hero');
    if (!$hero) return;
    setTimeout(() => $hero.classList.add('is-revealed'), 60);
    setTimeout(() => $hero.classList.add('is-settled'), 800);
  }

  // --- 卡片 mouse-following border light ---
  function setupCardGlow() {
    document.querySelectorAll('.card').forEach((card) => {
      // 注入 glow 元素
      if (!card.querySelector('.card__glow')) {
        const glow = document.createElement('div');
        glow.className = 'card__glow';
        card.appendChild(glow);
      }
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
      });
    });
  }

  // ============================================================
  // 整體成就數字
  // ============================================================
  function renderAchievements() {
    const $grid = document.getElementById('achievementsGrid');
    if (!$grid || !window.ACHIEVEMENTS) return;
    const a = window.ACHIEVEMENTS;
    const isEn = state.lang === 'en';
    const items = [
      { num: a.totalStudents, suffix: '+', label: t('achStudents') },
      { num: a.totalLiveProducts, suffix: isEn ? '' : '個', label: t('achProducts') },
      { num: a.totalUsers, suffix: '+', label: t('achUsers'), format: 'short' },
      { num: a.totalRevenue, suffix: '+', label: t('achRevenue'), prefix: 'NT$', format: 'short' },
      { num: a.hireRate, suffix: '%', label: t('achHire') },
      { num: a.cohorts, suffix: isEn ? '' : '期', label: t('achCohorts') },
    ];
    $grid.innerHTML = items.map((it) => {
      let num = it.num;
      if (it.format === 'short') {
        if (num >= 1000000) num = (num / 1000000).toFixed(1) + 'M';
        else if (num >= 10000) num = isEn ? (num / 1000).toFixed(0) + 'K' : (num / 10000).toFixed(1) + '萬';
        else if (num >= 1000) num = (num / 1000).toFixed(1) + 'K';
      } else {
        num = num.toLocaleString();
      }
      return `<div class="ach"><span class="ach__num">${it.prefix || ''}${num}<span class="ach__suffix">${it.suffix}</span></span><span class="ach__lab">${escapeHtml(it.label)}</span></div>`;
    }).join('');
  }

  // ============================================================
  // Hall of Fame（橫向 scroller）
  // ============================================================
  function renderHall() {
    const $track = document.getElementById('hallTrack');
    if (!$track) return;
    const featured = works.filter((w) => w.featured);
    $track.innerHTML = featured.map((w, i) => {
      const [g1, g2] = w.gradient;
      const highlights = L(w, 'highlights');
      const top = (highlights && highlights[0]) || L(w, 'summary');
      return `<article class="hall__card" style="--g1:${g1};--g2:${g2}" data-id="${w.id}">
        <div class="hall__cover">
          <span class="hall__rank">${String(i + 1).padStart(2, '0')}</span>
          <span class="hall__icon">${w.icon}</span>
        </div>
        <div class="hall__body">
          <span class="hall__cat">${escapeHtml(L(w, 'category'))}</span>
          <h3 class="hall__title">${escapeHtml(L(w, 'title'))}</h3>
          <p class="hall__sub">${escapeHtml(w.subtitle)}</p>
          <p class="hall__highlight">${escapeHtml(top)}</p>
        </div>
      </article>`;
    }).join('');
    $track.addEventListener('click', (e) => {
      const card = e.target.closest('.hall__card');
      if (!card) return;
      const w = works.find((x) => x.id === card.dataset.id);
      if (w) openModal(w);
    });
  }

  // ============================================================
  // 學員/業界見證
  // ============================================================
  function renderVoices() {
    const $grid = document.getElementById('voicesGrid');
    if (!$grid || !window.TESTIMONIALS) return;
    $grid.innerHTML = window.TESTIMONIALS.map((tm) => {
      const name = L(tm, 'name');
      const initial = (name || '?')[0];
      return `<div class="voice">
        <span class="voice__quote-mark">"</span>
        <p class="voice__rating">${'★'.repeat(tm.rating || 5)}</p>
        <p class="voice__quote">${escapeHtml(L(tm, 'quote'))}</p>
        <div class="voice__author">
          <span class="voice__avatar">${escapeHtml(initial)}</span>
          <div>
            <p class="voice__name">${escapeHtml(name)}</p>
            <p class="voice__meta">${escapeHtml(L(tm, 'role'))} · <span class="voice__company">${escapeHtml(tm.company)}</span></p>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // ============================================================
  // Partners + Press
  // ============================================================
  function renderPartners() {
    const $grid = document.getElementById('partnersGrid');
    const $press = document.getElementById('pressList');
    if (!window.PARTNERS || !window.PRESS) return;
    if ($grid) {
      $grid.innerHTML = window.PARTNERS.map((p) =>
        `<div class="partner">
          <p class="partner__name">${escapeHtml(L(p, 'name'))}</p>
          <p class="partner__tag">${escapeHtml(L(p, 'tag'))}</p>
        </div>`).join('');
    }
    if ($press) {
      const isEn = state.lang === 'en';
      $press.innerHTML =
        `<p class="press__title">${escapeHtml(t('pressTitle'))}</p>` +
        window.PRESS.map((p) =>
          `<div class="press__item">
            <span class="press__source">${escapeHtml(L(p, 'source'))}</span>
            <p class="press__headline">${isEn ? '"' : '「'}${escapeHtml(L(p, 'headline'))}${isEn ? '"' : '」'}</p>
          </div>`).join('');
    }
  }

  // ============================================================
  // i18n：套用所有 [data-i18n] / [data-i18n-placeholder]
  // ============================================================
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const v = t(key);
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const v = t(el.dataset.i18nPlaceholder);
      if (typeof v === 'string') el.placeholder = v;
    });
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-Hant';
    // toggle 按鈕的「目前」「另一個」顯示
    const $cur = document.getElementById('langCur');
    const $alt = document.getElementById('langAlt');
    if ($cur && $alt) {
      $cur.textContent = state.lang === 'en' ? 'EN' : '中';
      $alt.textContent = state.lang === 'en' ? '中' : 'EN';
    }
  }

  // 切換語言 → 重跑所有 dynamic render
  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang;
    localStorage.setItem('lang', lang);
    applyI18n();
    renderPills();
    renderCards();
    buildTicker();
    renderAchievements();
    renderHall();
    renderVoices();
    renderPartners();
    // hero word reveal: 重新處理 + 觸發
    rebindHeroReveal();
  }

  function setupLangToggle() {
    const $btn = document.getElementById('langToggle');
    if (!$btn) return;
    $btn.addEventListener('click', () => setLang(state.lang === 'en' ? 'zh' : 'en'));
  }

  // 切語言時 hero 標題的 i18n applyI18n 會自動更新文字，這邊只需重跑淡入
  function rebindHeroReveal() {
    const $hero = document.getElementById('hero');
    if (!$hero) return;
    $hero.classList.remove('is-revealed', 'is-settled');
    setupHeroReveal();
  }

  // ============================================================
  // 初始渲染
  // ============================================================
  applyI18n();
  setupLangToggle();
  renderPills();
  renderCards();
  buildTicker();
  renderAchievements();
  renderHall();
  renderVoices();
  renderPartners();
  setupReveal();
  setupCursor();
  setupMagnetic();
  setupHeroReveal();

  requestAnimationFrame(() => requestAnimationFrame(animateHeroStats));
  setTimeout(() => {
    setupTilt();
    setupCardGlow();
  }, 100);

  new MutationObserver(() => {
    setTimeout(() => {
      setupTilt();
      setupCardGlow();
    }, 50);
  }).observe($grid, { childList: true });
})();
