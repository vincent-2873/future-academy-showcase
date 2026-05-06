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
  });

  // === 6. 依 category 渲染 dashboard ===
  function renderDashboard() {
    const $main = document.getElementById('appMain');
    const layout = LAYOUTS[work.category] || LAYOUTS.default;
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
