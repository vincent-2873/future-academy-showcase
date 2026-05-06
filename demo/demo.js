// ============================================================
//  未來學院 學員作品 Demo 通用邏輯
//  根據 ?id=NN 載入 works.js 對應作品 → 套色 → 渲染分類 dashboard
// ============================================================

(function () {
  const works = window.WORKS || [];
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '01';
  const work = works.find((w) => w.id === id) || works[0];

  if (!work) {
    document.body.innerHTML = '<p style="padding:48px;color:#fff;font-family:sans-serif">找不到 id=' + id + ' 的作品</p>';
    return;
  }

  // === 1. 套色：把 gradient 寫到 :root + 設定 favicon ===
  const [g1, g2] = work.gradient;
  document.documentElement.style.setProperty('--g1', g1);
  document.documentElement.style.setProperty('--g2', g2);
  document.title = `${work.title} · 未來學院作品 Demo`;
  // emoji favicon
  const faviconSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${work.icon}</text></svg>`;
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = faviconSvg;
  document.head.appendChild(link);

  // === 2. 填登入頁靜態欄位 ===
  document.getElementById('loginIcon').textContent = work.icon;
  document.getElementById('loginCat').textContent = work.category;
  document.getElementById('loginTitle').textContent = work.title;
  document.getElementById('loginSub').textContent = work.subtitle;
  document.getElementById('loginDesc').textContent = work.summary;
  document.getElementById('loginEmail').value = work.demo.account;
  document.getElementById('loginPass').value = work.demo.password;

  // === 3. 主介面欄位 ===
  document.getElementById('appIcon').textContent = work.icon;
  document.getElementById('appName').textContent = work.title;
  document.getElementById('appCat').textContent = work.category;
  document.getElementById('appAvatar').textContent = (work.demo.account[0] || 'G').toUpperCase();
  document.getElementById('appUser').textContent = work.demo.account.split('@')[0];
  document.getElementById('appCohort').textContent = (work.student.cohort.match(/\d+/) || ['?'])[0];
  document.getElementById('appStudent').textContent = work.student.name;

  // === 4. 顯示頁面（避免 FOUC） ===
  document.getElementById('page').hidden = false;

  // === 5. 登入流程 ===
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('login').hidden = true;
    document.getElementById('app').hidden = false;
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
    // 登入後啟動 LiveFX：浮動事件流 + 跳動數字 + 終端機 log
    setTimeout(startLiveFX, 200);
  });

  // === 6. 依 id → category → default 渲染 dashboard ===
  function renderDashboard() {
    const $main = document.getElementById('appMain');
    const idKey = LAYOUTS['__id'] && LAYOUTS['__id'][work.id];
    const layout = (idKey && LAYOUTS[idKey]) || LAYOUTS[work.category] || LAYOUTS.default;
    $main.innerHTML = layout(work);
  }

  // ============================================================
  // 各類別 dashboard 模板
  // ============================================================
  const LAYOUTS = {
    '電商': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head">
              <h3 class="panel__title"><span class="panel__title-dot"></span>銷售儀表板</h3>
              <span class="panel__sub">過去 7 天</span>
            </div>
            <div class="kpis">
              <div class="kpi"><p class="kpi__lab">營收</p><p class="kpi__val">NT$ 142K</p><p class="kpi__delta kpi__delta--up">↑ 23.4%</p></div>
              <div class="kpi"><p class="kpi__lab">訂單</p><p class="kpi__val">387</p><p class="kpi__delta kpi__delta--up">↑ 18.1%</p></div>
              <div class="kpi"><p class="kpi__lab">轉換率</p><p class="kpi__val">4.7%</p><p class="kpi__delta kpi__delta--up">↑ 0.6pt</p></div>
              <div class="kpi"><p class="kpi__lab">客單價</p><p class="kpi__val">NT$ 367</p><p class="kpi__delta kpi__delta--down">↓ 3.2%</p></div>
            </div>
            ${chartLine([20,32,28,45,38,52,68])}
          </div>

          <div class="panel">
            <div class="panel__head">
              <h3 class="panel__title">AI 商品文案 · 即時生成</h3>
              <span class="panel__action">▷ 重新生成</span>
            </div>
            <div class="gen"><span class="gen__lab"><span class="gen__dot"></span>GPT-4o · 文藝風</span>「在每一個清晨甦醒時，這只手沖咖啡壺都在等你——以濾紙的溫度，溫柔地萃取整夜安睡後的第一聲『早安』。」<span class="gen__caret"></span></div>
            <div class="gen"><span class="gen__lab"><span class="gen__dot"></span>Claude 3.5 · 活潑風</span>「咖啡控注意！這支壺把『早起喝咖啡』從義務變成療癒儀式 ☕ 一日不喝渾身難受系列。」</div>
          </div>

          <div class="panel">
            <div class="panel__head">
              <h3 class="panel__title">熱銷商品</h3>
              <span class="panel__sub">即時排名</span>
            </div>
            <div class="list">
              ${[
                ['☕', '北歐風手沖咖啡壺', '本週賣出 47 件', 'NT$ 1,280'],
                ['👕', 'Pima 棉短袖 T 恤', '本週賣出 38 件', 'NT$ 690'],
                ['🎧', '無線降噪藍牙耳機', '本週賣出 29 件', 'NT$ 4,990'],
                ['🪴', '玻璃水耕植物瓶', '本週賣出 22 件', 'NT$ 480'],
              ].map(([i, t, m, v]) => `<div class="row"><span class="row__icon">${i}</span><div class="row__main"><div class="row__title">${t}</div><div class="row__meta">${m}</div></div><span class="row__val">${v}</span></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">AI 推薦引擎</h3>
            <p class="panel__sub" style="margin-bottom:14px">根據過去 90 天行為，本週推薦給高消費客群</p>
            <div class="list">
              ${[
                ['🏷️', '智能個人化包', '匹配度 94%', 'TOP'],
                ['🎁', '節日禮盒組', '匹配度 87%', '新'],
                ['🔥', '限量聯名款', '匹配度 81%', '熱'],
              ].map(([i,t,m,tg]) => `<div class="row"><span class="row__icon">${i}</span><div class="row__main"><div class="row__title">${t}</div><div class="row__meta">${m}</div></div><span class="row__tag">${tg}</span></div>`).join('')}
            </div>
          </div>

          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">庫存預警</h3>
            <div class="list">
              <div class="row"><span class="row__icon">⚠️</span><div class="row__main"><div class="row__title">手沖咖啡壺</div><div class="row__meta">剩 8 件 · 預測 2 天售罄</div></div><span class="row__tag row__tag--err">急</span></div>
              <div class="row"><span class="row__icon">📦</span><div class="row__main"><div class="row__title">玻璃水耕瓶</div><div class="row__meta">剩 23 件 · 預測 6 天</div></div><span class="row__tag row__tag--warn">補貨建議</span></div>
            </div>
          </div>

          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">系統狀態</h3>
            <div style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);font-family:var(--font-sans)">
              <div style="display:flex;justify-content:space-between"><span>API 延遲</span><span style="color:var(--accent)">42 ms</span></div>
              <div style="display:flex;justify-content:space-between"><span>支付系統</span><span style="color:var(--accent)">● 正常</span></div>
              <div style="display:flex;justify-content:space-between"><span>AI 模型</span><span style="color:var(--accent)">GPT-4o</span></div>
              <div style="display:flex;justify-content:space-between"><span>本月訂閱費</span><span>NT$ 12,400</span></div>
            </div>
          </div>
        </div>
      </div>
    `,

    '餐飲': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>即時桌況</h3><span class="panel__sub">${new Date().toLocaleString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</span></div>
            <div class="tile-grid">
              ${['T01','T02','T03','T04','T05','T06','T07','T08'].map((tn,i)=>{
                const states=[['用餐中','#FB7185','42m'],['可入座','#6BFF8E','空'],['預訂','#FBBF24','19:30'],['結帳','#5B8DEF','-']];
                const s=states[i%4];
                return `<div class="tile" style="border-color:${s[1]}40"><div class="tile__head"><span class="tile__icon">${tn}</span><span class="tile__num" style="color:${s[1]};font-size:14px">${s[0]}</span></div><div class="tile__val">${s[2]}</div></div>`;
              }).join('')}
            </div>
            <p style="font-size:12px;color:var(--text-tertiary);margin-top:14px;font-family:var(--font-sans)">AI 預測 19:00–20:00 滿桌機率 87%，建議提前準備備餐</p>
          </div>

          <div class="panel">
            <div class="panel__head"><h3 class="panel__title">今日訂單</h3><span class="panel__sub">已完成 24 筆</span></div>
            <div class="list">
              ${[
                ['🍜', '牛肉拉麵 ×1, 餃子 ×8', 'T03 · 19:42', 'NT$ 460'],
                ['🍱', '商業午餐 ×2', 'T07 · 19:38', 'NT$ 580'],
                ['🍝', '青醬義大利麵 ×1, 沙拉 ×1', 'T01 · 19:35', 'NT$ 420'],
                ['🍣', '生魚片定食 ×3', 'T05 · 19:28', 'NT$ 1,440'],
              ].map(([i,t,m,v])=>`<div class="row"><span class="row__icon">${i}</span><div class="row__main"><div class="row__title">${t}</div><div class="row__meta">${m}</div></div><span class="row__val">${v}</span></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">線上訂位</h3>
            <div class="list">
              <div class="row"><span class="row__icon">👤</span><div class="row__main"><div class="row__title">王小姐 · 4 位</div><div class="row__meta">19:30 · 已確認</div></div><span class="row__tag">VIP</span></div>
              <div class="row"><span class="row__icon">👥</span><div class="row__main"><div class="row__title">陳先生 · 6 位</div><div class="row__meta">20:00 · 已確認</div></div><span class="row__tag">慶生</span></div>
              <div class="row"><span class="row__icon">👤</span><div class="row__main"><div class="row__title">林同學 · 2 位</div><div class="row__meta">20:30 · 候位中</div></div><span class="row__tag row__tag--warn">候位</span></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">本日 KPI</h3>
            <div class="kpis" style="grid-template-columns:repeat(2,1fr)">
              <div class="kpi"><p class="kpi__lab">翻桌率</p><p class="kpi__val">3.4×</p><p class="kpi__delta kpi__delta--up">↑ 0.3</p></div>
              <div class="kpi"><p class="kpi__lab">客單價</p><p class="kpi__val">NT$ 528</p><p class="kpi__delta kpi__delta--up">↑ 7%</p></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">廚房監控</h3>
            <div style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);font-family:var(--font-sans)">
              <div style="display:flex;justify-content:space-between"><span>油鍋溫度</span><span style="color:var(--accent)">182°C ✓</span></div>
              <div style="display:flex;justify-content:space-between"><span>冷藏庫</span><span style="color:var(--accent)">3.2°C ✓</span></div>
              <div style="display:flex;justify-content:space-between"><span>冷凍庫</span><span style="color:var(--accent)">-18°C ✓</span></div>
              <div style="display:flex;justify-content:space-between"><span>食材損耗</span><span>2.3%</span></div>
            </div>
          </div>
        </div>
      </div>
    `,

    '影音': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>影片產出隊列</h3><span class="panel__sub">3 個 進行中</span></div>
            <div class="list">
              <div class="row"><span class="row__icon">🎬</span><div class="row__main"><div class="row__title">夏季新品快閃 · 9:16</div><div class="row__meta">渲染中 · 預計 1m 23s 後完成</div><div class="bar" style="margin-top:8px"><div class="bar__fill" style="width:67%"></div></div></div></div>
              <div class="row"><span class="row__icon">🎬</span><div class="row__main"><div class="row__title">教學短片 EP.12 · 16:9</div><div class="row__meta">AI 數位人配音中 · 32%</div><div class="bar" style="margin-top:8px"><div class="bar__fill" style="width:32%"></div></div></div></div>
              <div class="row"><span class="row__icon">🎬</span><div class="row__main"><div class="row__title">品牌故事 30 秒 · 1:1</div><div class="row__meta">字幕生成中 · 88%</div><div class="bar" style="margin-top:8px"><div class="bar__fill" style="width:88%"></div></div></div></div>
            </div>
          </div>

          <div class="panel">
            <div class="panel__head"><h3 class="panel__title">AI 數位人主播</h3><span class="panel__action">＋ 上傳新肖像</span></div>
            <div class="tile-grid">
              ${[['👩‍💼','Sara','商務 / 主播風'],['👨','Leo','教學 / 沉穩風'],['👧','Mira','童趣 / 親子風']].map(([i,n,t])=>`<div class="tile"><div class="tile__head"><span class="tile__icon">${i}</span><span style="font-size:11px;color:var(--accent);font-family:var(--font-sans)">已訓練</span></div><div class="tile__val">${n}</div><div class="tile__lab">${t}</div></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">本月產出</h3>
            <div class="kpis" style="grid-template-columns:repeat(2,1fr)">
              <div class="kpi"><p class="kpi__lab">影片數</p><p class="kpi__val">142</p><p class="kpi__delta kpi__delta--up">↑ 47×</p></div>
              <div class="kpi"><p class="kpi__lab">總時長</p><p class="kpi__val">7.8 hr</p><p class="kpi__delta kpi__delta--up">↑ 38%</p></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">AI 配音音色</h3>
            <div class="list">
              <div class="row"><span class="row__icon">🎙️</span><div class="row__main"><div class="row__title">繁中 · 親切女聲</div><div class="row__meta">本月使用 28 次</div></div></div>
              <div class="row"><span class="row__icon">🎙️</span><div class="row__main"><div class="row__title">繁中 · 沉穩男聲</div><div class="row__meta">本月使用 19 次</div></div></div>
              <div class="row"><span class="row__icon">🎙️</span><div class="row__main"><div class="row__title">台語 · 大叔風</div><div class="row__meta">本月使用 12 次</div></div></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">系統</h3>
            <div style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);font-family:var(--font-sans)">
              <div style="display:flex;justify-content:space-between"><span>渲染節點</span><span style="color:var(--accent)">8/10</span></div>
              <div style="display:flex;justify-content:space-between"><span>音樂庫</span><span>2,400+</span></div>
              <div style="display:flex;justify-content:space-between"><span>素材庫</span><span>15,800+</span></div>
            </div>
          </div>
        </div>
      </div>
    `,

    '社群': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>附近正在發生</h3><span class="panel__sub">3 公里內 · 即時</span></div>
            <div class="list">
              <div class="row"><span class="row__icon">🎸</span><div class="row__main"><div class="row__title">公館河岸留言 · 地下樂團之夜</div><div class="row__meta">8 人正在 · 還有 12 個位 · 距離 1.2 km</div></div><span class="row__tag">熱</span></div>
              <div class="row"><span class="row__icon">🥾</span><div class="row__main"><div class="row__title">象山夜爬看夜景</div><div class="row__meta">5 人正在揪 · 20:00 集合 · 距離 2.4 km</div></div><span class="row__tag">中</span></div>
              <div class="row"><span class="row__icon">🍻</span><div class="row__main"><div class="row__title">永康街桌遊狼人殺</div><div class="row__meta">4 人正在 · 還有 6 個位 · 距離 0.8 km</div></div><span class="row__tag">微辣</span></div>
              <div class="row"><span class="row__icon">🏃</span><div class="row__main"><div class="row__title">大安森林公園晨跑團</div><div class="row__meta">明早 6:30 · 已 12 人報名</div></div><span class="row__tag">健康</span></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel__head"><h3 class="panel__title">朋友圈動態</h3></div>
            <div class="msg"><span class="msg__avatar">A</span><div class="msg__bubble"><b>Aria</b> 剛從「永康街桌遊」回來，下次一定要再去 🃏</div></div>
            <div class="msg"><span class="msg__avatar">J</span><div class="msg__bubble"><b>Jay</b> 推薦明晚的爵士酒吧，活動還有 6 個名額！</div></div>
            <div class="msg"><span class="msg__avatar">M</span><div class="msg__bubble"><b>Mia</b> 收藏了「象山夜爬」</div></div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">我的活動</h3>
            <div class="kpis" style="grid-template-columns:repeat(2,1fr)">
              <div class="kpi"><p class="kpi__lab">本月參加</p><p class="kpi__val">7</p><p class="kpi__delta kpi__delta--up">↑ 3</p></div>
              <div class="kpi"><p class="kpi__lab">主辦</p><p class="kpi__val">2</p><p class="kpi__delta kpi__delta--up">↑ 1</p></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">推薦給你</h3>
            <p class="panel__sub" style="margin-bottom:10px">基於你過去喜歡的活動類型</p>
            <div class="tags">
              ${['爵士樂','戶外','桌遊','美食','藝文展','咖啡廳','寵物友善','深度旅遊'].map(t=>`<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">信任分數</h3>
            <p style="font-family:'Space Grotesk';font-size:42px;font-weight:800;margin:0;line-height:1">4.8 <span style="font-size:18px;color:var(--accent)">/ 5.0</span></p>
            <p style="font-size:12px;color:var(--text-tertiary);margin:6px 0 0">基於 23 場活動參與評價</p>
          </div>
        </div>
      </div>
    `,

    'AI 應用': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>對話 · 實時</h3><span class="panel__sub">客戶 · ID #92187</span></div>
            <div class="msg"><span class="msg__avatar">客</span><div class="msg__bubble">我上週訂的商品還沒到，可以幫我查一下嗎</div></div>
            <div class="msg"><span class="msg__avatar msg__avatar--ai">AI</span><div class="msg__bubble msg__bubble--ai">您好！馬上幫您查詢，請稍候 ✨ 已找到您的訂單 <b>#FA-2025-0814</b>，目前狀態：「分撿中（高雄物流站）」，預計明天送達。已通知物流加急，並補寄一張優惠券到您信箱作為延遲補償 🎁</div></div>
            <div class="msg"><span class="msg__avatar">客</span><div class="msg__bubble">太好了 謝謝你 反應好快</div></div>
            <div class="msg"><span class="msg__avatar msg__avatar--ai">AI</span><div class="msg__bubble msg__bubble--ai">不客氣！還有什麼可以為您服務的嗎？<span class="gen__caret"></span></div></div>
          </div>

          <div class="panel">
            <div class="panel__head"><h3 class="panel__title">即時情緒監控</h3><span class="panel__sub">本日 247 則對話</span></div>
            <div class="kpis">
              <div class="kpi"><p class="kpi__lab">滿意</p><p class="kpi__val" style="color:#6BFF8E">82%</p></div>
              <div class="kpi"><p class="kpi__lab">中立</p><p class="kpi__val">12%</p></div>
              <div class="kpi"><p class="kpi__lab">沮喪</p><p class="kpi__val" style="color:#FBBF24">5%</p></div>
              <div class="kpi"><p class="kpi__lab">憤怒</p><p class="kpi__val" style="color:#FB7185">1%</p></div>
            </div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">Agent 狀態</h3>
            <div class="list">
              <div class="row"><span class="row__icon">🤖</span><div class="row__main"><div class="row__title">研究員 Agent</div><div class="row__meta">處理中 · 第 3 步 / 5</div></div><span class="row__tag">忙</span></div>
              <div class="row"><span class="row__icon">✍️</span><div class="row__main"><div class="row__title">寫手 Agent</div><div class="row__meta">待命</div></div><span class="row__tag">閒</span></div>
              <div class="row"><span class="row__icon">🔍</span><div class="row__main"><div class="row__title">校對 Agent</div><div class="row__meta">處理中 · 第 1 步 / 2</div></div><span class="row__tag">忙</span></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">本日成本</h3>
            <p style="font-family:'Space Grotesk';font-size:32px;font-weight:800;margin:0;line-height:1">$ 12.47 <span style="font-size:14px;color:var(--text-tertiary)">USD</span></p>
            <p style="font-size:12px;color:var(--text-tertiary);margin:6px 0 0">使用 247K tokens · 預算還剩 $87.53</p>
            <div class="bar" style="margin-top:10px"><div class="bar__fill" style="width:12%"></div></div>
          </div>
        </div>
      </div>
    `,

    '個人財務': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>本月概況</h3><span class="panel__sub">2025 年 11 月</span></div>
            <div class="kpis">
              <div class="kpi"><p class="kpi__lab">收入</p><p class="kpi__val">NT$ 78K</p></div>
              <div class="kpi"><p class="kpi__lab">支出</p><p class="kpi__val">NT$ 42K</p><p class="kpi__delta kpi__delta--down">↓ 8%</p></div>
              <div class="kpi"><p class="kpi__lab">儲蓄率</p><p class="kpi__val" style="color:var(--accent)">46%</p></div>
              <div class="kpi"><p class="kpi__lab">緊急金</p><p class="kpi__val">5.2 月</p></div>
            </div>
            ${chartLine([42,38,45,52,48,55,46])}
          </div>
          <div class="panel">
            <div class="panel__head"><h3 class="panel__title">最近交易</h3><span class="panel__action">＋ 新增</span></div>
            <div class="list">
              ${[
                ['🛒','全聯實業 · 民生用品','11/14 · 已自動分類','-NT$ 1,247'],
                ['🍱','便當店 · 午餐','11/14 · 飲食','-NT$ 120'],
                ['💰','薪資轉帳','11/13 · 收入','+NT$ 78,000'],
                ['🎬','Netflix · 訂閱','11/12 · 娛樂訂閱','-NT$ 390'],
                ['☕','星巴克','11/12 · 飲食','-NT$ 145'],
              ].map(([i,t,m,v])=>`<div class="row"><span class="row__icon">${i}</span><div class="row__main"><div class="row__title">${t}</div><div class="row__meta">${m}</div></div><span class="row__val" style="color:${v.startsWith('+')?'var(--accent)':'var(--text-secondary)'}">${v}</span></div>`).join('')}
            </div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">⚡ AI 找回的支出</h3>
            <p style="font-family:'Space Grotesk';font-size:28px;font-weight:800;margin:0">NT$ 3,420</p>
            <p style="font-size:12px;color:var(--text-tertiary);margin:6px 0 12px">本月發現 4 筆忘記取消的訂閱</p>
            <div class="list">
              <div class="row"><span class="row__icon">📺</span><div class="row__main"><div class="row__title">某串流服務</div><div class="row__meta">已 90 天未使用</div></div><span class="row__tag row__tag--warn">建議取消</span></div>
              <div class="row"><span class="row__icon">📱</span><div class="row__main"><div class="row__title">某 App 訂閱</div><div class="row__meta">已 60 天未使用</div></div><span class="row__tag row__tag--warn">建議取消</span></div>
            </div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">財務目標</h3>
            <div style="margin-bottom:14px"><p style="font-size:13px;font-weight:600;margin:0 0 6px">買房頭期款</p><div class="bar"><div class="bar__fill" style="width:42%"></div></div><p style="font-size:11.5px;color:var(--text-tertiary);margin:6px 0 0">NT$ 420K / 1M · 預計 18 個月達成</p></div>
            <div><p style="font-size:13px;font-weight:600;margin:0 0 6px">日本旅遊</p><div class="bar"><div class="bar__fill" style="width:78%"></div></div><p style="font-size:11.5px;color:var(--text-tertiary);margin:6px 0 0">NT$ 78K / 100K · 預計 2 個月達成</p></div>
          </div>
        </div>
      </div>
    `,

    '健康': (w) => `
      <div class="dash">
        <div class="dash__col">
          <div class="panel panel--hero">
            <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>今日健康總覽</h3><span class="panel__sub">11/14 · 週四</span></div>
            <div class="kpis">
              <div class="kpi"><p class="kpi__lab">步數</p><p class="kpi__val">8,421</p><p class="kpi__delta kpi__delta--up">達 84%</p></div>
              <div class="kpi"><p class="kpi__lab">熱量</p><p class="kpi__val">1,847</p><p class="kpi__delta kpi__delta--up">↓ 攝取</p></div>
              <div class="kpi"><p class="kpi__lab">睡眠</p><p class="kpi__val">7h 22m</p><p class="kpi__delta kpi__delta--up">品質 89</p></div>
              <div class="kpi"><p class="kpi__lab">心率</p><p class="kpi__val">68 bpm</p><p class="kpi__delta kpi__delta--up">穩定</p></div>
            </div>
            ${chartLine([72,75,80,78,68,71,68])}
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">📷 今日飲食 (AI 拍照辨識)</h3>
            <div class="list">
              <div class="row"><span class="row__icon">🥗</span><div class="row__main"><div class="row__title">凱薩雞肉沙拉</div><div class="row__meta">早餐 · 蛋白質 28g · 脂肪 12g</div></div><span class="row__val">412 kcal</span></div>
              <div class="row"><span class="row__icon">🍱</span><div class="row__main"><div class="row__title">日式照燒雞便當</div><div class="row__meta">午餐 · 蛋白質 35g · 碳水 76g</div></div><span class="row__val">678 kcal</span></div>
              <div class="row"><span class="row__icon">🍎</span><div class="row__main"><div class="row__title">蘋果一顆</div><div class="row__meta">下午茶</div></div><span class="row__val">95 kcal</span></div>
            </div>
          </div>
        </div>
        <div class="dash__col">
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">🤖 AI 健康教練</h3>
            <div class="msg"><span class="msg__avatar msg__avatar--ai">AI</span><div class="msg__bubble msg__bubble--ai">本週你有 4 天達到運動目標 👏 但深度睡眠下降 12%，建議今晚 10:30 前就寢，並避免咖啡因攝取（你今天還有一杯拿鐵）</div></div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">本月減重進度</h3>
            <p style="font-family:'Space Grotesk';font-size:32px;font-weight:800;margin:0">−2.4 kg</p>
            <p style="font-size:12px;color:var(--text-tertiary);margin:6px 0 12px">目標 5 kg · 還剩 2.6 kg · 預計 5 週達成</p>
            <div class="bar"><div class="bar__fill" style="width:48%"></div></div>
          </div>
          <div class="panel">
            <h3 class="panel__title" style="margin-bottom:12px">穿戴裝置</h3>
            <div style="font-size:12.5px;line-height:1.9;color:var(--text-secondary);font-family:var(--font-sans)">
              <div style="display:flex;justify-content:space-between"><span>Apple Watch</span><span style="color:var(--accent)">同步中</span></div>
              <div style="display:flex;justify-content:space-between"><span>HealthKit</span><span style="color:var(--accent)">已連結</span></div>
              <div style="display:flex;justify-content:space-between"><span>體脂秤</span><span>3 天前</span></div>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  // === 06 Forge Studio：Kanban 內容工作流 ===
  LAYOUTS['__06'] = (w) => `
    <div class="kanban">
      ${[
        ['草稿', 'rgba(251,191,36,0.15)', '#FBBF24', [
          ['「2025 行銷趨勢」深度文章', '研究員 Agent · 蒐集中 · 12 篇參考'],
          ['週四 IG 貼文 · 新品開箱', '寫手 Agent · 第 2 稿'],
          ['Newsletter EP.42', '編輯 Agent · 校對中'],
        ]],
        ['審核中', 'rgba(192,110,255,0.15)', '#C06EFF', [
          ['LinkedIn 長文 · CEO 觀點', '主管批次 · 等回覆'],
          ['電子報 · 黑五專題', 'SEO 優化建議 3 項'],
        ]],
        ['已發佈', 'rgba(107,255,142,0.15)', '#6BFF8E', [
          ['IG 短影片 · 新品速報', '昨天 14:32 · 觸及 12.4K'],
          ['部落格 · 5 個 AI 工具評比', '前天 · 流量 +312%'],
          ['Threads · 行銷小撇步', '前天 · 互動 1,840'],
          ['FB 貼文 · 客戶見證', '3 天前 · 留言 86'],
        ]],
      ].map(([title, bg, color, items]) => `
        <div class="kanban__col">
          <div class="kanban__head" style="background:${bg};border-color:${color}40">
            <span style="color:${color};font-weight:700">${title}</span>
            <span style="color:${color};opacity:0.6;font-size:11px;font-family:var(--font-sans)">${items.length}</span>
          </div>
          <div class="kanban__list">
            ${items.map(([t, m]) => `<div class="kanban__card"><div class="kanban__card-title">${t}</div><div class="kanban__card-meta">${m}</div></div>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="panel" style="margin-top:20px">
      <div class="panel__head"><h3 class="panel__title">本月 Agent 工時 (token 消耗)</h3></div>
      ${chartLine([2400, 3100, 2800, 4200, 3900, 5100, 4800])}
    </div>
  `;

  // === 07 Ensemble：Agent 網路圖 ===
  LAYOUTS['__07'] = (w) => `
    <div class="panel panel--hero" style="position:relative">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>多 Agent 協作中</h3><span class="panel__sub">任務 #A-2025-1142</span></div>
      <p style="color:var(--text-secondary);margin:0 0 20px;font-size:14px">目標：撰寫一份「2025 AI 趨勢」深度報告</p>
      <div class="agent-graph">
        <svg viewBox="0 0 600 320" style="width:100%;height:320px">
          <defs><filter id="glow"><feGaussianBlur stdDeviation="2"/></filter></defs>
          ${/* lines */ ''}
          <line x1="300" y1="160" x2="100" y2="80" stroke="var(--accent)" stroke-width="1.5" opacity="0.4" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line>
          <line x1="300" y1="160" x2="500" y2="80" stroke="var(--accent)" stroke-width="1.5" opacity="0.4" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line>
          <line x1="300" y1="160" x2="100" y2="240" stroke="var(--accent)" stroke-width="1.5" opacity="0.4" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line>
          <line x1="300" y1="160" x2="500" y2="240" stroke="var(--accent)" stroke-width="1.5" opacity="0.4" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></line>
          ${/* center decider node */ ''}
          <circle cx="300" cy="160" r="36" fill="rgba(107,255,142,0.15)" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="300" cy="160" r="36" fill="none" stroke="var(--accent)" stroke-width="2"><animate attributeName="r" from="36" to="56" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/></circle>
          <text x="300" y="166" text-anchor="middle" fill="var(--accent)" font-size="18" font-weight="700" font-family="Space Grotesk">決策者</text>
          ${/* satellites */ ''}
          ${[
            [100, 80, '研究員', '蒐集中', '#FBBF24'],
            [500, 80, '寫手', '第 2 稿', '#5B8DEF'],
            [100, 240, '批評家', '挑刺中', '#FB7185'],
            [500, 240, '校對', '待命', '#94A3B8'],
          ].map(([x, y, name, status, color]) => `
            <circle cx="${x}" cy="${y}" r="26" fill="${color}22" stroke="${color}" stroke-width="2"/>
            <text x="${x}" y="${y - 2}" text-anchor="middle" fill="${color}" font-size="12" font-weight="700">${name}</text>
            <text x="${x}" y="${y + 14}" text-anchor="middle" fill="${color}" font-size="10" opacity="0.7" font-family="Space Grotesk">${status}</text>
          `).join('')}
        </svg>
      </div>
    </div>
    <div class="dash" style="margin-top:20px">
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">推理思維樹</h3>
          <div style="font-family:var(--font-mono);font-size:12.5px;line-height:1.9;color:var(--text-secondary)">
            <div>├─ <span style="color:var(--accent)">[研究員]</span> 已蒐集 12 篇參考資料</div>
            <div>│  ├─ MIT TR · 2025 AI 報告</div>
            <div>│  ├─ Anthropic constitutional AI</div>
            <div>│  └─ ... +10 more</div>
            <div>├─ <span style="color:var(--accent)">[寫手]</span> 大綱完成 · 撰寫第 2 稿中</div>
            <div>├─ <span style="color:#FB7185">[批評家]</span> 提出 3 個邏輯問題</div>
            <div>└─ <span style="color:#94A3B8">[校對]</span> 待寫手完成</div>
          </div>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">本任務成本</h3>
          <p style="font-family:'Space Grotesk';font-size:32px;font-weight:800;margin:0">$ 2.34</p>
          <p style="font-size:12px;color:var(--text-tertiary);margin:6px 0 12px">52K tokens · 預算 $10</p>
          <div class="bar"><div class="bar__fill" style="width:23%"></div></div>
        </div>
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">使用模型</h3>
          <div class="tags">
            <span class="tag" style="border-color:rgba(192,110,255,0.3);color:#D4A5FF">Claude 3.5</span>
            <span class="tag" style="border-color:rgba(192,110,255,0.3);color:#D4A5FF">GPT-4o</span>
            <span class="tag" style="border-color:rgba(192,110,255,0.3);color:#D4A5FF">Perplexity</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // === 09 Pulse：問卷編輯器 + 即時統計 ===
  LAYOUTS['__09'] = (w) => `
    <div class="three-col">
      <div class="panel" style="height:fit-content">
        <h3 class="panel__title" style="margin-bottom:14px">題目列表</h3>
        <div class="list">
          ${['Q1 · 您的年齡', 'Q2 · 您最常用的 AI 工具', 'Q3 · 滿意度評分', 'Q4 · 開放題：建議'].map((q,i) => `<div class="row" style="padding:8px 10px"><span style="font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)">${String(i+1).padStart(2,'0')}</span><div class="row__main"><div class="row__title" style="font-size:12.5px">${q}</div></div></div>`).join('')}
          <div class="row" style="padding:8px 10px;border:1px dashed var(--border-mid);background:transparent;color:var(--text-tertiary)"><div class="row__main"><div class="row__title" style="font-size:12.5px">＋ 新增題目</div></div></div>
        </div>
      </div>
      <div class="panel">
        <span class="panel__sub" style="margin-bottom:8px;display:block">第 2 題（單選）</span>
        <h3 style="font-size:18px;margin:0 0 16px">您最常用的 AI 工具是？</h3>
        ${['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'DeepSeek', '其他'].map((opt, i) => `<label class="opt"><span class="opt__box${i===1?' opt__box--checked':''}"></span><span>${opt}</span></label>`).join('')}
        <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--border-soft);font-size:12px;color:var(--text-tertiary);display:flex;justify-content:space-between"><span>邏輯：選 Claude → 跳第 4 題</span><span>已答 1,847 / 2,000</span></div>
      </div>
      <div class="panel">
        <h3 class="panel__title" style="margin-bottom:14px">即時答題分布</h3>
        ${[['ChatGPT', 42, '#6BFF8E'], ['Claude', 28, '#5B8DEF'], ['Gemini', 12, '#C06EFF'], ['Perplexity', 8, '#FBBF24'], ['DeepSeek', 6, '#FB7185'], ['其他', 4, '#94A3B8']].map(([n, p, c]) => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span>${n}</span><span style="color:${c};font-weight:700;font-family:var(--font-mono)">${p}%</span></div>
            <div class="bar"><div class="bar__fill" style="width:${p*2}%;background:${c}"></div></div>
          </div>
        `).join('')}
        <p style="font-size:11px;color:var(--text-tertiary);margin:14px 0 0;font-family:var(--font-sans)">AI 已自動跑卡方檢定，差異具統計顯著性 (p &lt; 0.001)</p>
      </div>
    </div>
  `;

  // === 12 Codex：書籍牆 ===
  LAYOUTS['__12'] = (w) => `
    <div class="panel panel--hero" style="margin-bottom:20px">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>我的書牆</h3><span class="panel__sub">42 本 · 本年讀完 18 本</span></div>
      <div class="book-wall">
        ${[
          ['人類大歷史', '尤瓦爾·哈拉瑞', '#8B5CF6'],
          ['原子習慣', 'James Clear', '#F97316'],
          ['深度工作力', 'Cal Newport', '#0EA5E9'],
          ['底層邏輯', '劉潤', '#EF4444'],
          ['思考的藝術', '魯爾夫', '#22C55E'],
          ['黑天鵝效應', 'N. Taleb', '#6366F1'],
          ['一人公司', 'Paul Jarvis', '#EC4899'],
          ['複利效應', 'Darren Hardy', '#F59E0B'],
          ['做你自己', '林志炫', '#06B6D4'],
          ['投資最重要的事', 'Howard Marks', '#84CC16'],
          ['第二座山', 'David Brooks', '#A855F7'],
          ['鋼鐵人馬斯克', '艾西莫夫', '#10B981'],
        ].map(([title, author, color], i) => `
          <div class="book" style="--book-color:${color};animation-delay:${i*60}ms">
            <div class="book__spine"></div>
            <div class="book__cover">
              <div class="book__title">${title}</div>
              <div class="book__author">${author}</div>
            </div>
            <div class="book__progress"><div class="book__progress-fill" style="width:${[100, 100, 88, 100, 64, 100, 42, 100, 12, 100, 78, 100][i]}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="dash">
      <div class="dash__col">
        <div class="panel">
          <h3 class="panel__title" style="margin-bottom:12px">📖 正在讀 · 一人公司</h3>
          <div class="gen"><span class="gen__lab"><span class="gen__dot"></span>AI 萃取金句卡</span>「真正的成功不是規模，而是不需要擴張就能持續滿足你的人生。」</div>
          <p style="color:var(--text-secondary);font-size:13px;line-height:1.7;margin:0">已讀 42% · 預計 8 天讀完 · 根據你的閱讀速度自動推薦下一本：《Range：通才致勝》</p>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">本月閱讀</h3>
          <div class="kpis" style="grid-template-columns:repeat(2,1fr)">
            <div class="kpi"><p class="kpi__lab">時數</p><p class="kpi__val">14.6 hr</p><p class="kpi__delta kpi__delta--up">↑ 22%</p></div>
            <div class="kpi"><p class="kpi__lab">完成</p><p class="kpi__val">3 本</p><p class="kpi__delta kpi__delta--up">↑ 1</p></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // === 13 Wanderlust：地圖式行程 ===
  LAYOUTS['__13'] = (w) => `
    <div class="panel panel--hero">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>東京 7 日行程</h3><span class="panel__sub">2025/12/20 出發 · 預算 NT$ 60K</span></div>
      <div class="map">
        <div class="map__bg"></div>
        ${[
          [12, 28, '成田機場', 'Day 1'],
          [38, 22, '淺草', 'Day 1'],
          [45, 38, '新宿', 'Day 2'],
          [52, 30, '原宿', 'Day 3'],
          [62, 48, '台場', 'Day 4'],
          [78, 36, '築地', 'Day 5'],
          [88, 58, '迪士尼', 'Day 6'],
          [55, 70, '羽田機場', 'Day 7'],
        ].map(([x, y, name, day], i) => `
          <div class="map__pin" style="left:${x}%;top:${y}%;animation-delay:${i*150}ms">
            <span class="map__pin-dot"></span>
            <span class="map__pin-label"><b>${name}</b><br/>${day}</span>
          </div>
        `).join('')}
        <svg class="map__line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 12 28 L 38 22 L 45 38 L 52 30 L 62 48 L 78 36 L 88 58 L 55 70" fill="none" stroke="var(--accent)" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.5"/>
        </svg>
      </div>
    </div>
    <div class="panel" style="margin-top:20px">
      <h3 class="panel__title" style="margin-bottom:14px">逐日行程</h3>
      <div class="timeline">
        ${[
          ['Day 1', '成田 → 淺草雷門 → 隅田川夜景', '宿：淺草 APA'],
          ['Day 2', '新宿御苑 → 歌舞伎町 → 機器人秀', '宿：新宿 Granbell'],
          ['Day 3', '原宿竹下通 → 表參道 → 明治神宮', '宿：澀谷 Tokyu'],
          ['Day 4', '台場海濱 → teamLab Borderless', '宿：台場日航'],
          ['Day 5', '築地早市 → 銀座血拚 → 上野動物園', '宿：上野東急'],
          ['Day 6', '東京迪士尼樂園一日', '宿：迪士尼 Mira Costa'],
          ['Day 7', '皇居外苑 → 羽田機場', '回國'],
        ].map(([day, route, hotel]) => `<div class="tl-row"><span class="tl-dot"></span><div class="tl-body"><div class="tl-day">${day}</div><div class="tl-route">${route}</div><div class="tl-hotel">${hotel}</div></div></div>`).join('')}
      </div>
    </div>
  `;

  // === 14 Resume Lab：履歷編輯器 + 即時預覽 ===
  LAYOUTS['__14'] = (w) => `
    <div class="resume-grid">
      <div class="panel">
        <h3 class="panel__title" style="margin-bottom:14px">編輯履歷</h3>
        <div class="login__field"><label>姓名</label><input type="text" value="王小明" /></div>
        <div class="login__field"><label>應徵職位</label><input type="text" value="Senior Frontend Engineer" /></div>
        <div class="login__field"><label>關鍵成就（AI 已優化）</label><textarea style="width:100%;min-height:80px;padding:10px 12px;background:var(--bg-elev-2);border:1px solid var(--border-soft);border-radius:var(--radius-md);color:var(--text-primary);font-family:inherit;font-size:13px;resize:vertical">主導重構電商前端，將首屏載入時間從 4.2s 降至 1.1s，轉換率提升 23%</textarea></div>
        <div class="notice" style="margin-top:14px"><span class="notice__icon">✨</span><span>AI 偵測到「<u>負責</u>」可改為「<u>主導</u>」更具行動力</span></div>
        <button class="login__btn" style="margin-top:14px">套用優化建議</button>
      </div>
      <div class="resume-preview">
        <div class="resume-preview__page">
          <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #000">
            <h2 style="font-size:24px;margin:0;color:#000">王小明</h2>
            <p style="margin:4px 0 0;font-size:11px;color:#666">Senior Frontend Engineer · Taipei</p>
            <p style="margin:2px 0 0;font-size:10px;color:#666">ming@example.com · linkedin/in/wangxm</p>
          </div>
          <h3 style="color:#000;font-size:13px;margin:14px 0 6px;letter-spacing:0.04em">EXPERIENCE</h3>
          <div style="font-size:10px;color:#333;line-height:1.55">
            <p style="margin:0;font-weight:700">Lead Frontend · Acme Corp</p>
            <p style="margin:1px 0 4px;color:#666">2022 – Present</p>
            <ul style="margin:0;padding-left:14px"><li>主導重構電商前端，首屏載入 4.2s → 1.1s，轉換率 +23%</li><li>建立 Design System 涵蓋 80+ 元件，跨 5 個產品線重用</li></ul>
          </div>
          <h3 style="color:#000;font-size:13px;margin:14px 0 6px;letter-spacing:0.04em">SKILLS</h3>
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            ${['React', 'TypeScript', 'Next.js', 'Tailwind', 'GraphQL', 'Web Performance', 'A11y'].map(s => `<span style="font-size:10px;padding:2px 8px;border:1px solid #000;border-radius:4px;color:#000">${s}</span>`).join('')}
          </div>
        </div>
        <div class="resume-preview__meta">
          <span style="color:var(--accent)">●</span> 即時預覽 · ATS 評分 92/100 · 與職缺匹配 87%
        </div>
      </div>
    </div>
  `;

  // === 15 Mood Atlas：Pinterest 瀑布流 ===
  LAYOUTS['__15'] = (w) => `
    <div class="panel" style="margin-bottom:20px">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>「賽博龐克咖啡廳」靈感板</h3><span class="panel__sub">本週新增 24 張</span></div>
      <div class="masonry">
        ${[
          ['#0ea5e9', 200, '霓虹標誌'],
          ['#6366f1', 280, '工業風格座位'],
          ['#ec4899', 240, '粉紫漸層'],
          ['#f59e0b', 220, '橘黃色光暈'],
          ['#10b981', 300, '植物垂吊'],
          ['#8b5cf6', 180, '深紫吧台'],
          ['#ef4444', 260, '紅光吧檯'],
          ['#14b8a6', 200, '青綠玻璃'],
          ['#a855f7', 240, '紫色霧氣'],
        ].map(([color, h, label], i) => `<div class="moodcard" style="--mood-color:${color};--mood-h:${h}px;animation-delay:${i*80}ms"><div class="moodcard__img"></div><div class="moodcard__lab">${label}</div></div>`).join('')}
      </div>
    </div>
    <div class="dash">
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">AI 萃取的配色 DNA</h3>
          <div style="display:flex;gap:8px;margin-bottom:14px">
            ${['#0ea5e9', '#6366f1', '#ec4899', '#f59e0b', '#10b981'].map(c => `<div style="flex:1;height:60px;border-radius:8px;background:${c};box-shadow:0 4px 12px ${c}40"></div>`).join('')}
          </div>
          <p style="font-size:12.5px;color:var(--text-secondary);margin:0;line-height:1.6">主色：賽博藍 · 強調色：洋紅與霓虹綠 · 中性色：石墨灰</p>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">字型搭配建議</h3>
          <div style="font-family:'Space Grotesk';font-size:24px;font-weight:700;color:var(--text-primary);margin-bottom:4px">Display: Space Grotesk</div>
          <div style="font-family:'Inter';font-size:14px;color:var(--text-secondary)">Body: Inter Regular</div>
        </div>
      </div>
    </div>
  `;

  // === 16 Voicebox：音訊波形編輯 ===
  LAYOUTS['__16'] = (w) => `
    <div class="panel panel--hero">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>這個職人很懂 EP.42</h3><span class="panel__sub">時長 47:32 · 已轉錄</span></div>
      <div class="waveform">
        ${Array.from({length: 80}, (_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 0.3) * 30) + Math.random() * 25;
          const active = i < 28;
          return `<span class="wave-bar" style="height:${h}%;background:${active ? 'var(--accent)' : 'var(--border-mid)'}"></span>`;
        }).join('')}
        <div class="wave-cursor"></div>
      </div>
      <div class="wave-meta"><span>00:14:32 / 00:47:32</span><span>講者：主持人 · 訪談來賓</span></div>
    </div>
    <div class="panel" style="margin-top:20px">
      <h3 class="panel__title" style="margin-bottom:14px">章節時間軸（AI 自動分段）</h3>
      <div class="timeline">
        ${[
          ['00:00', '開場 · 來賓自我介紹', '主持人'],
          ['04:32', '創業初期的關鍵決策', '來賓'],
          ['12:18', '第一次危機與轉折', '來賓 · 高情緒'],
          ['22:47', '人才招募的哲學', '主持人 + 來賓'],
          ['33:05', '對年輕創業者的建議', '來賓 · 高金句密度 ★'],
          ['42:10', '結語與下集預告', '主持人'],
        ].map(([t, c, s]) => `<div class="tl-row"><span class="tl-dot"></span><div class="tl-body"><div class="tl-day">${t}</div><div class="tl-route">${c}</div><div class="tl-hotel">${s}</div></div></div>`).join('')}
      </div>
    </div>
  `;

  // === 17 Athenaeum：二手書市集 ===
  LAYOUTS['__17'] = (w) => `
    <div class="panel" style="margin-bottom:20px">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>台大 · 資工系教科書</h3><span class="panel__sub">142 本可交換</span></div>
      <div class="market">
        ${[
          ['📘', 'CLRS 演算法導論 4/e', '王同學 · 大三', '九成新', 'NT$ 380'],
          ['📕', 'Operating Systems 9/e', '陳同學 · 大四', '七成新 · 有畫線', 'NT$ 220'],
          ['📗', 'Computer Networks 7/e', '林學長 · 已畢業', '全新未拆', 'NT$ 580'],
          ['📙', 'Database System Concepts', '李同學 · 大四', '八成新', 'NT$ 340'],
          ['📘', '線性代數 Strang 6/e', '張同學 · 大二', '九成新', 'NT$ 420'],
          ['📕', 'Discrete Math Rosen', '黃同學 · 大三', '六成新 · 多筆記', 'NT$ 180'],
          ['📗', 'Compiler 龍書', '吳同學 · 大四', '七成新', 'NT$ 280'],
          ['📙', 'AI: Modern Approach', '趙同學 · 研一', '九成新', 'NT$ 460'],
        ].map(([icon, title, seller, condition, price]) => `
          <div class="market-card">
            <div class="market-card__icon">${icon}</div>
            <div class="market-card__title">${title}</div>
            <div class="market-card__seller">${seller}</div>
            <div class="market-card__cond">${condition}</div>
            <div class="market-card__price">${price}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // === 18 PetMind：寵物個人檔 ===
  LAYOUTS['__18'] = (w) => `
    <div class="dash">
      <div class="dash__col">
        <div class="panel panel--hero" style="text-align:center;padding:32px">
          <div class="pet-photo">🐕</div>
          <h2 style="font-size:28px;margin:14px 0 4px;font-weight:800">麻吉</h2>
          <p style="color:var(--text-tertiary);font-size:13px;margin:0 0 18px">柴犬 · 3 歲 · ♂ · 12.4 kg</p>
          <div class="kpis">
            <div class="kpi"><p class="kpi__lab">健康分數</p><p class="kpi__val" style="color:var(--accent)">92</p></div>
            <div class="kpi"><p class="kpi__lab">活動量</p><p class="kpi__val">87%</p></div>
            <div class="kpi"><p class="kpi__lab">情緒</p><p class="kpi__val">😊</p></div>
            <div class="kpi"><p class="kpi__lab">心率</p><p class="kpi__val">88 bpm</p></div>
          </div>
        </div>
        <div class="panel">
          <h3 class="panel__title" style="margin-bottom:12px">AI 行為偵測</h3>
          <div class="notice"><span class="notice__icon">✅</span><span>麻吉今日活動正常，焦慮指數比上週低 14%</span></div>
          <div class="notice" style="background:rgba(251,191,36,0.06);border-color:rgba(251,191,36,0.2)"><span class="notice__icon">💧</span><span>飲水量略偏低，建議補充</span></div>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">本週體重</h3>${chartLine([12.0, 12.1, 12.2, 12.3, 12.3, 12.4, 12.4])}</div>
        <div class="panel">
          <h3 class="panel__title" style="margin-bottom:12px">行事曆</h3>
          <div class="list">
            <div class="row"><span class="row__icon">💉</span><div class="row__main"><div class="row__title">狂犬病疫苗</div><div class="row__meta">12/05（21 天後）</div></div><span class="row__tag row__tag--warn">提醒</span></div>
            <div class="row"><span class="row__icon">✂️</span><div class="row__main"><div class="row__title">美容預約</div><div class="row__meta">11/22 14:00</div></div><span class="row__tag">已預約</span></div>
            <div class="row"><span class="row__icon">🏥</span><div class="row__main"><div class="row__title">年度健檢</div><div class="row__meta">明年 03/14</div></div><span class="row__tag">已排</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // === 19 LingoLink：雙語對照閱讀器 ===
  LAYOUTS['__19'] = (w) => `
    <div class="reader-grid">
      <div class="panel">
        <span class="panel__sub" style="display:block;margin-bottom:8px">English (CEFR B2)</span>
        <p style="font-size:15px;line-height:1.85;color:var(--text-primary);margin:0">
          The future of work isn't about <span class="lingo-word">automating</span> humans away. It's about <span class="lingo-word">augmenting</span> what we can do, freeing us from the <span class="lingo-word">tedious</span> so we can focus on what humans do best — creating, connecting, and caring.
        </p>
      </div>
      <div class="panel">
        <span class="panel__sub" style="display:block;margin-bottom:8px">繁體中文 · AI 翻譯</span>
        <p style="font-size:15px;line-height:1.85;color:var(--text-primary);margin:0">
          工作的未來不是要把人類自動化掉。而是要增強我們的能力，把我們從繁瑣中解放出來，讓我們專注於人類最擅長的事——創造、連結、關懷。
        </p>
      </div>
      <div class="panel">
        <h3 class="panel__title" style="margin-bottom:12px">📖 單字本（剛加入）</h3>
        ${[
          ['augmenting', 'v. 增強', '★★★ 關鍵字'],
          ['tedious', 'adj. 繁瑣的', '★★ 進階字'],
          ['automating', 'v. 自動化', '★ 已熟'],
        ].map(([w, m, lvl]) => `<div class="row" style="padding:8px 10px"><div class="row__main"><div class="row__title" style="font-size:13.5px">${w}</div><div class="row__meta">${m}</div></div><span style="font-size:11px;color:var(--accent);font-family:var(--font-sans)">${lvl}</span></div>`).join('')}
        <p style="margin:14px 0 0;font-size:11.5px;color:var(--text-tertiary);font-family:var(--font-sans)">下次複習：4 小時後（艾賓浩斯曲線）</p>
      </div>
    </div>
    <div class="panel" style="margin-top:20px">
      <h3 class="panel__title" style="margin-bottom:12px">🤖 AI 文法解析 · 「freeing us from the tedious」</h3>
      <p style="color:var(--text-secondary);font-size:14px;line-height:1.7;margin:0">這是分詞片語當伴隨狀況用法：<b style="color:var(--accent)">freeing</b> 修飾主動詞 <b style="color:var(--accent)">augmenting</b>，後面接 <b>from + 受詞</b> 表示「從...解放」。「the tedious」是定冠詞 + 形容詞 = 抽象名詞用法（= the tedious things）。</p>
    </div>
  `;

  // === 20 Synapse：知識圖譜網路 ===
  LAYOUTS['__20'] = (w) => `
    <div class="panel panel--hero">
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>你的思考演化網（過去 90 天）</h3><span class="panel__sub">847 個節點 · 2,341 條連線</span></div>
      <div class="agent-graph">
        <svg viewBox="0 0 600 320" style="width:100%;height:320px">
          ${/* connections */ ''}
          ${[
            [120, 80, 240, 160], [240, 160, 360, 80], [240, 160, 360, 240], [240, 160, 480, 160],
            [360, 80, 480, 60], [360, 240, 480, 280], [120, 240, 240, 160], [480, 160, 540, 100],
          ].map(([x1,y1,x2,y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--accent)" stroke-width="0.8" opacity="0.3"/>`).join('')}
          ${/* nodes (size by importance) */ ''}
          ${[
            [240, 160, 22, 'AI 應用', '#6BFF8E'],
            [120, 80, 14, '產品設計', '#5B8DEF'],
            [360, 80, 16, '創業學', '#C06EFF'],
            [120, 240, 12, '心理學', '#FBBF24'],
            [360, 240, 15, '經濟學', '#FB7185'],
            [480, 160, 13, '哲學', '#84CC16'],
            [480, 60, 9, '語言學', '#F472B6'],
            [480, 280, 10, '社會學', '#22D3EE'],
            [540, 100, 8, '神經科學', '#A78BFA'],
          ].map(([x, y, r, label, color]) => `
            <circle cx="${x}" cy="${y}" r="${r}" fill="${color}33" stroke="${color}" stroke-width="1.5"/>
            <text x="${x}" y="${y + r + 14}" text-anchor="middle" fill="${color}" font-size="10" font-weight="600">${label}</text>
          `).join('')}
        </svg>
      </div>
    </div>
    <div class="dash" style="margin-top:20px">
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">本週新增的關聯</h3>
          <div class="list">
            <div class="row"><span class="row__icon">🔗</span><div class="row__main"><div class="row__title">AI 應用 ↔ 心理學</div><div class="row__meta">3 篇文章橋接這兩個領域</div></div></div>
            <div class="row"><span class="row__icon">🔗</span><div class="row__main"><div class="row__title">創業學 ↔ 哲學</div><div class="row__meta">2 篇文章 · 「目的優先於方法」</div></div></div>
          </div>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel"><h3 class="panel__title" style="margin-bottom:12px">本月閱讀</h3>
          <div class="kpis" style="grid-template-columns:repeat(2,1fr)">
            <div class="kpi"><p class="kpi__lab">文章</p><p class="kpi__val">128</p></div>
            <div class="kpi"><p class="kpi__lab">節點</p><p class="kpi__val">+62</p></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // === 把 __NN 對應到 work.id ===
  // works 用 id 做 key，動態 lookup
  LAYOUTS['__id'] = {
    '06': '__06', '07': '__07', '09': '__09', '12': '__12', '13': '__13',
    '14': '__14', '15': '__15', '16': '__16', '17': '__17', '18': '__18',
    '19': '__19', '20': '__20',
  };

  // 沒對應分類的就用 default：通用 dashboard
  LAYOUTS.default = (w) => `
    <div class="dash">
      <div class="dash__col">
        <div class="panel panel--hero">
          <div class="panel__head">
            <h3 class="panel__title"><span class="panel__title-dot"></span>${w.title} · 主控台</h3>
            <span class="panel__sub">即時更新</span>
          </div>
          <p style="color:var(--text-secondary);line-height:1.7;font-size:14px;margin:0 0 16px">${w.description || w.summary}</p>
          <div class="kpis">
            <div class="kpi"><p class="kpi__lab">${w.metrics ? Object.keys(w.metrics)[0] : '使用者'}</p><p class="kpi__val">${w.metrics ? Object.values(w.metrics)[0] : '5,200+'}</p></div>
            <div class="kpi"><p class="kpi__lab">${w.metrics ? Object.keys(w.metrics)[1] || '評分' : '評分'}</p><p class="kpi__val">${w.metrics ? Object.values(w.metrics)[1] || '4.8' : '4.8'}</p></div>
            <div class="kpi"><p class="kpi__lab">${w.metrics ? Object.keys(w.metrics)[2] || '穩定性' : '穩定性'}</p><p class="kpi__val">${w.metrics ? Object.values(w.metrics)[2] || '99.9%' : '99.9%'}</p></div>
            <div class="kpi"><p class="kpi__lab">狀態</p><p class="kpi__val" style="color:var(--accent)">LIVE</p></div>
          </div>
          ${chartLine([28,42,38,55,48,68,72])}
        </div>
        <div class="panel">
          <div class="panel__head"><h3 class="panel__title">核心功能</h3></div>
          <div class="tile-grid">
            ${(w.features || []).slice(0, 6).map((f, i) => `<div class="tile"><div class="tile__head"><span class="tile__icon">${['🎯','⚡','🔮','📊','🤖','✨'][i % 6]}</span></div><div class="tile__val" style="font-size:13px;font-weight:600">${f}</div></div>`).join('')}
          </div>
        </div>
      </div>
      <div class="dash__col">
        <div class="panel">
          <h3 class="panel__title" style="margin-bottom:12px">本月亮點</h3>
          ${(w.highlights || []).map((h) => `<div class="notice"><span class="notice__icon">✨</span><span>${h}</span></div>`).join('')}
        </div>
        <div class="panel">
          <h3 class="panel__title" style="margin-bottom:12px">技術棧</h3>
          <div class="tags">${(w.tech || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
        ${w.modelsUsed && w.modelsUsed.length ? `<div class="panel"><h3 class="panel__title" style="margin-bottom:12px">使用 AI 模型</h3><div class="tags">${w.modelsUsed.map((m) => `<span class="tag" style="border-color:rgba(192,110,255,0.3);color:#D4A5FF">${m}</span>`).join('')}</div></div>` : ''}
      </div>
    </div>
  `;

  // 別名（已涵蓋的 category 自動 map）
  LAYOUTS['自動化'] = LAYOUTS['AI 應用'];
  // 「工具」「學習」「旅遊」「職涯」「設計」「內容創作」「生活」 → default

  // ============================================================
  // LiveFX：登入後啟動的「正在運作中」效果
  // ============================================================
  function startLiveFX() {
    renderSidebar();
    setupTabs();
    setupRefreshButton();
    enhanceMainPanel();
    injectLiveStream();
    startCounters();
    startTickers();
    setupSparklines();
    injectTerminal();
    setupDrawer();
    setupSearch();
    setupFab();
    setupChatInput();
    injectGauges();
    setupKanbanDrag();
  }

  // ============================================================
  // 互動：Drawer 滑入詳細面板
  // ============================================================
  function setupDrawer() {
    const $drawer = document.getElementById('appDrawer');
    const $body = document.getElementById('drawerBody');
    if (!$drawer || !$body) return;

    function open(payload) {
      const [g1, g2] = work.gradient;
      $body.innerHTML = `
        <div class="drawer__cover" style="background:linear-gradient(135deg,${g1},${g2})">${payload.icon || work.icon}</div>
        <h2 class="drawer__title">${payload.title}</h2>
        <p class="drawer__sub">${payload.sub || work.title}</p>
        <div class="drawer__section">
          <p class="drawer__section-title">基本資訊</p>
          ${payload.fields.map(([k, v]) => `<div class="drawer__row"><span class="drawer__row-key">${k}</span><span class="drawer__row-val">${v}</span></div>`).join('')}
        </div>
        ${payload.activity ? `
          <div class="drawer__section">
            <p class="drawer__section-title">最近活動</p>
            ${payload.activity.map((a) => `<div class="drawer__row"><span class="drawer__row-key">${a[0]}</span><span class="drawer__row-val">${a[1]}</span></div>`).join('')}
          </div>` : ''}
        <div class="drawer__btns">
          <button class="drawer__btn drawer__btn--primary">${payload.cta || '查看完整'}</button>
          <button class="drawer__btn drawer__btn--ghost" data-close>關閉</button>
        </div>
      `;
      $drawer.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function close() { $drawer.hidden = true; document.body.style.overflow = ''; }

    $drawer.addEventListener('click', (e) => { if (e.target.dataset.close !== undefined || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$drawer.hidden) close(); });

    // 委派：點 row / tile / kanban__card / market-card / moodcard / book → 開 drawer
    document.getElementById('appMain').addEventListener('click', (e) => {
      const row = e.target.closest('.row, .tile, .kanban__card, .market-card, .moodcard, .book');
      if (!row) return;
      // 不要攔截特定按鈕
      if (e.target.closest('button, a, .panel__action')) return;
      const title = row.querySelector('.row__title, .tile__val, .kanban__card-title, .market-card__title, .book__title, .moodcard__lab')?.textContent.trim() || '詳細資料';
      const meta = row.querySelector('.row__meta, .tile__lab, .kanban__card-meta, .market-card__seller')?.textContent.trim() || '';
      const icon = row.querySelector('.row__icon, .tile__icon, .market-card__icon')?.textContent.trim() || work.icon;
      // 偽造一些欄位
      const idHash = '#' + Math.random().toString(36).slice(2, 10).toUpperCase();
      open({
        icon, title, sub: meta || work.subtitle,
        fields: [
          ['ID', idHash],
          ['建立時間', new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString('zh-TW')],
          ['狀態', '<span style="color:var(--accent)">● 啟用中</span>'],
          ['擁有者', work.student.name],
          ['可見度', '組織內可見'],
        ],
        activity: [
          [new Date(Date.now() - 60000 * 5).toLocaleTimeString('zh-TW', {hour:'2-digit',minute:'2-digit'}), '已更新'],
          [new Date(Date.now() - 60000 * 47).toLocaleTimeString('zh-TW', {hour:'2-digit',minute:'2-digit'}), '已分享'],
          [new Date(Date.now() - 60000 * 124).toLocaleTimeString('zh-TW', {hour:'2-digit',minute:'2-digit'}), '已建立'],
        ],
        cta: '在新分頁開啟',
      });
    });
  }

  // ============================================================
  // 互動：搜尋過濾列表
  // ============================================================
  function setupSearch() {
    const $input = document.getElementById('appSearch');
    if (!$input) return;
    $input.addEventListener('input', (e) => {
      const k = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.app__main .row, .app__main .tile, .app__main .market-card, .app__main .kanban__card').forEach((el) => {
        if (!k) { el.style.display = ''; return; }
        const txt = el.textContent.toLowerCase();
        el.style.display = txt.includes(k) ? '' : 'none';
      });
    });
  }

  // ============================================================
  // 互動：Tab 切換 — 顯示不同內容
  // ============================================================
  function setupTabs() {
    const $tabs = document.getElementById('appTabs');
    const $main = document.getElementById('appMain');
    if (!$tabs || !$main) return;
    let originalContent = null;
    $tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.app__tab');
      if (!btn) return;
      $tabs.querySelectorAll('.app__tab--active').forEach((el) => el.classList.remove('app__tab--active'));
      btn.classList.add('app__tab--active');
      const tab = btn.dataset.tab;
      if (originalContent === null && tab !== 'overview') originalContent = $main.innerHTML;
      $main.style.opacity = '0';
      setTimeout(() => {
        if (tab === 'overview') {
          if (originalContent) $main.innerHTML = originalContent;
          // 重綁 LiveFX 的子元素
          enhanceMainPanel();
          injectGauges();
          setupKanbanDrag();
        } else if (tab === 'detail') {
          $main.innerHTML = renderDetailTable();
        } else if (tab === 'trend') {
          $main.innerHTML = renderTrendCharts();
        } else if (tab === 'settings') {
          $main.innerHTML = renderSettingsForm();
        }
        $main.style.opacity = '1';
      }, 180);
    });
  }

  function renderDetailTable() {
    const labels = {
      '電商': ['訂單編號', '客戶', '商品', '金額', '狀態'],
      '餐飲': ['訂單', '桌號', '品項', '金額', '狀態'],
      '影音': ['影片名稱', '時長', '狀態', '觀看數', '產生時間'],
      'AI 應用': ['對話 ID', '客戶', '處理時間', 'tokens', '狀態'],
    }[work.category] || ['ID', '名稱', '建立者', '時間', '狀態'];
    const rows = Array.from({length: 12}, (_, i) => {
      const id = '#' + (Math.random().toString(36).slice(2, 8).toUpperCase());
      const name = ['咖啡豆組', '陶瓷杯具', '橄欖油禮盒', '手沖壺', '茶葉禮盒', '梨山高山茶', '巧克力組合', '蜂蜜禮盒'][i % 8];
      const customer = ['林佳穎', '黃柏勳', '陳語安', '吳子瑜', '張承恩'][i % 5];
      const amount = (Math.floor(Math.random() * 4000) + 800).toLocaleString();
      const statuses = [['已完成', 'pos'], ['處理中', 'num'], ['配送中', 'num'], ['已退貨', 'neg']];
      const st = statuses[i % statuses.length];
      return `<tr><td class="num">${id}</td><td>${customer}</td><td>${name}</td><td class="num">NT$ ${amount}</td><td class="${st[1]}">● ${st[0]}</td></tr>`;
    }).join('');
    return `
      <div class="tab-content">
        <div class="panel">
          <div class="panel__head">
            <h3 class="panel__title"><span class="panel__title-dot"></span>明細列表</h3>
            <span class="panel__sub">共 12 筆 · 顯示第 1–12</span>
          </div>
          <table class="data-table">
            <thead><tr>${labels.map((l) => `<th>${l}</th>`).join('')}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderTrendCharts() {
    return `
      <div class="tab-content">
        <div class="dash">
          <div class="dash__col">
            <div class="panel"><div class="panel__head"><h3 class="panel__title">過去 30 天 趨勢</h3><span class="panel__sub">日</span></div>${chartLine([28, 32, 35, 30, 42, 48, 45, 50, 55, 52, 60, 58, 65, 70, 68, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108])}</div>
            <div class="panel"><div class="panel__head"><h3 class="panel__title">小時別熱區</h3><span class="panel__sub">最近 24h</span></div>
              <div style="display:grid;grid-template-columns:repeat(24,1fr);gap:3px;margin-top:14px">
                ${Array.from({length: 24}, (_, i) => {
                  const intensity = (Math.sin(i / 24 * Math.PI * 2) + 1) / 2 * 0.7 + Math.random() * 0.3;
                  return `<div style="height:24px;background:rgba(107,255,142,${intensity.toFixed(2)});border-radius:3px;display:flex;align-items:flex-end;justify-content:center;font-size:9px;color:var(--text-tertiary);padding:2px;font-family:var(--font-mono)">${i}</div>`;
                }).join('')}
              </div>
            </div>
          </div>
          <div class="dash__col">
            <div class="panel"><div class="panel__head"><h3 class="panel__title">統計摘要</h3></div>
              <div class="kpis" style="grid-template-columns:1fr">
                <div class="kpi"><p class="kpi__lab">平均</p><p class="kpi__val">68.4</p></div>
                <div class="kpi"><p class="kpi__lab">中位數</p><p class="kpi__val">72</p></div>
                <div class="kpi"><p class="kpi__lab">標準差</p><p class="kpi__val">14.2</p></div>
              </div>
            </div>
            <div class="panel"><div class="panel__head"><h3 class="panel__title">同比 / 環比</h3></div>
              <div style="font-family:var(--font-mono);font-size:12.5px;line-height:2;color:var(--text-secondary)">
                <div style="display:flex;justify-content:space-between"><span>YoY</span><span style="color:var(--accent)">+34.2%</span></div>
                <div style="display:flex;justify-content:space-between"><span>MoM</span><span style="color:var(--accent)">+8.1%</span></div>
                <div style="display:flex;justify-content:space-between"><span>WoW</span><span style="color:#FB7185">-2.4%</span></div>
                <div style="display:flex;justify-content:space-between"><span>p95</span><span>92.1</span></div>
                <div style="display:flex;justify-content:space-between"><span>p99</span><span>108.4</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSettingsForm() {
    return `
      <div class="tab-content">
        <div class="settings">
          <div class="settings__nav">
            <div class="settings__nav-item settings__nav-item--active">一般</div>
            <div class="settings__nav-item">通知</div>
            <div class="settings__nav-item">外觀</div>
            <div class="settings__nav-item">整合</div>
            <div class="settings__nav-item">API & Webhook</div>
            <div class="settings__nav-item">帳單</div>
            <div class="settings__nav-item">安全</div>
            <div class="settings__nav-item">資料匯出</div>
          </div>
          <div class="settings__form">
            <div class="settings__group">
              <h4 class="settings__group-title">工作區</h4>
              <div class="settings__row"><div><div class="settings__row-label">工作區名稱</div><div class="settings__row-meta">顯示在 sidebar 和 navbar</div></div><span style="font-family:var(--font-mono);color:var(--text-secondary);font-size:13px">${work.title}</span></div>
              <div class="settings__row"><div><div class="settings__row-label">時區</div><div class="settings__row-meta">影響所有時間顯示</div></div><span style="font-family:var(--font-mono);color:var(--text-secondary);font-size:13px">Asia/Taipei (UTC+8)</span></div>
              <div class="settings__row"><div><div class="settings__row-label">語言</div><div class="settings__row-meta">介面顯示語言</div></div><span style="font-family:var(--font-mono);color:var(--text-secondary);font-size:13px">繁體中文</span></div>
            </div>
            <div class="settings__group">
              <h4 class="settings__group-title">通知</h4>
              <div class="settings__row"><div><div class="settings__row-label">電子郵件通知</div><div class="settings__row-meta">每日彙整重要事件</div></div><div class="toggle toggle--on" data-toggle></div></div>
              <div class="settings__row"><div><div class="settings__row-label">即時推播</div><div class="settings__row-meta">在瀏覽器中接收</div></div><div class="toggle toggle--on" data-toggle></div></div>
              <div class="settings__row"><div><div class="settings__row-label">每週報表</div><div class="settings__row-meta">每週一早上寄送</div></div><div class="toggle" data-toggle></div></div>
              <div class="settings__row"><div><div class="settings__row-label">行銷信件</div><div class="settings__row-meta">產品更新、活動</div></div><div class="toggle" data-toggle></div></div>
            </div>
            <div class="settings__group">
              <h4 class="settings__group-title">資料 & 隱私</h4>
              <div class="settings__row"><div><div class="settings__row-label">使用情況遙測</div><div class="settings__row-meta">幫助我們改善產品</div></div><div class="toggle toggle--on" data-toggle></div></div>
              <div class="settings__row"><div><div class="settings__row-label">資料保留期限</div><div class="settings__row-meta">超過將自動清除</div></div><span style="font-family:var(--font-mono);color:var(--text-secondary);font-size:13px">90 天</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // 互動：FAB 快速建立選單
  // ============================================================
  function setupFab() {
    const $fab = document.getElementById('appFab');
    const $menu = document.getElementById('fabMenu');
    const $list = document.getElementById('fabMenuList');
    if (!$fab || !$menu || !$list) return;
    const ITEMS = {
      '電商': [['🛍️', '新增商品', '⌘P'], ['🏷️', '新增優惠券', '⌘D'], ['📧', '建立行銷活動', '⌘M'], ['👥', '新增客戶', '⌘U']],
      '餐飲': [['🍱', '新增菜色', '⌘N'], ['🪑', '新增桌位', '⌘T'], ['📅', '建立訂位', '⌘R'], ['🎉', '建立活動', '⌘E']],
      '影音': [['🎬', '新建影片', '⌘N'], ['📝', '新建腳本', '⌘S'], ['🎙️', '錄製音色', '⌘V'], ['🎨', '新建模板', '⌘T']],
      'AI 應用': [['💬', '新對話', '⌘N'], ['🤖', '部署 Agent', '⌘A'], ['📚', '上傳知識', '⌘K'], ['🔧', '建立工具', '⌘T']],
      '個人財務': [['💸', '新增交易', '⌘N'], ['🎯', '建立目標', '⌘G'], ['🏦', '連結帳戶', '⌘L'], ['📊', '匯出報表', '⌘E']],
      '健康': [['🍱', '記錄飲食', '⌘F'], ['🏃', '記錄運動', '⌘E'], ['💤', '記錄睡眠', '⌘S'], ['📊', '查看報告', '⌘R']],
    };
    const items = ITEMS[work.category] || [['📝', '新建項目', '⌘N'], ['📁', '新建資料夾', '⌘D'], ['👥', '邀請成員', '⌘I'], ['⚙️', '快速設定', '⌘,']];
    $list.innerHTML = items.map(([icon, label, shortcut]) => `<div class="fab-menu__item"><span class="fab-menu__item-icon">${icon}</span><span>${label}</span><span class="fab-menu__item-shortcut">${shortcut}</span></div>`).join('');

    $fab.addEventListener('click', (e) => { e.stopPropagation(); $menu.hidden = !$menu.hidden; });
    $list.addEventListener('click', (e) => {
      const item = e.target.closest('.fab-menu__item');
      if (!item) return;
      $menu.hidden = true;
      showToast('已建立 · ' + item.querySelector('span:nth-child(2)').textContent);
    });
    document.addEventListener('click', (e) => { if (!$menu.hidden && !e.target.closest('.fab-menu, .app__fab')) $menu.hidden = true; });

    // toggle 點擊切換狀態
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toggle]');
      if (t) t.classList.toggle('toggle--on');
    });
  }

  function showToast(msg) {
    const $t = document.getElementById('appToast');
    if (!$t) return;
    $t.textContent = msg;
    $t.hidden = false;
    clearTimeout($t._tm);
    $t._tm = setTimeout(() => ($t.hidden = true), 2200);
  }

  // ============================================================
  // 互動：Oasis AI 對話真的會回應
  // ============================================================
  function setupChatInput() {
    if (work.category !== 'AI 應用') return;
    const $main = document.getElementById('appMain');
    if (!$main) return;
    // 找對話 panel（有 .msg 的那個）
    const chatPanel = Array.from($main.querySelectorAll('.panel')).find((p) => p.querySelector('.msg'));
    if (!chatPanel) return;
    const inputBar = document.createElement('div');
    inputBar.className = 'chat-input';
    inputBar.innerHTML = `
      <input type="text" placeholder="輸入訊息按 Enter 送出…" />
      <button>送出</button>
    `;
    chatPanel.appendChild(inputBar);
    const $input = inputBar.querySelector('input');
    const $btn = inputBar.querySelector('button');
    function send() {
      const text = $input.value.trim();
      if (!text) return;
      $input.value = '';
      // 1. 顯示使用者訊息
      const userMsg = document.createElement('div');
      userMsg.className = 'msg';
      userMsg.innerHTML = `<span class="msg__avatar">客</span><div class="msg__bubble">${escapeHtml(text)}</div>`;
      // 在對話 panel 末尾、輸入框前插入
      chatPanel.insertBefore(userMsg, inputBar);
      // 2. 顯示 AI typing
      const typing = document.createElement('div');
      typing.className = 'msg';
      typing.innerHTML = `<span class="msg__avatar msg__avatar--ai">AI</span><div class="msg__bubble msg__bubble--ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
      chatPanel.insertBefore(typing, inputBar);
      // 3. 1.4s 後 AI 回應
      setTimeout(() => {
        const REPLIES = [
          '好的，馬上幫您處理！我已查到相關資料，請給我一秒分析最佳方案 ✨',
          '我聽到您的問題了，根據過去 30 天的紀錄，建議的解法是...',
          '已為您升級為 VIP 客戶 🎁 後續會有專人聯絡，並補寄一張優惠券',
          '收到！我會把這次對話摘要寄給您的信箱，您可以隨時回顧 📧',
          '了解您的需求。我已經把訂單狀態更新為「優先處理」，物流會加急',
        ];
        typing.innerHTML = `<span class="msg__avatar msg__avatar--ai">AI</span><div class="msg__bubble msg__bubble--ai">${REPLIES[Math.floor(Math.random() * REPLIES.length)]}</div>`;
      }, 1400);
    }
    $btn.addEventListener('click', send);
    $input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  }

  // ============================================================
  // 互動：環形 Gauge（CPU / GPU / Memory）
  // ============================================================
  function injectGauges() {
    const techCats = ['AI 應用', '自動化', '工具'];
    if (!techCats.includes(work.category)) return;
    const $main = document.getElementById('appMain');
    if (!$main) return;
    if ($main.querySelector('.gauges-grid')) return; // 已注入
    const last = $main.querySelector('.dash > .dash__col:last-child');
    if (!last) return;
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="panel__head"><h3 class="panel__title"><span class="panel__title-dot"></span>系統資源</h3><span class="panel__sub">即時</span></div>
      <div class="gauges-grid">
        ${[['CPU', 47], ['GPU', 73], ['記憶體', 28]].map(([lab, pct]) => {
          const c = 2 * Math.PI * 30;
          const off = c * (1 - pct / 100);
          return `<div class="gauge"><svg class="gauge__svg" viewBox="0 0 70 70"><circle class="gauge__bg" cx="35" cy="35" r="30"/><circle class="gauge__fg" cx="35" cy="35" r="30" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg><div class="gauge__lab">${pct}%<span class="gauge__sub">${lab}</span></div></div>`;
        }).join('')}
      </div>
      <div style="font-family:var(--font-mono);font-size:11.5px;color:var(--text-tertiary);text-align:center;margin-top:8px">load avg: 0.${Math.floor(Math.random()*99)} 0.${Math.floor(Math.random()*99)} 0.${Math.floor(Math.random()*99)}</div>
    `;
    last.appendChild(panel);
  }

  // ============================================================
  // 互動：Kanban 拖拉
  // ============================================================
  function setupKanbanDrag() {
    const cards = document.querySelectorAll('.kanban__card');
    const lists = document.querySelectorAll('.kanban__list');
    if (!cards.length || !lists.length) return;
    cards.forEach((card) => {
      card.draggable = true;
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', '');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
    lists.forEach((list) => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.classList.add('drag-over');
      });
      list.addEventListener('dragleave', () => list.classList.remove('drag-over'));
      list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
        const dragging = document.querySelector('.kanban__card.dragging');
        if (dragging) {
          list.appendChild(dragging);
          showToast('已移動');
        }
      });
    });
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---- Sidebar：依分類渲染選單 ----
  function renderSidebar() {
    const $rail = document.getElementById('appRail');
    if (!$rail) return;
    const RAIL_BY_CAT = {
      '電商': [
        ['MAIN', [['📊','儀表板','OK'],['📦','訂單','24'],['🛍️','商品','142']]],
        ['CRM', [['👥','客戶','5.2K'],['💎','VIP 會員','318'],['📧','行銷活動','3']]],
        ['SYSTEM', [['🔌','整合','7'],['📈','分析'],['⚙️','設定']]],
      ],
      '餐飲': [
        ['營運', [['📊','即時看板','OK'],['🍱','訂單','24'],['🪑','桌況','8/12'],['📅','訂位','6']]],
        ['菜單', [['📋','菜單管理','42'],['🥬','食材庫存'],['💰','成本分析']]],
        ['SYSTEM', [['👨‍🍳','員工'],['⚙️','設定']]],
      ],
      '影音': [
        ['工作', [['📊','儀表板','OK'],['🎬','影片庫','142'],['⏳','渲染隊列','3']]],
        ['素材', [['🎨','模板','58'],['🎙️','音色','30+'],['🎵','音樂庫','2.4K']]],
        ['SYSTEM', [['🔌','API'],['📈','分析'],['⚙️','設定']]],
      ],
      '社群': [
        ['探索', [['🗺️','地圖','OK'],['🎉','活動','142'],['👥','揪團','24']]],
        ['我的', [['💬','聊天','5'],['⭐','收藏','38'],['👤','個人檔']]],
        ['SYSTEM', [['🔔','通知'],['⚙️','設定']]],
      ],
      'AI 應用': [
        ['工作區', [['💬','對話','OK'],['🤖','Agents','4'],['📚','知識庫']]],
        ['監控', [['📊','分析'],['💵','成本','$12'],['📈','效能']]],
        ['SYSTEM', [['🔌','整合'],['🔐','API Keys'],['⚙️','設定']]],
      ],
      '自動化': [
        ['工作流', [['📊','儀表板','OK'],['⚙️','流水線','12'],['📅','排程','24']]],
        ['素材', [['📝','草稿','58'],['🖼️','圖庫','812'],['📤','發佈紀錄']]],
        ['SYSTEM', [['🔌','整合','7'],['⚙️','設定']]],
      ],
      '個人財務': [
        ['財務', [['📊','概況','OK'],['💳','交易','387'],['🏦','帳戶','4']]],
        ['規劃', [['🎯','目標','3'],['📈','投資','7'],['💡','AI 建議','12']]],
        ['SYSTEM', [['🔔','提醒'],['⚙️','設定']]],
      ],
      '健康': [
        ['今日', [['💪','總覽','OK'],['🍱','飲食'],['🏃','運動'],['💤','睡眠']]],
        ['趨勢', [['📈','體重'],['❤️','心率'],['🩺','報告']]],
        ['SYSTEM', [['⚙️','設定']]],
      ],
      '學習': [
        ['工作', [['📊','儀表板','OK'],['📖','書庫','42'],['🃏','金句卡','238']]],
        ['進度', [['📈','閱讀統計'],['🎯','目標','3'],['🔁','複習','12']]],
        ['SYSTEM', [['👥','讀書會'],['⚙️','設定']]],
      ],
      '旅遊': [
        ['行程', [['🗺️','概覽','OK'],['📅','日程','7'],['🏨','住宿']]],
        ['工具', [['💱','匯率'],['🌤️','天氣'],['📞','緊急聯絡']]],
        ['SYSTEM', [['👥','旅伴'],['⚙️','設定']]],
      ],
      '職涯': [
        ['履歷', [['📊','儀表板','OK'],['📄','版本','5'],['🎯','匹配','12']]],
        ['面試', [['🤖','AI 模擬','7'],['💡','問題庫','240+'],['💼','錄取追蹤']]],
        ['SYSTEM', [['🔗','LinkedIn'],['⚙️','設定']]],
      ],
      '設計': [
        ['探索', [['🎨','靈感板','OK'],['🌟','精選','142'],['🔍','搜尋']]],
        ['工具', [['🪄','配色'],['🔤','字型'],['📦','匯出']]],
        ['SYSTEM', [['👥','團隊'],['⚙️','設定']]],
      ],
      '內容創作': [
        ['工作', [['📊','儀表板','OK'],['🎙️','音檔','58'],['📝','逐字稿','24']]],
        ['發佈', [['📅','排程'],['📊','觸及'],['💵','廣告']]],
        ['SYSTEM', [['🔌','整合','3'],['⚙️','設定']]],
      ],
      '生活': [
        ['毛孩', [['🐾','總覽','OK'],['📷','日記','142'],['📅','行事曆']]],
        ['健康', [['💪','活動'],['🥩','餵食'],['💉','醫療']]],
        ['SYSTEM', [['👥','社群'],['⚙️','設定']]],
      ],
      '工具': [
        ['工作', [['📊','儀表板','OK'],['📁','專案','24'],['👥','成員','7']]],
        ['資料', [['🗄️','資料庫'],['🔌','API'],['📈','使用量']]],
        ['SYSTEM', [['🔐','安全'],['⚙️','設定']]],
      ],
    };
    const sections = RAIL_BY_CAT[work.category] || RAIL_BY_CAT['工具'];
    $rail.innerHTML = sections.map(([title, items]) => `
      <p class="app__rail-section">${title}</p>
      ${items.map(([icon, label, badge], i) => `
        <div class="app__rail-item ${i === 0 && title === sections[0][0] ? 'app__rail-item--active' : ''}">
          <span class="app__rail-item-icon">${icon}</span>
          <span class="app__rail-item-label">${label}</span>
          ${badge ? `<span class="app__rail-item-badge">${badge}</span>` : ''}
        </div>
      `).join('')}
    `).join('');
    // 點擊 sidebar 項目切換 active
    $rail.addEventListener('click', (e) => {
      const item = e.target.closest('.app__rail-item');
      if (!item) return;
      $rail.querySelectorAll('.app__rail-item--active').forEach((el) => el.classList.remove('app__rail-item--active'));
      item.classList.add('app__rail-item--active');
    });
  }

  // ---- 重新整理按鈕：旋轉 + 重新跑 counters ----
  function setupRefreshButton() {
    const $btn = document.getElementById('appRefresh');
    if (!$btn) return;
    $btn.addEventListener('click', () => {
      $btn.classList.remove('spinning');
      void $btn.offsetWidth;
      $btn.classList.add('spinning');
      // 隨機讓所有 .tick 數字閃一下
      document.querySelectorAll('.kpi__val .tick').forEach((el) => {
        el.classList.remove('tick--flash');
        void el.offsetWidth;
        el.classList.add('tick--flash');
      });
    });
  }

  // ---- 0. 自動把所有主面板加上「呼吸發光 + 雷達掃描」 ----
  function enhanceMainPanel() {
    const heroPanels = document.querySelectorAll('.panel--hero');
    heroPanels.forEach((p) => {
      p.classList.add('breathing');
      // 只有第一個 panel--hero 加雷達
      if (p === heroPanels[0]) {
        const radar = document.createElement('div');
        radar.className = 'radar-pulse';
        radar.innerHTML = `
          <div class="radar-pulse__sweep"></div>
          <div class="radar-pulse__ring"></div>
          <div class="radar-pulse__ring"></div>
          <div class="radar-pulse__ring"></div>
          <div class="radar-pulse__core"></div>
        `;
        p.appendChild(radar);
      }
    });
  }

  // ---- 5. AI 應用、工具、自動化類別額外注入「即時系統日誌終端機」 ----
  function injectTerminal() {
    const techCategories = ['AI 應用', '自動化', '工具'];
    if (!techCategories.includes(work.category)) return;
    const $main = document.getElementById('appMain');
    if (!$main) return;
    // 找最後一個 panel 後面追加
    const lastDashCol = $main.querySelector('.dash > .dash__col:last-child');
    if (!lastDashCol) return;

    const term = document.createElement('div');
    term.className = 'panel';
    term.innerHTML = `
      <div class="panel__head">
        <h3 class="panel__title"><span class="panel__title-dot"></span>系統日誌 · 即時</h3>
        <span class="panel__sub">tail -f /var/log</span>
      </div>
      <div class="terminal">
        <div class="terminal__head"><span></span><span></span><span></span></div>
        <div class="terminal__lines" id="termLines"></div>
      </div>
    `;
    lastDashCol.appendChild(term);

    const $lines = term.querySelector('#termLines');
    const tplsByCategory = {
      'AI 應用': [
        ['info', '[{t}] [agent.scheduler] dispatching task to research-agent'],
        ['ok', '[{t}] [llm.invoke] claude-3.5-sonnet · 1247 tokens · 842ms'],
        ['accent', '[{t}] [vector.search] knowledge-base · 8 results · cosine 0.87'],
        ['info', '[{t}] [tool.exec] /web-search "AI agent best practices"'],
        ['warn', '[{t}] [rate-limit] anthropic api · approaching 80% quota'],
        ['ok', '[{t}] [agent.complete] task #A-{n} · 4 steps · $0.{p}'],
        ['info', '[{t}] [memory.write] conversation #{n} · 3 entries'],
      ],
      '自動化': [
        ['info', '[{t}] [n8n] workflow "Daily Posts" triggered'],
        ['ok', '[{t}] [openai] gpt-4o · article-draft generated'],
        ['accent', '[{t}] [dalle] illustration · 1024x1024 · 8s'],
        ['info', '[{t}] [buffer] post scheduled · IG · 2h from now'],
        ['ok', '[{t}] [seo.check] EEAT score: {p}/100'],
        ['warn', '[{t}] [draft] queue length: {n} pending'],
      ],
      '工具': [
        ['info', '[{t}] [http] POST /api/save · 200 · 47ms'],
        ['ok', '[{t}] [user] #{n} completed onboarding step 3/5'],
        ['accent', '[{t}] [export] doc-{n}.pdf · 2.4 MB · ready'],
        ['info', '[{t}] [collab] cursor sync · 3 users'],
        ['ok', '[{t}] [auto-save] doc-{n} · v.{p}'],
      ],
    };
    const tpls = tplsByCategory[work.category] || tplsByCategory['工具'];

    function pushLine() {
      const [level, body] = tpls[Math.floor(Math.random() * tpls.length)];
      const t = new Date().toLocaleTimeString('en-US', { hour12: false });
      const n = Math.floor(Math.random() * 9000) + 1000;
      const p = Math.floor(Math.random() * 90) + 10;
      const text = body.replace('{t}', t).replace('{n}', n).replace('{p}', p);
      const line = document.createElement('div');
      line.className = `term-line term-line--${level}`;
      line.textContent = text;
      line.setAttribute('data-show', '');
      $lines.prepend(line);
      while ($lines.children.length > 9) $lines.removeChild($lines.lastChild);
    }
    for (let i = 0; i < 5; i++) pushLine();
    setInterval(pushLine, 1400 + Math.random() * 1200);
  }

  // ---- 1. 浮動 LIVE EVENTS 串流視窗 ----
  function injectLiveStream() {
    const eventsByCategory = {
      '電商': [
        ['🛍️', '新訂單 #FA-{n} 完成結帳', 'NT$ {p}'],
        ['📦', '商品 #{n} 即將售罄', '剩 {p} 件'],
        ['🤖', 'AI 為 #{n} 生成新文案', '匹配度 {p}%'],
        ['💳', '會員 #{n} 升級至金卡', '+ NT$ {p} 折扣'],
        ['🔔', '購物車流失再行銷', '已寄出 {p} 封'],
      ],
      '餐飲': [
        ['🍜', '新訂單 #{n} · T03', 'NT$ {p}'],
        ['👤', '線上訂位 · {p} 位', '今晚 19:30'],
        ['🔔', 'T0{p} 結帳完成', '翻桌中'],
        ['📈', '當日營收突破', 'NT$ {n}'],
        ['🍱', '本日熱銷 +1', '商業午餐'],
      ],
      '影音': [
        ['🎬', '影片 #{n} 渲染完成', '時長 0:30'],
        ['🎙️', 'AI 配音任務啟動', '音色：親切女聲'],
        ['📤', '已發佈到 IG', '+ {p} 觀看'],
        ['⚡', 'GPU 利用率', '{p}%'],
        ['✨', '新模板上架', '極簡商業風'],
      ],
      '社群': [
        ['🎉', '{p} 人加入「{n}」', '線下揪團'],
        ['📍', '附近 1km 內', '新活動 {p} 場'],
        ['⭐', '使用者評分', '{p} 分'],
        ['🤝', '揪團成功媒合', '+ {p} 場'],
      ],
      'AI 應用': [
        ['💬', '對話 #{n} 完成', '滿意度 {p}%'],
        ['🤖', 'Agent 任務 +1', 'token: {n}'],
        ['🧠', '推理步驟', '{p} steps'],
        ['🔧', '工具呼叫', '/web-search'],
        ['⚡', 'p95 延遲', '{p} ms'],
      ],
      '自動化': [
        ['🤖', 'Agent 完成第 {n} 步', 'tokens: {p}'],
        ['📤', '貼文已排程', 'IG / FB / X'],
        ['📊', 'SEO 分數', '{p}/100'],
        ['✨', '新草稿產出', 'EP.{n}'],
      ],
      '工具': [
        ['⚙️', '使用者 #{n} 完成設定', '+1 active'],
        ['🪄', 'AI 優化建議', '{p} 項'],
        ['📦', '匯出資料', '{p} MB'],
        ['🔔', '系統健康檢查', '通過'],
      ],
      '個人財務': [
        ['💳', '新交易自動分類', 'NT$ {p}'],
        ['📊', '本月儲蓄率', '{p}%'],
        ['🔔', '異常消費偵測', '已通知'],
        ['💡', 'AI 找回隱形支出', '+ NT$ {p}'],
        ['🏦', '銀行帳戶同步完成', '4 個帳戶'],
      ],
      '健康': [
        ['💪', '完成今日運動目標', '{p} 分鐘'],
        ['📷', '食物拍照辨識', '{p} kcal'],
        ['💤', '昨晚睡眠品質', '{p} 分'],
        ['❤️', '心率異常偵測', '正常'],
        ['🥤', '飲水提醒', '{p}/8 杯'],
      ],
      '學習': [
        ['📖', '完成第 {n} 頁', '+ {p} 個生詞'],
        ['🃏', '新金句卡片', '已分享'],
        ['🔁', '間隔複習', '{p} 個單字到期'],
        ['✨', 'AI 推薦下一本', '匹配度 {p}%'],
      ],
      '旅遊': [
        ['✈️', '航班價格警示', 'NT$ {p}'],
        ['📍', '景點即時人潮', '中等'],
        ['🏨', '飯店降價提醒', '降 NT$ {p}'],
        ['🌤️', '目的地天氣', '晴 {p}°C'],
      ],
      '職涯': [
        ['👁️', '履歷被開啟', '+ {p} 次'],
        ['🎯', '匹配新職缺', '{p} 個'],
        ['🤖', 'AI 模擬面試完成', '{p} 分'],
        ['💼', '推薦人請求', '已寄出'],
      ],
      '設計': [
        ['🎨', '收集新靈感', '+ {p} 張'],
        ['🪄', 'AI 配色提取', '{p} 種主色'],
        ['🧩', '新 Mood Board', '已匯出'],
        ['🌟', 'Behance 收錄', '+ {p} 推薦'],
      ],
      '內容創作': [
        ['🎙️', '新音檔上傳', '{p} MB'],
        ['📝', '逐字稿完成', '{p} 字'],
        ['📌', '章節摘要產出', '{p} 段'],
        ['📤', '一鍵發佈', 'Spotify + Apple'],
      ],
      '生活': [
        ['🐾', '寵物餵食打卡', '今日 {p} 次'],
        ['📷', '行為分析完成', '正常'],
        ['🔔', '預防接種提醒', '剩 {p} 天'],
        ['❤️', '健康分數', '{p}'],
      ],
    };
    const list = eventsByCategory[work.category] || eventsByCategory['工具'];
    const stream = document.createElement('aside');
    stream.className = 'live-stream';
    stream.setAttribute('data-lenis-prevent', '');
    stream.innerHTML = `
      <div class="live-stream__head">
        <span>LIVE EVENTS</span>
        <span class="live-stream__head-meta" id="streamCount">0 / min</span>
      </div>
      <div class="live-stream__list" id="streamList"></div>
    `;
    document.body.appendChild(stream);

    const $list = stream.querySelector('#streamList');
    const $count = stream.querySelector('#streamCount');
    let counter = 0;

    function pushEvent() {
      const tpl = list[Math.floor(Math.random() * list.length)];
      const n = (Math.floor(Math.random() * 9000) + 1000).toLocaleString();
      const p = Math.floor(Math.random() * 90) + 10;
      const title = tpl[1].replace('{n}', n).replace('{p}', p);
      const meta = tpl[2] ? tpl[2].replace('{n}', n).replace('{p}', p) : '';
      const ev = document.createElement('div');
      ev.className = 'live-event';
      ev.innerHTML = `
        <span class="live-event__icon">${tpl[0]}</span>
        <div class="live-event__main">
          <div class="live-event__title">${title}</div>
          <div class="live-event__time">${meta}${meta ? ' · ' : ''}剛剛</div>
        </div>
      `;
      $list.prepend(ev);
      counter++;
      $count.textContent = counter + ' / min';
      // 移除超過 4 條的
      while ($list.children.length > 4) $list.removeChild($list.lastChild);
    }
    pushEvent();
    pushEvent();
    setInterval(pushEvent, 2400 + Math.random() * 1800);
    // 每 60 秒重置計數
    setInterval(() => counter = 0, 60000);
  }

  // ---- 2. KPI 數字進場時從 0 滾到目標 ----
  function startCounters() {
    document.querySelectorAll('.kpi__val').forEach((el) => {
      const text = el.textContent;
      const m = text.match(/^(.*?)([\d,\.]+)([^\d]*)$/);
      if (!m) return;
      const prefix = m[1];
      const target = parseFloat(m[2].replace(/,/g, ''));
      const suffix = m[3];
      if (isNaN(target) || target === 0) return;
      const start = performance.now();
      const dur = 1200;
      function frame(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        const formatted = target % 1 === 0 ? Math.floor(v).toLocaleString() : v.toFixed(1);
        el.innerHTML = `${prefix}<span class="tick">${formatted}</span>${suffix}`;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // ---- 3. 隨機讓某些 KPI 數字自己 tick up（每 2 秒） ----
  function startTickers() {
    // 自動找出所有「整數型」KPI 標記為可滾動目標
    const kpiVals = document.querySelectorAll('.kpi__val .tick');
    const candidates = Array.from(kpiVals).filter((el) => {
      const txt = el.textContent.replace(/,/g, '');
      return /^\d+$/.test(txt) && parseInt(txt) >= 100; // 只挑 3 位數以上的
    });
    if (!candidates.length) return;
    setInterval(() => {
      const el = candidates[Math.floor(Math.random() * candidates.length)];
      const cur = parseInt(el.textContent.replace(/,/g, ''), 10);
      const inc = Math.floor(Math.random() * 5) + 1;
      el.textContent = (cur + inc).toLocaleString();
      el.classList.remove('tick--flash');
      void el.offsetWidth; // restart animation
      el.classList.add('tick--flash');
    }, 2200);
  }

  // ---- 4. 自動把 Sparkline 容器填上隨機走勢圖 ----
  function setupSparklines() {
    document.querySelectorAll('[data-sparkline]').forEach((el) => {
      const n = 12;
      const data = Array.from({length: n}, () => Math.random() * 100);
      const max = Math.max(...data);
      const pts = data.map((v, i) => `${(i / (n - 1)) * 60},${22 - (v / max) * 18}`);
      el.innerHTML = `<svg class="sparkline" viewBox="0 0 60 22"><path class="sparkline__line" d="M ${pts.join(' L ')}"/></svg>`;
    });
  }

  // 共用：產生折線圖 SVG
  function chartLine(data) {
    const max = Math.max(...data);
    const w = 100;
    const h = 100;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h * 0.85}`);
    const linePath = 'M ' + pts.join(' L ');
    const areaPath = `${linePath} L ${w},${h} L 0,${h} Z`;
    return `<div class="chart"><svg class="chart__svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path class="chart__area" d="${areaPath}"/>
      <path class="chart__line" d="${linePath}"/>
    </svg></div>`;
  }
})();
