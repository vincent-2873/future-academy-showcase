// ============================================================
//  學員見證 / 業界肯定 / 數據里程碑
// ============================================================

const TESTIMONIALS = [
  {
    quote: '結業前一週我手上還是一坨爛 code，結業當天我的東西已經有 200 個真實使用者在用。這不是訓練營，是火箭發射台。',
    name: '林佳穎',
    role: '第 3 期 / NeuroShop 創辦人',
    company: 'Future Academy',
    rating: 5,
  },
  {
    quote: '我們公司面試了 4 位未來學院的學員，最後 4 個都錄取了。他們作品集裡的東西不是 demo，是真的有人在付錢的產品。',
    name: 'Eric Chen',
    role: 'CTO',
    company: 'Cake Resume',
    rating: 5,
  },
  {
    quote: '從零基礎到上架 App Store 只花了 18 週。我現在 Vital AI 每天有 6,800 個 MAU，這是我以前完全不敢想像的。',
    name: '王宥婷',
    role: '第 4 期 / Vital AI 創辦人',
    company: 'Future Academy',
    rating: 5,
  },
  {
    quote: '這裡的學員交給你的不是「做好的網站」，是「會自己長大的產品」。整個產業都被它們改變了。',
    name: 'Stella Wang',
    role: '創投合夥人',
    company: 'AppWorks',
    rating: 5,
  },
  {
    quote: '我面試過數百個工程師，很少看到能在面試現場直接 demo 自己上線產品的。未來學院畢業生幾乎人人都能。',
    name: 'James Lin',
    role: 'Engineering Lead',
    company: 'Dcard',
    rating: 5,
  },
  {
    quote: '之前去過矽谷的 bootcamp，回來看了未來學院還是覺得這裡更猛。實作密度跟業界連結都比我想像中高。',
    name: '周哲瑋',
    role: '第 4 期 / Ensemble 創辦人',
    company: 'Future Academy',
    rating: 5,
  },
];

// 進駐 / 採用學員作品的品牌（示意）
const PARTNERS = [
  { name: '誠品書店', tag: '採用 Codex 為書店推薦工具' },
  { name: 'Cake Resume', tag: '與 Resume Lab 整合' },
  { name: 'AppWorks', tag: '加速器育成夥伴' },
  { name: '數位發展部', tag: '官方推薦' },
  { name: '台北市政府', tag: 'Nomad 官方夥伴' },
  { name: 'Hahow', tag: '線上學習合作' },
  { name: 'KKday', tag: 'Wanderlust 戰略夥伴' },
  { name: '誠品行旅', tag: 'DineFlow 試營運' },
  { name: '中華電信', tag: '5G 應用合作' },
  { name: '聯合報', tag: '媒體報導採訪' },
  { name: '商業週刊', tag: '封面故事' },
  { name: 'Apple Daily', tag: 'AI 新創專題' },
];

// 媒體報導
const PRESS = [
  { source: 'TechCrunch Asia', headline: '台灣的 Y Combinator？未來學院 20 個學員作品全上線' },
  { source: '商業週刊', headline: '不教 PPT 的訓練營：未來學院如何讓學員 18 週做出可營收產品' },
  { source: '數位時代', headline: '從學員作品看 AI 時代的學習：每一個都接得住真實流量' },
  { source: '報導者', headline: '結業即就業：未來學院如何重新定義技職教育' },
  { source: 'Inside 硬塞', headline: '不只一個明星學員——未來學院的「集體爆發」現象' },
];

// 整體成就數字（顯示在 Hall of Fame 之前）
const ACHIEVEMENTS = {
  totalStudents: 240,
  totalLiveProducts: 86,
  totalUsers: 320000,
  totalRevenue: 4800000, // 累計學員作品營收 NT$
  hireRate: 94, // 結業就業率 %
  cohorts: 4,
};

window.TESTIMONIALS = TESTIMONIALS;
window.PARTNERS = PARTNERS;
window.PRESS = PRESS;
window.ACHIEVEMENTS = ACHIEVEMENTS;
