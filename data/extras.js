// ============================================================
//  學員見證 / 業界肯定 / 數據里程碑（雙語版）
// ============================================================

const TESTIMONIALS = [
  {
    quote: '結業前一週我手上還是一坨爛 code，結業當天我的東西已經有 200 個真實使用者在用。這不是訓練營，是火箭發射台。',
    quote_en: 'A week before graduation my code was a mess. On graduation day, 200 real users were using my product. This isn\'t a bootcamp—it\'s a rocket launch pad.',
    name: '林佳穎', name_en: 'Lin Chia-Ying',
    role: '第 3 期 / NeuroShop 創辦人', role_en: 'Cohort 3 / Founder of NeuroShop',
    company: 'Future Academy', rating: 5,
  },
  {
    quote: '我們公司面試了 4 位未來學院的學員，最後 4 個都錄取了。他們作品集裡的東西不是 demo，是真的有人在付錢的產品。',
    quote_en: 'We interviewed 4 graduates from Future Academy. We hired all 4. Their portfolios weren\'t demos—they were products people were actually paying for.',
    name: 'Eric Chen', name_en: 'Eric Chen',
    role: 'CTO', role_en: 'CTO',
    company: 'Cake Resume', rating: 5,
  },
  {
    quote: '從零基礎到上架 App Store 只花了 18 週。我現在 Vital AI 每天有 6,800 個 MAU，這是我以前完全不敢想像的。',
    quote_en: 'From zero to App Store in 18 weeks. Vital AI now has 6,800 daily active users. I never imagined this was possible.',
    name: '王宥婷', name_en: 'Wang You-Ting',
    role: '第 4 期 / Vital AI 創辦人', role_en: 'Cohort 4 / Founder of Vital AI',
    company: 'Future Academy', rating: 5,
  },
  {
    quote: '這裡的學員交給你的不是「做好的網站」，是「會自己長大的產品」。整個產業都被它們改變了。',
    quote_en: 'These graduates don\'t hand you "a finished website"—they hand you a product that grows on its own. The whole industry is shifting.',
    name: 'Stella Wang', name_en: 'Stella Wang',
    role: '創投合夥人', role_en: 'Partner',
    company: 'AppWorks', rating: 5,
  },
  {
    quote: '我面試過數百個工程師，很少看到能在面試現場直接 demo 自己上線產品的。未來學院畢業生幾乎人人都能。',
    quote_en: 'I\'ve interviewed hundreds of engineers. Rarely can someone live-demo their own production product. Future Academy graduates almost always can.',
    name: 'James Lin', name_en: 'James Lin',
    role: 'Engineering Lead', role_en: 'Engineering Lead',
    company: 'Dcard', rating: 5,
  },
  {
    quote: '之前去過矽谷的 bootcamp，回來看了未來學院還是覺得這裡更猛。實作密度跟業界連結都比我想像中高。',
    quote_en: 'I attended a Silicon Valley bootcamp before. Future Academy still felt more intense. The implementation density and industry connections are beyond what I expected.',
    name: '周哲瑋', name_en: 'Zhou Zhe-Wei',
    role: '第 4 期 / Ensemble 創辦人', role_en: 'Cohort 4 / Founder of Ensemble',
    company: 'Future Academy', rating: 5,
  },
];

const PARTNERS = [
  { name: '誠品書店', name_en: 'Eslite Bookstore', tag: '採用 Codex 為書店推薦工具', tag_en: 'Adopted Codex as bookstore recommendation tool' },
  { name: 'Cake Resume', name_en: 'Cake Resume', tag: '與 Resume Lab 整合', tag_en: 'Integrated with Resume Lab' },
  { name: 'AppWorks', name_en: 'AppWorks', tag: '加速器育成夥伴', tag_en: 'Accelerator partner' },
  { name: '數位發展部', name_en: 'Ministry of Digital Affairs', tag: '官方推薦', tag_en: 'Official recommendation' },
  { name: '台北市政府', name_en: 'Taipei City Gov.', tag: 'Nomad 官方夥伴', tag_en: 'Official partner of Nomad' },
  { name: 'Hahow', name_en: 'Hahow', tag: '線上學習合作', tag_en: 'Online learning partnership' },
  { name: 'KKday', name_en: 'KKday', tag: 'Wanderlust 戰略夥伴', tag_en: 'Strategic partner of Wanderlust' },
  { name: '誠品行旅', name_en: 'Eslite Hotel', tag: 'DineFlow 試營運', tag_en: 'DineFlow pilot run' },
  { name: '中華電信', name_en: 'Chunghwa Telecom', tag: '5G 應用合作', tag_en: '5G application collaboration' },
  { name: '聯合報', name_en: 'United Daily News', tag: '媒體報導採訪', tag_en: 'Media coverage' },
  { name: '商業週刊', name_en: 'Business Weekly', tag: '封面故事', tag_en: 'Cover story' },
  { name: 'Apple Daily', name_en: 'Apple Daily', tag: 'AI 新創專題', tag_en: 'AI startup feature' },
];

const PRESS = [
  { source: 'TechCrunch Asia', headline: '台灣的 Y Combinator？未來學院 20 個學員作品全上線', headline_en: 'Taiwan\'s Y Combinator? Future Academy ships all 20 student products live' },
  { source: '商業週刊', source_en: 'Business Weekly', headline: '不教 PPT 的訓練營：未來學院如何讓學員 18 週做出可營收產品', headline_en: 'The bootcamp that doesn\'t teach PowerPoint: how Future Academy ships revenue-ready products in 18 weeks' },
  { source: '數位時代', source_en: 'Business Next', headline: '從學員作品看 AI 時代的學習：每一個都接得住真實流量', headline_en: 'Learning in the AI era: every student product handles real traffic' },
  { source: '報導者', source_en: 'The Reporter', headline: '結業即就業：未來學院如何重新定義技職教育', headline_en: 'Graduation equals employment: redefining vocational education' },
  { source: 'Inside 硬塞', source_en: 'Inside.com.tw', headline: '不只一個明星學員——未來學院的「集體爆發」現象', headline_en: 'Not just one star—the "collective breakout" phenomenon at Future Academy' },
];

const ACHIEVEMENTS = {
  totalStudents: 240, totalLiveProducts: 86, totalUsers: 320000,
  totalRevenue: 4800000, hireRate: 94, cohorts: 4,
};

window.TESTIMONIALS = TESTIMONIALS;
window.PARTNERS = PARTNERS;
window.PRESS = PRESS;
window.ACHIEVEMENTS = ACHIEVEMENTS;
