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
    ko: '"신이 만든 최고의 도구, 불"\n 그리고 \n"인류가 만든 최고의 도구, AI"',
    en: '"Fire, the Greatest Tool Created by God"\nand\n"AI, the Greatest Tool Created by Humanity"',
    ja: '「神が作った最高の道具、火」\nそして\n「人類が作った最高の道具、AI」',
    zh: '"上帝创造的最好工具，火"\n和\n"人类创造的最好工具，AI"',
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
    ko: '이재권',
    en: 'Jaekwon Lee',
    ja: 'イ・ジェグォン',
    zh: '李在权',
  },
  title: {
    ko: '이노커브 CTO · 사단법인 이사',
    en: 'Innocurve CTO · Director of Association',
    ja: 'イノカーブ CTO · 社団法人理事',
    zh: 'InnoCurve CTO · 社团法人理事',
  },
  birth: {
    ko: '출생',
    en: 'Birth',
    ja: '生年月日',
    zh: '出生',
  },
  birthDate: {
    ko: '1996년 3월 16일',
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
    ko: '이노커브 CTO\n(사)대전청년을세계로 사외외 이사',
    en: 'Innocurve CTO\nDirector of Korean Youth to the World Association',
    ja: 'イノカーブ CTO\n(社)大韓青年を世界へ 社外理事',
    zh: 'InnoCurve CTO\n(社)韩国青年走向世界 社外理事',
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
    ko: 'AI, 개발, 청년',
    en: 'AI, Development, Youth',
    ja: 'AI、開発、青年',
    zh: 'AI、开发、青年',
  },
  mbti: {
    ko: 'MBTI',
    en: 'MBTI',
    ja: 'MBTI',
    zh: 'MBTI',
  },
  mbtiType: {
    ko: 'ENTP',
    en: 'ENTP',
    ja: 'ENTP',
    zh: 'ENTP',
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
    ko: '현실에 안주하는 삶은\n시대에 뒤처집니다.',
    en: 'A Life of Complacency\nFalls Behind the Times',
    ja: '現状に甘んじる人生は\n時代に取り残される',
    zh: '安于现状的生活\n将会落后于时代',
  },
  greetingDescription: {
    ko: '"현실에 안주하는 삶은 시대에 뒤처집니다." \n이 한 마디는 오늘날 인공지능(AI) 혁신의 빠른 속도와 맞물려 더욱 강렬하게 다가옵니다.\nAI는 단순한 도구를 넘어, 우리 생활과 산업 전반에 걸쳐 새로운 패러다임을 열어가고 있습니다.\n\n끊임없이 변화하는 데이터의 흐름 속에서 AI는 미래를 예측하고,\n최적의 의사결정을 지원하며, 인간의 한계를 넘어서는 창의적 가능성을 실현합니다. \n이러한 변화의 물결에 발맞추지 않고 현실에 안주한다면,\n개인은 물론 조직과 사회 전체가 급변하는 시대에 뒤처지게 될 것입니다.\n\nAI가 제시하는 무한한 가능성을 인식하고, 이를 적극적으로 수용하고 발전시켜 나갈 때, \n우리는 진정으로 미래를 준비하는 삶을 살아갈 수 있을 것입니다.',
    en: '"A life of complacency falls behind the times."\nThis statement resonates more powerfully today, intertwined with the rapid pace of artificial intelligence (AI) innovation.\nAI is more than just a tool; it\'s opening new paradigms across our lives and industries.\n\nIn the constant flow of evolving data, AI predicts the future,\nsupports optimal decision-making, and realizes creative possibilities beyond human limitations.\nIf we remain complacent and fail to keep pace with these changes,\nboth individuals and organizations will fall behind in this rapidly changing era.\n\nWhen we recognize the infinite possibilities that AI presents and actively embrace and develop them,\nwe can truly live a life prepared for the future.',
    ja: '「現状に甘んじる人生は時代に取り残される」\nこの言葉は、今日の人工知能（AI）革新の急速な進展と相まって、より強く響きます。\nAIは単なるツールを超え、私たちの生活と産業全般に新しいパラダイムを開いています。\n\n絶え間なく変化するデータの流れの中で、AIは未来を予測し、\n最適な意思決定を支援し、人間の限界を超える創造的な可能性を実現します。\nこの変化の波に追いつかず、現状に甘んじれば、\n個人はもちろん、組織や社会全体が急変する時代に取り残されることになるでしょう。\n\nAIが示す無限の可能性を認識し、それを積極的に受け入れ、発展させていく時、\n私たちは真に未来に備えた人生を歩むことができるでしょう。',
    zh: '"安于现状的生活将会落后于时代。"\n这句话在当今人工智能（AI）创新的快速步伐下显得尤为深刻。\nAI不仅仅是一个工具，它正在我们的生活和产业全领域开创新的范式。\n\n在不断变化的数据流中，AI预测未来，\n支持最优决策，实现超越人类极限的创造性可能。\n如果我们不跟上这些变化的步伐，安于现状，\n个人乃至组织和整个社会都将在这个急剧变化的时代中落后。\n\n当我们认识到AI所展现的无限可能性，并积极接纳和发展它时，\n我们才能真正过上为未来做好准备的生活。',
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
    ko: '안녕하세요! 저는 이재권입니다. 무엇을 도와드릴까요?',
    en: 'Hello! I am Jaekwon Lee. How can I help you?',
    ja: 'こんにちは！イ・ジェグォンです。何かお手伝いできることはありますか？',
    zh: '你好！我是李在权。我能为您做些什么？',
  },
  cloneGreeting: {
    ko: "안녕하세요! 저는 이재권's Clone입니다. 무엇을 도와드릴까요?",
    en: "Hello! I'm Jaekwon Lee's Clone. How can I help you?",
    ja: "こんにちは！イ・ジェグォンのクローンです。どのようにお手伝いできますか？",
    zh: "你好！我是李在权的克隆。我能为您做些什么？",
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

