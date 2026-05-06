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
  const categories = window.CATEGORIES || ['全部'];

  // === 狀態 ===
  const state = {
    category: '全部',
    keyword: '',
    sort: 'featured',
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
  // 渲染分類 pills
  // ============================================================
  function renderPills() {
    $pills.innerHTML = categories
      .map(
        (c) => `
        <button class="pill ${c === state.category ? 'pill--active' : ''}" data-cat="${escapeAttr(c)}">
          ${escapeHtml(c)}${c === '全部' ? '' : ` <span style="opacity:.5;font-size:11px">${countByCat(c)}</span>`}
        </button>
      `,
      )
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
      list.length === works.length
        ? `顯示全部 ${works.length} 個作品`
        : `共 ${list.length} 個符合條件的作品`;

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
    const metricsHtml = w.metrics
      ? `<div class="card__metrics">
          ${Object.entries(w.metrics)
            .slice(0, 2)
            .map(
              ([k, v]) => `<span class="metric">
                <span class="metric__val">${escapeHtml(v)}</span>
                <span class="metric__lab">${escapeHtml(metricLabel(k))}</span>
              </span>`,
            )
            .join('')}
        </div>`
      : '';
    const awardsHtml =
      w.awards && w.awards.length
        ? `<div class="card__award" title="${escapeAttr(w.awards.join(' · '))}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9 2 9.5l5 5L5.5 22 12 18l6.5 4-1.5-7.5 5-5L16 9z"/></svg>
            ${escapeHtml(w.awards[0])}
          </div>`
        : '';
    return `
      <article class="card ${w.featured ? 'card--featured' : ''}" style="--g1:${g1};--g2:${g2};animation-delay:${i * 40}ms" data-id="${w.id}">
        ${w.featured ? '<span class="card__ribbon">★ 推薦</span>' : ''}
        <div class="card__cover">
          <div class="card__shapes">
            <span class="card__shape card__shape--1"></span>
            <span class="card__shape card__shape--2"></span>
            <span class="card__shape card__shape--3"></span>
          </div>
          <span class="card__id">No. ${w.id}</span>
          <span class="card__status">${escapeHtml(w.status || 'LIVE')}</span>
          <span class="card__icon">${w.icon}</span>
          <div class="card__mockup">
            <div class="card__mockup-bar">
              <span class="card__mockup-dot"></span>
              <span class="card__mockup-dot"></span>
              <span class="card__mockup-dot"></span>
            </div>
            <div class="card__mockup-line card__mockup-line--medium"></div>
            <div class="card__mockup-line card__mockup-line--short"></div>
            <div class="card__mockup-line card__mockup-line--accent"></div>
          </div>
        </div>
        <div class="card__body">
          <div class="card__head">
            <span class="card__category">${escapeHtml(w.category)}</span>
            ${metricsHtml}
          </div>
          <h3 class="card__title">${escapeHtml(w.title)}</h3>
          <p class="card__subtitle">${escapeHtml(w.subtitle)}</p>
          <p class="card__summary">${escapeHtml(w.summary)}</p>

          ${awardsHtml}

          <div class="card__tags">
            ${w.tech
              .slice(0, 4)
              .map((t) => `<span class="card__tag">${escapeHtml(t)}</span>`)
              .join('')}
            ${w.tech.length > 4 ? `<span class="card__tag">+${w.tech.length - 4}</span>` : ''}
          </div>

          <div class="card__student">
            <span class="card__avatar">${escapeHtml(studentInitial)}</span>
            <span>學員 · <strong>${escapeHtml(w.student.name)}</strong> / ${escapeHtml(w.student.cohort)}${w.student.role ? ` · ${escapeHtml(w.student.role)}` : ''}</span>
          </div>

          <div class="creds">
            <div class="cred">
              <span class="cred__label">帳號</span>
              <span class="cred__value">${escapeHtml(w.demo.account)}</span>
              <button class="cred__copy" data-copy="${escapeAttr(w.demo.account)}" data-stop>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                複製
              </button>
            </div>
            <div class="cred">
              <span class="cred__label">密碼</span>
              <span class="cred__value">${escapeHtml(w.demo.password)}</span>
              <button class="cred__copy" data-copy="${escapeAttr(w.demo.password)}" data-stop>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                複製
              </button>
            </div>
          </div>

          <div class="card__cta">
            <span>看完整介紹 · 開啟 Demo</span>
            <svg class="card__cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      </article>
    `;
  }

  function metricLabel(key) {
    const map = {
      users: '使用者',
      mau: '月活躍',
      orders: '訂單',
      videos: '產出影片',
      chats: '對話',
      tasks: '任務',
      sites: '網站',
      responses: '回收',
      books: '本',
      hours: '小時',
      pets: '隻',
      notes: '筆',
      trips: '次',
      resumes: '份',
      boards: '個',
      posts: '篇',
      rating: '評分',
      uptime: '穩定性',
    };
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
        const hay =
          (w.title + w.subtitle + w.summary + w.category + w.tech.join(' ') + w.student.name).toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });

    if (state.sort === 'featured') {
      list.sort((a, b) => (b.featured === a.featured ? Number(a.id) - Number(b.id) : b.featured - a.featured));
    } else if (state.sort === 'newest') {
      list.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (state.sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (btn) {
          const original = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = '✓ 已複製';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = original;
          }, 1500);
        }
        showToast('已複製到剪貼簿');
      })
      .catch(() => {
        showToast('複製失敗，請手動選取');
      });
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

    const highlightsHtml =
      w.highlights && w.highlights.length
        ? `<div class="m__highlights">
            ${w.highlights
              .map(
                (h) => `<div class="m__highlight">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${escapeHtml(h)}</span>
                </div>`,
              )
              .join('')}
          </div>`
        : '';

    const metricsHtml = w.metrics
      ? `<div class="m__metrics">
          ${Object.entries(w.metrics)
            .map(
              ([k, v]) => `<div class="m__metric">
                <p class="m__metric-val">${escapeHtml(v)}</p>
                <p class="m__metric-lab">${escapeHtml(metricLabel(k))}</p>
              </div>`,
            )
            .join('')}
        </div>`
      : '';

    const awardsHtml =
      w.awards && w.awards.length
        ? `<p class="m__sec-title">業界肯定</p>
          <div class="m__awards">
            ${w.awards
              .map(
                (a) => `<span class="m__award">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9 2 9.5l5 5L5.5 22 12 18l6.5 4-1.5-7.5 5-5L16 9z"/></svg>
                  ${escapeHtml(a)}
                </span>`,
              )
              .join('')}
          </div>`
        : '';

    const modelsHtml =
      w.modelsUsed && w.modelsUsed.length
        ? `<p class="m__sec-title">使用 AI 模型</p>
          <div class="m__tech">
            ${w.modelsUsed.map((m) => `<span class="m__tech-item m__tech-item--ai">${escapeHtml(m)}</span>`).join('')}
          </div>`
        : '';

    $modalBody.innerHTML = `
      <div class="m__cover" style="--g1:${g1};--g2:${g2}">
        <span class="m__id">No. ${w.id} · ${escapeHtml(w.subtitle)}</span>
        <span class="m__icon">${w.icon}</span>
      </div>
      <div class="m__body">
        <span class="m__category">${escapeHtml(w.category)}</span>
        <h2 class="m__title">${escapeHtml(w.title)}</h2>
        <p class="m__subtitle">${escapeHtml(w.subtitle)}</p>
        <p class="m__desc">${escapeHtml(w.description)}</p>

        ${highlightsHtml}
        ${metricsHtml}

        <p class="m__sec-title">功能特色 · ${w.features.length} 項</p>
        <ul class="m__features">
          ${w.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>

        <p class="m__sec-title">技術棧</p>
        <div class="m__tech">
          ${w.tech.map((t) => `<span class="m__tech-item">${escapeHtml(t)}</span>`).join('')}
        </div>

        ${modelsHtml}
        ${awardsHtml}

        <div class="m__row">
          <div class="m__info">
            <p class="m__info-label">學員</p>
            <p class="m__info-val">${escapeHtml(w.student.name)} · ${escapeHtml(w.student.cohort)}${w.student.role ? `<br><span style="font-size:12px;color:var(--text-tertiary);font-weight:400">${escapeHtml(w.student.role)}</span>` : ''}</p>
          </div>
          <div class="m__info">
            <p class="m__info-label">狀態</p>
            <p class="m__info-val" style="color:var(--accent)">● ${escapeHtml(w.status)}</p>
          </div>
        </div>

        <p class="m__sec-title">登入測試帳號</p>
        <div class="creds" style="margin-bottom:24px">
          <div class="cred">
            <span class="cred__label">帳號</span>
            <span class="cred__value">${escapeHtml(w.demo.account)}</span>
            <button class="cred__copy" data-copy="${escapeAttr(w.demo.account)}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              複製
            </button>
          </div>
          <div class="cred">
            <span class="cred__label">密碼</span>
            <span class="cred__value">${escapeHtml(w.demo.password)}</span>
            <button class="cred__copy" data-copy="${escapeAttr(w.demo.password)}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              複製
            </button>
          </div>
        </div>

        <a href="${escapeAttr(w.demo.url)}" target="_blank" rel="noopener" class="m__cta">
          開啟 ${escapeHtml(w.title)} · 立即測試
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

  // --- 活動 ticker（通用句型，不會對某類別不通順） ---
  function buildTicker() {
    const $track = document.getElementById('tickerTrack');
    if (!$track) return;
    const templates = [
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
    const times = [
      '剛剛', '2 分鐘前', '5 分鐘前', '8 分鐘前', '12 分鐘前', '15 分鐘前',
      '23 分鐘前', '34 分鐘前', '47 分鐘前', '1 小時前', '2 小時前',
    ];
    // 取 featured + 隨機補滿到 18 條
    const pool = [...works].sort(() => Math.random() - 0.5);
    const items = [];
    for (let i = 0; i < 18; i++) {
      const w = pool[i % pool.length];
      const t = templates[Math.floor(Math.random() * templates.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      const num = Math.floor(Math.random() * 9 + 1) * 1000 + Math.floor(Math.random() * 1000);
      const nameHtml = `<span class="ticker__item-name">${escapeHtml(w.title)}</span>`;
      items.push(
        `<div class="ticker__item"><span class="ticker__item-time">${time}</span><span class="ticker__item-icon">${t.icon}</span>${t.tpl(nameHtml, num)}</div>`,
      );
    }
    const inner = `<div class="ticker__track-inner">${items.join('')}${items.join('')}</div>`;
    $track.innerHTML = inner;
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

  // --- Scroll reveal ---
  function setupReveal() {
    const targets = document.querySelectorAll('.hero__title, .hero__lead, .hero__stats, .about__grid, .pillar');
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

  // --- Hero 標題逐字（逐 char）浮現 ---
  function setupHeroReveal() {
    const $hero = document.getElementById('hero');
    const $title = document.getElementById('heroTitle');
    if (!$hero || !$title) return;
    // 把每個 line 內的字（中文一個一個 / 英文按單字）拆成 span
    $title.querySelectorAll('.hero__line').forEach((line) => {
      const html = line.innerHTML;
      // 暫存 strike / accent 內 HTML
      // 用 placeholder 處理：先抓出特殊 span，把內容拆成 word，再放回去
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const wrap = (el) => {
        const text = el.textContent;
        el.textContent = '';
        Array.from(text).forEach((ch, i) => {
          const w = document.createElement('span');
          w.className = 'word';
          w.style.transitionDelay = `${i * 40}ms`;
          w.textContent = ch === ' ' ? ' ' : ch;
          el.appendChild(w);
        });
      };
      // 對 line 的 textNode 直接拆，對特殊 span 內部也拆
      function process(node) {
        const children = Array.from(node.childNodes);
        children.forEach((c) => {
          if (c.nodeType === Node.TEXT_NODE) {
            const text = c.textContent;
            const frag = document.createDocumentFragment();
            Array.from(text).forEach((ch) => {
              const w = document.createElement('span');
              w.className = 'word';
              w.textContent = ch === ' ' ? ' ' : ch;
              frag.appendChild(w);
            });
            c.replaceWith(frag);
          } else if (c.nodeType === Node.ELEMENT_NODE) {
            // 對有背景漸層裁切的 span（accent / strike）整塊處理，不拆字
            if (c.classList.contains('hero__accent') || c.classList.contains('hero__strike')) {
              c.classList.add('word');
            } else {
              process(c);
            }
          }
        });
      }
      process(line);
    });
    // 統一加 delay
    const allWords = $title.querySelectorAll('.word');
    allWords.forEach((w, i) => (w.style.transitionDelay = `${i * 28}ms`));
    // 觸發（用 setTimeout 確保樣式套上後再切換）
    setTimeout(() => $hero.classList.add('is-revealed'), 80);
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
    const items = [
      { num: a.totalStudents, suffix: '+', label: '結業學員' },
      { num: a.totalLiveProducts, suffix: '個', label: '上線產品' },
      { num: a.totalUsers, suffix: '+', label: '累計使用者', format: 'short' },
      { num: a.totalRevenue, suffix: '+', label: '學員作品營收', prefix: 'NT$', format: 'short' },
      { num: a.hireRate, suffix: '%', label: '結業就業率' },
      { num: a.cohorts, suffix: '期', label: '已開期數' },
    ];
    $grid.innerHTML = items
      .map((it) => {
        let num = it.num;
        if (it.format === 'short') {
          if (num >= 1000000) num = (num / 1000000).toFixed(1) + 'M';
          else if (num >= 10000) num = (num / 10000).toFixed(1) + '萬';
          else if (num >= 1000) num = (num / 1000).toFixed(1) + 'K';
        } else {
          num = num.toLocaleString();
        }
        return `<div class="ach"><span class="ach__num">${it.prefix || ''}${num}<span class="ach__suffix">${it.suffix}</span></span><span class="ach__lab">${escapeHtml(it.label)}</span></div>`;
      })
      .join('');
  }

  // ============================================================
  // Hall of Fame（橫向 scroller）
  // ============================================================
  function renderHall() {
    const $track = document.getElementById('hallTrack');
    if (!$track) return;
    const featured = works.filter((w) => w.featured);
    $track.innerHTML = featured
      .map((w, i) => {
        const [g1, g2] = w.gradient;
        const top = w.highlights ? w.highlights[0] : w.summary;
        return `<article class="hall__card" style="--g1:${g1};--g2:${g2}" data-id="${w.id}">
          <div class="hall__cover">
            <span class="hall__rank">${String(i + 1).padStart(2, '0')}</span>
            <span class="hall__icon">${w.icon}</span>
          </div>
          <div class="hall__body">
            <span class="hall__cat">${escapeHtml(w.category)}</span>
            <h3 class="hall__title">${escapeHtml(w.title)}</h3>
            <p class="hall__sub">${escapeHtml(w.subtitle)}</p>
            <p class="hall__highlight">${escapeHtml(top)}</p>
          </div>
        </article>`;
      })
      .join('');
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
    $grid.innerHTML = window.TESTIMONIALS.map((t) => {
      const initial = (t.name || '?')[0];
      return `<div class="voice">
        <span class="voice__quote-mark">"</span>
        <p class="voice__rating">${'★'.repeat(t.rating || 5)}</p>
        <p class="voice__quote">${escapeHtml(t.quote)}</p>
        <div class="voice__author">
          <span class="voice__avatar">${escapeHtml(initial)}</span>
          <div>
            <p class="voice__name">${escapeHtml(t.name)}</p>
            <p class="voice__meta">${escapeHtml(t.role)} · <span class="voice__company">${escapeHtml(t.company)}</span></p>
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
      $grid.innerHTML = window.PARTNERS.map(
        (p) =>
          `<div class="partner">
            <p class="partner__name">${escapeHtml(p.name)}</p>
            <p class="partner__tag">${escapeHtml(p.tag)}</p>
          </div>`,
      ).join('');
    }
    if ($press) {
      $press.innerHTML =
        '<p class="press__title">Press Coverage / 媒體報導</p>' +
        window.PRESS.map(
          (p) =>
            `<div class="press__item">
              <span class="press__source">${escapeHtml(p.source)}</span>
              <p class="press__headline">「${escapeHtml(p.headline)}」</p>
            </div>`,
        ).join('');
    }
  }

  // ============================================================
  // 初始渲染
  // ============================================================
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
