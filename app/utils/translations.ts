export type Language = 'ko' | 'en' | 'ja' | 'zh';

export type TranslationKey = string;

export type TranslationDictionary = {
  [key in TranslationKey]: {
    [lang in Language]: string;
  };
};

export const translations: TranslationDictionary = {
  profile: {
    ko: '프로필',
    en: 'Profile',
    ja: 'プロフィール',
    zh: '个人资料',
  },
  values: {
    ko: '가치관',
    en: 'Values',
    ja: '価値観',
    zh: '价值观',
  },
  valuesDescription: {
    ko: '쾌적한 공기,\n건강한 환경을 위한\n에어컨 세척 전문가!',
    en: 'Fresh Air,\nAir Conditioner Cleaning Expert\nfor a Healthy Environment!',
    ja: '快適な空気,\n健康的な環境のための\nエアコン洗浄のプロフェッショナル！',
    zh: '舒适空气,\n为健康环境而生的\n空调清洗专家！',
  },
  history: {
    ko: '연혁',
    en: 'History',
    ja: '経歴',
    zh: '历史',
  },
  activities: {
    ko: '프로젝트',
    en: 'Projects',
    ja: 'プロジェクト',
    zh: '项目',
  },
  name: {
    ko: '임한세',
    en: 'HanSe Lim',
    ja: '林韓勢',
    zh: '林韓勢',
  },
  title: {
    ko: '클린에어 대표 · 사단법인 이사',
    en: 'CEO of Clean Air · Director of Non-Profit Organization',
    ja: 'クリーンエア代表 · 社団法人理事',
    zh: '清洁空气代表 · 社团法人理事'
  },
  birth: {
    ko: '출생',
    en: 'Birth',
    ja: '生年月日',
    zh: '出生',
  },
  birthDate: {
    ko: '1996년 2월 6일',
    en: 'February 6, 1996',
    ja: '1996年2月6日',
    zh: '1996年2月6日',
  },
  affiliation: {
    ko: '소속',
    en: 'Affiliations',
    ja: '所属',
    zh: '隶属',
  },
  affiliationDescription: {
    ko: '클린에어 대표\n(사)대전청년을세계로 법인 이사\n새마을 대덕구청년미래연대 회장',
    en: 'CEO of Clean Air\nDirector of Daejeon Youth to the World Association\nChairman of Daedeok-gu Youth Future Alliance',
    ja: 'クリーンエア代表\n(社)大田青年を世界へ法人理事\n新しい村 大徳区青年未来連帯会長',
    zh: '清洁空气代表\n(社)大田青年走向世界法人理事\n新村大德区青年未来联盟会长'
  },
  education: {
    ko: '학력',
    en: 'Education',
    ja: '学歴',
    zh: '教育',
  },
  educationDescription: {
    ko: '추가 예정',
    en: 'To be updated',
    ja: '追加予定',
    zh: '待添加',
  },
  field: {
    ko: '분야',
    en: 'Fields',
    ja: '分野',
    zh: '领域',
  },
  fieldDescription: {
    ko: '추가 예정',
    en: 'Coming Soon',
    ja: '追加予定',
    zh: '即将添加',
  },
  mbti: {
    ko: 'MBTI',
    en: 'MBTI',
    ja: 'MBTI',
    zh: 'MBTI',
  },
  mbtiType: {
    ko: 'ESTJ',
    en: 'ESTJ',
    ja: 'ESTJ',
    zh: 'ESTJ',
  },
  contact: {
    ko: '문의',
    en: 'Contact',
    ja: 'お問い合わせ',
    zh: '联系',
  },
  smartOptions: {
    ko: '스마트 옵션',
    en: 'Smart Options',
    ja: 'スマートオプション',
    zh: '智能选项',
  },
  socialMedia: {
    ko: 'SNS',
    en: 'Social Media',
    ja: 'SNS',
    zh: '社交媒体',
  },
  viewMore: {
    ko: '자세히 보기',
    en: 'View More',
    ja: '詳細を見る',
    zh: '查看更多',
  },
  allRightsReserved: {
    ko: '모든 권리 보유.',
    en: 'All rights reserved.',
    ja: 'All rights reserved.',
    zh: '版权所有。',
  },
  date: {
    ko: '게시일',
    en: 'Date',
    ja: '投稿日',
    zh: '日期',
  },
  summary: {
    ko: '요약',
    en: 'Summary',
    ja: '要約',
    zh: '摘要',
  },
  details: {
    ko: '상세 내용',
    en: 'Details',
    ja: '詳細内容',
    zh: '详情',
  },
  gallery: {
    ko: '갤러리',
    en: 'Gallery',
    ja: 'ギャラリー',
    zh: '画廊',
  },
  backToList: {
    ko: '목록으로 돌아가기',
    en: 'Back to List',
    ja: 'リストに戻る',
    zh: '返回列表',
  },
  expandToggle: {
    ko: '펼쳐보기',
    en: 'Expand',
    ja: '展開する',
    zh: '展开',
  },
  collapseToggle: {
    ko: '숨기기',
    en: 'Collapse',
    ja: '折りたたむ',
    zh: '折叠',
  },
  aiClone: {
    ko: 'AI 클론',
    en: 'AI Clone',
    ja: 'AIクローン',
    zh: 'AI克隆',
  },
  phone: {
    ko: '전화',
    en: 'Phone',
    ja: '電話',
    zh: '电话',
  },
  greetingVideo: {
    ko: '인사 영상',
    en: 'Greeting Video',
    ja: '挨拶動画',
    zh: '问候视频',
  },
  innoCardInquiry: {
    ko: 'InnoCard\n문의',
    en: 'InnoCard\nInquiry',
    ja: 'InnoCard\nお問い合わせ',
    zh: 'InnoCard\n咨询',
  },
  contactOptions: {
    ko: '연락하기',
    en: 'Get in Touch',
    ja: 'お問い合わせ',
    zh: '联系方式',
  },
  greetingTitle: {
    ko: '최고 품질의 세척 서비스로,\n건강하고 쾌적한 환경을 만듭니다',
    en: 'Creating a Healthy and Pleasant Environment\nwith Top-Quality Cleaning Services',
    ja: '最高品質の洗浄サービスで、\n健康で快適な環境を作ります',
    zh: '以最高品质的清洗服务，\n创造健康舒适的环境',
  },
  greetingDescription: {
    ko: '깨끗한 공기는 삶의 질을 높입니다.\n클린에어는 친환경적이고 안전한 세척 방법으로\n당신의 공간을 더욱 쾌적하게 유지합니다.\n\n신뢰받는 브랜드로 성장하기 위해,\n최고의 기술과 맞춤형 서비스로\n고객 만족을 최우선으로 합니다.',
    en: 'Clean air enhances the quality of life.\nClean Air maintains your space more comfortably\nwith eco-friendly and safe cleaning methods.\n\nTo grow as a trusted brand,\nwe prioritize customer satisfaction\nwith the best technology and customized services.',
    ja: 'きれいな空気は生活の質を高めます。\nクリーンエアは環境に優しく安全な洗浄方法で\nあなたの空間をより快適に保ちます。\n\n信頼されるブランドとして成長するため、\n最高の技術とカスタマイズされたサービスで\nお客様満足を最優先にします。',
    zh: '清洁的空气提升生活品质。\n清洁空气通过环保安全的清洗方法，\n让您的空间更加舒适。\n\n为成长为值得信赖的品牌，\n我们以最佳技术和定制服务，\n将客户满意度放在首位。',
  },
  chatInputPlaceholder: {
    ko: '메시지를 입력하세요...',
    en: 'Type your message...',
    ja: 'メッセージを入力してください...',
    zh: '请输入消息...',
  },
  cloneTitle: {
    ko: "'s Clone",
    en: "'s Clone",
    ja: "'s Clone",
    zh: "'s Clone"
  },
  formName: {
    ko: '이름',
    en: 'Name',
    ja: '名前',
    zh: '姓名',
  },
  formNamePlaceholder: {
    ko: '이름을 입력하세요',
    en: 'Enter your name',
    ja: '名前を入力してください',
    zh: '请输入姓名',
  },
  formBirthdate: {
    ko: '생년월일',
    en: 'Date of Birth',
    ja: '生年月日',
    zh: '出生日期',
  },
  formBirthdatePlaceholder: {
    ko: 'YYYY-MM-DD',
    en: 'YYYY-MM-DD',
    ja: 'YYYY-MM-DD',
    zh: 'YYYY-MM-DD',
  },
  formPhone: {
    ko: '전화번호',
    en: 'Phone Number',
    ja: '電話番号',
    zh: '电话号码',
  },
  formPhonePlaceholder: {
    ko: '전화번호를 입력하세요',
    en: 'Enter your phone number',
    ja: '電話番号を入力してください',
    zh: '请输入电话号码',
  },
  formInquiry: {
    ko: '문의 내용',
    en: 'Inquiry Details',
    ja: 'お問い合わせ内容',
    zh: '咨询内容',
  },
  formInquiryPlaceholder: {
    ko: '예) 제작 문의',
    en: 'e.g., Production inquiry',
    ja: '例）制作に関するお問い合わせ',
    zh: '例如：制作咨询',
  },
  formSubmit: {
    ko: '제출',
    en: 'Submit',
    ja: '送信',
    zh: '提交',
  },
  back: {
    ko: '뒤로',
    en: 'Back',
    ja: '戻る',
    zh: '返回',
  },
  initialGreeting: {
    ko: '안녕하세요! 저는 임한세입니다. 무엇을 도와드릴까요?',
    en: 'Hello! I am HanSe Lim. How can I help you?',
    ja: 'こんにちは！林韓勢と申します。何かお手伝いできることはありますか？',
    zh: '你好！我是林韓勢。我能为您做些什么？'
  },
  cloneGreeting: {
    ko: "안녕하세요! 저는 임한세's Clone입니다. 무엇을 도와드릴까요?",
    en: "Hello! I'm HanSe Lim's Clone. How can I help you?",
    ja: "こんにちは！林韓勢のクローンです。どのようにお手伝いできますか？",
    zh: "你好！我是林韓勢的克隆。我能为您做些什么？"
  },
};

export function translate(key: TranslationKey, lang: Language): string {
  try {
    const translation = translations[key]?.[lang] ?? translations[key]?.['ko'] ?? key;
    return translation || key;
  } catch (error) {
    console.error(`Translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}

