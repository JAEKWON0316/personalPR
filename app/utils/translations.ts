export type Language = 'ko' | 'en' | 'ja' | 'zh';

export type TranslationKey = string;

// 기본 번역 타입 정의
export type TranslationDictionary = {
  [key in TranslationKey]: {
    [lang in Language]: string;
  };
};

// 음성 대화 설명을 위한 타입 정의
export type VoiceChatDescriptionKey = 
  | 'recognizingVoice'
  | 'pleaseSpeak'
  | 'autoVoiceDetection'
  | 'speakFreely'
  | 'startConversation'
  | 'endConversation'
  | 'iosPermission'
  | 'androidPermission'
  | 'voiceChatTitle';

export type VoiceChatDescriptions = {
  [key in VoiceChatDescriptionKey]: {
    [lang in Language]: string;
  };
};

// MyValues 콘텐츠 타입 정의
export type ValuesContentKey = 
  | 'intro'
  | 'example'
  | 'aiDescription'
  | 'mission'
  | 'vision1'
  | 'vision2'
  | 'thanks';

export type ValuesContent = {
  [key in ValuesContentKey]: {
    [lang in Language]: string;
  };
};

// Posts 데이터 타입 정의
export type PostKey = 'post1' | 'post2' | 'post3' | 'post4';

export type PostsData = {
  [key in PostKey]: {
    id: number;
    image: string;
    images?: string[];
    title: {
      [lang in Language]: string;
    };
    description: {
      [lang in Language]: string;
    };
    tags: {
      [lang in Language]: string[];
    };
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
    ko: '우리는\n격동과 변혁의 시대\n한가운데에 서 있습니다.',
    en: 'We stand\nin the midst of an era\nof turbulence and transformation.',
    ja: '私たちは\n激動と変革の時代の\n真っ只中にいます。',
    zh: '我们正处于\n变革与动荡时代的\n中心。',
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
    en: 'JaeKwon Lee',
    ja: '李在寛',
    zh: '李在宽',
  },
  title: {
    ko: 'AI개발자 · 풀스택 개발자',
    en: 'AI Developer · Full Stack Developer',
    ja: 'AI開発者 · フルスタック開発者',
    zh: 'AI开发者 · 全栈开发者',
  },
  birth: {
    ko: '출생',
    en: 'Birth',
    ja: '生年月日',
    zh: '出生',
  },
  birthDate: {
    ko: '1996년 3월 16일',
    en: 'March 16, 1996',
    ja: '3月16日 1996年',
    zh: '1996年3月16日',
  },
  affiliation: {
    ko: '주소지',
    en: 'Address',
    ja: '住所',
    zh: '地址',
  },
  affiliation02:{
    ko: '소속',
    en: 'Affiliation',
    ja: '所属',
    zh: '所属',
  },
  affiliationDescription: {
    ko: '경기도 김포시',
    en: 'Gimpo, Gyeonggi-do',
    ja: '金浦市, 京畿道',
    zh: '金浦市, 京畿道',
  },
  education: {
    ko: '학력',
    en: 'Education',
    ja: '学歴',
    zh: '教育',
  },
  educationDescription: {
    ko: '배재대학교 전자자공학과 학사',
    en: "Baekseok University, Bachelor of Electronic Engineering",
    ja: '北濟州大学 電子情報工学部 学士',
    zh: '北济州大学 电子信息工程学士',
  },
  field: {
    ko: '분야',
    en: 'Fields',
    ja: '分野',
    zh: '领域',
  },
  fieldDescription: {
    ko: '개발, AI, 브랜딩 마케팅',
    en: 'Development, AI, Branding Marketing',
    ja: '開発、AI、ブランディングマーケティング',
    zh: '开发，AI，品牌营销',
  },
  mbti: {
    ko: 'MBTI',
    en: 'MBTI',
    ja: 'MBTI',
    zh: 'MBTI',
  },
  mbtiType: {
    ko: 'ENTJ',
    en: 'ENTJ',
    ja: 'ENTJ',
    zh: 'ENTJ',
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
    ko: 'Jack1 문의',
    en: 'Jack1 Inquiry',
    ja: 'Jack1 お問い合わせ',
    zh: 'Jack1 咨询',
  },
  contactOptions: {
    ko: '연락하기',
    en: 'Get in Touch',
    ja: 'お問い合わせ',
    zh: '联系方式',
  },
  greetingTitle: {
    ko: '기술로 성장하고\n문제를 해결하는 개발자\n이재권입니다.',
    en: 'Not fading away,\nYour presence\nDeepens over time',
    ja: '消えゆくのではなく、\nより深く刻まれゆく\nあなたの存在',
    zh: '不是渐渐褪色，\n而是愈发深刻地\n铭记你的存在',
  },
  greetingDescription: {
    ko: '빠르게 변하는 시대 속에서도\n신뢰와 협업을 최우선으로\n\n팀과의 소통과 책임감을 바탕으로\n성실하게 가치를 만드는\n개발자입니다.',
    en: 'Even in the AI era where human dignity is threatened,\nyour story will never fade.\n\nInnoCard makes your value clearer\nand more memorable for longer.',
    ja: '人間の尊厳が脅かされるAI時代でも、\nあなたの物語は決して薄れることはありません。\n\nInnoCardで、あなたの価値を\nより鮮明に、より永く心に刻みます。',
    zh: '即使在人类尊严受到威胁的AI时代，\n你的故事也永远不会褪色。\n\nInnoCard让你的价值\n更清晰，更持久地铭记于心。',
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
    ko: '안녕하세요! 저는 이재권 입니다. 무엇을 도와드릴까요?',
    en: 'Hello! I am Jeong Inno. How can I help you?',
    ja: 'こんにちは！イノと申します。何かお手伝いできることはありますか？',
    zh: '你好！我是Jeong Inno。我能为您做些什么？'
  },
  cloneGreeting: {
    ko: "안녕하세요! 저는 이재권 입니다. 무엇을 도와드릴까요?",
    en: "Hello! I am Jae-kwon Lee. How can I help you?",
    ja: "こんにちは！私は李一権です。どのようにお手伝いできますか？",
    zh: "你好！我是李一権。我能为您做些什么？"
  },
  formEmail: {
    ko: '이메일',
    en: 'Email',
    ja: 'メール',
    zh: '电子邮件',
  },
  formEmailPlaceholder: {
    ko: '이메일을 입력하세요',
    en: 'Enter your email',
    ja: 'メールアドレスを入力してください',
    zh: '请输入电子邮件',
  },
  greetingScript: {
    ko: '안녕하세요!\n저는 이노카드 템플릿용으로 특별히 제작된 이노입니다.\n\n오늘 여러분께 인사드리게 되어 정말 기쁩니다.\n이 영상은 저희의 인사 영상 예시 자료로,\n이노카드 템플릿이 어떻게 여러분의 메시지를 멋지게\n전달할 수 있는지 보여드리기 위해 준비되었습니다.\n\n함께 새로운 경험을 시작해 보시길 바랍니다.\n감사합니다.',
    en: 'nice to meet you!\nI am Inno, specially created for the InoCard template.\n\nI\'m delighted to greet you today.\nThis video serves as a sample for our greeting video,\ndemonstrating how the InoCard template\ncan beautifully convey your message.\n\nI hope you\'ll join us in experiencing something new.\nThank you!',
    ja: 'こんにちは！\n私はイノカードのテンプレート用に特別に作られたイノです\n\n今日\n皆さんにご挨拶できることをとても嬉しく思います。\nこの動画は、イノカードのテンプレートがどのようにあなたのメッセージを美しく伝えることができるかを示すための挨拶動画のサンプルです。\n\nぜひ、新しい体験を一緒に始めてみましょう。\nありがとうございます',
    zh: '你好！\n我是为 InnoCard 模板特别制作的 Ino。\n\n今天很高兴能向大家问好。\n这段视频是我们的问候视频示例，\n展示 InnoCard 模板如何优雅地传达您的信息。\n\n希望您能与我们一起开启新的体验。\n谢谢！'
  },
  affiliations_1: {
    ko: '현재 구직중',
    en: 'Currently Job Seeking',
    ja: '現在求職中',
    zh: '目前求职中'
  },
  affiliations_2: {
    ko: '열심히 하겠습니다.',
    en: 'I will work hard.',
    ja: '頑張ります。',
    zh: '我会努力。'
  },
  linkCopied: {
    ko: '링크가 복사되었습니다',
    en: 'Link copied to clipboard',
    ja: 'リンクがコピーされました',
    zh: '链接已复制'
  },
  voiceChat: {
    ko: '음성 대화',
    en: 'Voice Chat',
    ja: '音声チャット',
    zh: '语音聊天',
  },
  listenAudio: {
    ko: '음성으로 듣기',
    en: 'Listen to Audio',
    ja: '音声で聞く',
    zh: '语音播放',
  },
  voiceInput: {
    ko: '음성 입력',
    en: 'Voice Input',
    ja: '音声入力',
    zh: '语音输入',
  },
  clearChat: {
    ko: '채팅 내역 비우기',
    en: 'Clear Chat History',
    ja: 'チャット履歴をクリア',
    zh: '清除聊天记录',
  },
  stopRecording: {
    ko: '녹음 중지',
    en: 'Stop Recording',
    ja: '録音を停止',
    zh: '停止录音',
  },
  backToChat: {
    ko: '채팅으로 돌아가기',
    en: 'Back to Chat',
    ja: 'チャットに戻る',
    zh: '返回聊天',
  },
};

// 음성 대화 페이지 설명 통합
export const voiceChatDescriptions: VoiceChatDescriptions = {
  recognizingVoice: {
    ko: '음성을 인식하고 있습니다...',
    en: 'Recognizing your voice...',
    ja: '音声を認識しています...',
    zh: '正在识别您的声音...',
  },
  pleaseSpeak: {
    ko: '말씀해 주세요',
    en: 'Please speak',
    ja: 'お話しください',
    zh: '请说话',
  },
  autoVoiceDetection: {
    ko: '자동으로 음성을 감지하여 대화합니다',
    en: 'Automatically detects voice for conversation',
    ja: '自動的に音声を検出して会話します',
    zh: '自动检测语音进行对话',
  },
  speakFreely: {
    ko: '자유롭게 말씀해주세요.\n자동으로 음성을 인식하여 대화를 시작합니다.',
    en: 'Speak freely.\nVoice will be automatically recognized\nto start the conversation.',
    ja: '自由に話してください。\n自動的に音声を認識して会話を始めます。',
    zh: '请自由发言。\n系统会自动识别语音并开始对话。',
  },
  startConversation: {
    ko: '대화 시작하기',
    en: 'Start Conversation',
    ja: '会話を始める',
    zh: '开始对话',
  },
  endConversation: {
    ko: '대화 종료하기',
    en: 'End Conversation',
    ja: '会話を終了する',
    zh: '结束对话',
  },
  iosPermission: {
    ko: 'iOS에서는 마이크 권한을 허용해야 합니다',
    en: 'Microphone permission is required on iOS',
    ja: 'iOSではマイクの権限を許可する必要があります',
    zh: '在iOS上需要麦克风权限',
  },
  androidPermission: {
    ko: '안드로이드에서는 마이크 권한을 허용해야 합니다',
    en: 'Microphone permission is required on Android',
    ja: 'Androidではマイクの権限を許可する必要があります',
    zh: '在Android上需要麦克风权限',
  },
  voiceChatTitle: {
    ko: '{name}과\n음성으로 대화해보세요',
    en: 'Voice chat with\n{name}',
    ja: '{name}と\n音声で会話してみましょう',
    zh: '与{name}\n进行语音对话',
  },
};

// MyValues 콘텐츠 데이터
export const valuesContent: ValuesContent = {
  intro: {
    ko: '기술로 문제를 해결하고, 함께 성장하는 개발자',
    en: 'A developer who solves problems with technology and grows together',
    ja: '技術で問題を解決し、一緒に成長する開発者',
    zh: '通过技术解决问题并共同成长的开发者',
  },
  example: {
    ko: '빠르게 변하는 환경 속에서, 최신 기술 트렌드와 표준을 이해하고 실무에 적용하는 능력은 저의 강점입니다. React·Next.js 기반의 프론트엔드, Spring Boot·Node.js 기반의 백엔드, 그리고 AWS·Supabase·Docker를 통한 클라우드 기반 CI/CD 환경을 구축하며 안정적이고 확장 가능한 서비스를 설계해 왔습니다.',
    en: 'In a rapidly changing environment, my ability to understand and apply the latest technology trends and standards to practical applications is my strength. I have built stable and scalable structures using various stacks such as React·Next.js-based frontend, Spring Boot·Node.js-based backend, and AWS·Supabase·Docker-based cloud-based CI/CD environment.',
    ja: '変化の激しい環境で、最新の技術トレンドや標準を理解し、実務に適用する能力は私の強みです。React·Next.jsベースのフロントエンド、Spring Boot·Node.jsベースのバックエンド、AWS·Supabase·Dockerを利用したクラウドベースのCI/CD環境など、さまざまなスタックを活用して、安定して拡張可能な構造を構築してきました。',
    zh: '在快速变化的环境中，我能够理解并应用最新的技术趋势和标准到实际应用中，这是我的一大优势。我利用各种栈，如React·Next.js基础的前端、Spring Boot·Node.js基础的、AWS·Supabase·Docker为基础的云端CI/CD环境等，构建了稳定且可扩展的结构。',
  },
  aiDescription: {
    ko: '저는 기술의 가치를 문제 해결과 성장의 연결점에서 찾습니다. 개발은 단순히 기능을 구현하는 일이 아니라, 사용자의 경험을 개선하고 조직의 효율을 높이는 과정이라고 생각합니다. 그래서 프로젝트를 진행할 때마다 문제의 본질을 분석하고, 가장 효율적인 기술로 해결책을 설계하는 데 집중합니다.',
    en: 'I find the value of technology in the connection between problem solving and growth. Development is not just about implementing features, but about improving user experience and organizational efficiency. That\'s why I focus on analyzing the essence of problems and designing the most efficient solutions using the best technologies whenever I work on projects.',
    ja: '開発は機能を実装するだけではなく、ユーザー体験を向上させ、組織の効率を高めることが重要です。そのため、プロジェクトを進めるたびに問題の本質を分析し、最も効率的なソリューションを設計するために、最高の技術を使用することに集中します。',
    zh: '开发不仅仅是实现功能，而是改善用户体验和提高组织效率。因此，在推进项目时，我会专注于分析问题的本质，并设计最有效的解决方案，使用最高效的技术。',
  },
  mission: {
   ko: '또한, AI 도구(Midjourney, ElevenLabs, n8n，Make 등)를 활용해 디자인·브랜딩·자동화 영역까지 통합적으로 접근하며, 개발 효율과 크리에이티브의 조화를 추구합니다. 단순히 코드를 작성하는 개발자가 아니라, 비즈니스 전반을 이해하고 기여할 수 있는 개발자로 성장하고자 합니다.',
   en: 'Furthermore, we utilize AI tools (Midjourney, ElevenLabs, n8n，Make, etc.) to integrate into the design, branding, and automation fields. We aim to grow into a developer who not only writes code but also understands and contributes to the entire business.',
   ja: 'さらに、AIツール（Midjourney, ElevenLabs n8n，Makeなど）を活用して、デザイン、ブランディング、自動化の分野に総合的にアプローチします。すべてのビジネスを理解し、貢献できる開発者に成長することを目指しています。',
   zh: '此外，我们利用AI工具（Midjourney，ElevenLabs，n8n，Make等）综合处理设计、品牌和自动化领域。我们致力于成长为不仅编写代码，而且理解并贡献于整个业务的全栈开发者。',
  },  
  vision1:{
    ko: '저의 비전은 명확합니다. “기술을 통해 조직과 개인이 함께 성장할 수 있는 생태계를 만드는 것.” 이를 위해 끊임없이 배우고, 시스템을 개선하며, 데이터를 기반으로 더 나은 방향을 제시하는 개발자가 되겠습니다.',
    en: 'My vision is clear. "Creating an ecosystem where organizations and individuals can grow together through technology." To achieve this, I will continue to learn, improve systems, and provide better directions based on data.',
    ja: '私のビジョンは明確です。「技術を通じて組織と個人が一緒に成長できるエコシステムを作ること。」これを実現するために、私は常に学び、システムを改善し、データに基づいてより良い方向を提供します。',
    zh: '我的愿景很明确。“通过技术创造一个组织和个人可以共同成长的生态系统。”为了实现这一目标，我将不断学习，改进系统，并基于数据提供更好的方向。',
  },
  vision2:{
    ko: '저는 기술로 세상을 단순하게 만들고, 협업으로 더 큰 가치를 창출하는 개발자를 지향합니다.',
    en: 'I aim to be a developer who simplifies the world through technology and creates greater value through collaboration.',
    ja: '私は技術で世界をシンプルにし、協力でより大きな価値を生み出す開発者を目指しています。',
    zh: '我致力于通过技术简化世界，并通过协作创造更大的价值。',
  },

  thanks: {
    ko: '감사합니다.',
    en: 'Thank you.',
    ja: 'ありがとうございます。',
    zh: '谢谢。',
  },
};

// Posts 데이터
export const postsData: PostsData = {
  post1: {
    id: 1,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AF%B8%EB%9E%98%EC%A0%84%EB%9E%B5%ED%8F%AC%EB%9F%BC.jpg-lobjD33dLn9HHvFaqwYC57KhFIHDJb.jpeg',
    title: {
      ko: '(사)대한청년을세계로\n미래전략포럼 개최',
      en: 'Future Strategy Forum held by\nKorean Youth to the World Association',
      ja: '(社)大韓青年を世界へ\n未来戦略フォーラム開催',
      zh: '(社)韩国青年走向世界\n举办未来战略论坛',
    },
    description: {
      ko: '기술혁신의 시대속에서 청년들의 미래를 위한 전략을 논의하는 포럼을 개최합니다.',
      en: 'Hosting a forum to discuss strategies for the future of youth in the era of technological innovation.',
      ja: '技術革新の時代における若者の未来のための戦略を議論するフォーラムを開催します。',
      zh: '举办论坛，讨论技术创新时代青年未来的战略。',
    },
    tags: {
      ko: ['#청년미래', '#기술혁신', '#전략포럼', '#글로벌비전'],
      en: ['#YouthFuture', '#TechInnovation', '#StrategyForum', '#GlobalVision'],
      ja: ['#青年未来', '#技術革新', '#戦略フォーラム', '#グローバルビジョン'],
      zh: ['#青年未来', '#技术创新', '#战略论坛', '#全球愿景']
    }
  },
  post2: {
    id: 2,
    image: '/og-image.png',
    title: {
      ko: '이노커브 InnoCard',
      en: 'Innocurve InnoCard',
      ja: 'イノカーブ InnoCard',
      zh: 'InnoCurve InnoCard',
    },
    description: {
      ko: '종이 명함을 넘어 자신만의 웹사이트로 나를 표현하고, 연결하며, 확장할 수 있는 AI 전자명함 서비스를 소개합니다. 당신의 이야기를 담고, 네트워크를 스마트하게 이어주는 디지털 공간을 만나보세요.',
      en: 'Introducing AI digital business cards that go beyond paper, allowing you to express, connect, and expand through your own website. Discover a digital space that holds your story and smartly connects your network.',
      ja: '紙の名刺を超え、自分だけのウェブサイトで自己表現、つながり、拡張できるAIデジタル名刺サービスをご紹介します。あなたのストーリーを込め、ネットワークをスマートにつなぐデジタル空間をご体験ください。',
      zh: '介绍一款超越纸质名片的AI电子名片服务，您可以通过自己的网站来表达、连接和扩展自己。探索一个承载您的故事并智能连接您的网络的数字空间。',
    },
    tags: {
      ko: ['#전자명함', '#개인브랜딩', '#네트워크확장', '#AI솔루션'],
      en: ['#DigitalCard', '#PersonalBranding', '#NetworkExpansion', '#AISolution'],
      ja: ['#デジタル名刺', '#個人ブランディング', '#ネットワーク拡張', '#AIソリューション'],
      zh: ['#电子名片', '#个人品牌', '#网络扩展', '#AI解决方案']
    }
  },
  post3: {
    id: 3,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INNOCURVE-UEJ6P4SmjI6dvCbd6jXEsOFWMdMjqW.png',
    title: {
      ko: '이노커브 AIConnect',
      en: 'Innocurve AIConnect',
      ja: 'イノカーブ AIConnect',
      zh: 'InnoCurve AIConnect',
    },
    description: {
      ko: '기술 발전의 혜택을 누구나 누릴 수 있도록, 각 산업별 맞춤형 AI 컨설팅과 최적화된 솔루션을 제공합니다.',
      en: 'We provide customized AI consulting and optimized solutions for each industry to ensure everyone can enjoy the benefits of technological advancement.',
      ja: '技術発展の恩恵を誰もが享受できるよう、各産業別にカスタマイズされたAIコンサルティングと最適化されたソリューションを提供します。',
      zh: '我们为各个行业提供定制的AI咨询和优化的解决方案，以确保每个人都能享受到技术进步的益处。',
    },
    tags: {
      ko: ['#AI컨설팅', '#맞춤형솔루션', '#기술혁신', '#산업최적화'],
      en: ['#AIConsulting', '#CustomSolutions', '#TechInnovation', '#IndustryOptimization'],
      ja: ['#AIコンサルティング', '#カスタマイズソリューション', '#技術革新', '#産業最適化'],
      zh: ['#AI咨询', '#定制解决方案', '#技术创新', '#产业优化']
    }
  },
  post4: {
    id: 4,
    image: '/postimage/id4image.png',
    images: [
      '/postimage/id4image2.png',
      '/postimage/id4image3.png',
      '/postimage/id4image4.png',
      '/postimage/id4image5.png',
      '/postimage/id4image6.png',
      '/postimage/id4image7.png',
      '/postimage/id4image8.png',
      '/postimage/id4image9.png'
    ],
    title: {
      ko: '이노커브 마케팅',
      en: 'Innocurve Marketing',
      ja: 'イノカーブマーケティング',
      zh: 'InnoCurve营销',
    },
    description: {
      ko: 'AI를 활용한 홈페이지, 이미지, 영상 등 다양한 디지털 콘텐츠 제작을 통해 비용은 효율적으로 절감하고, 최상의 퀄리티로 효과적인 홍보를 지원합니다.',
      en: 'We support effective promotion with top quality while efficiently reducing costs through the production of various digital content such as AI-powered websites, images, and videos.',
      ja: 'AIを活用したホームページ、画像、動画など、さまざまなデジタルコンテンツの制作を通じてコストを効率的に削減し、最高の品質で効果的なプロモーションをサポートします。',
      zh: '通过制作AI驱动的网站、图像和视频等各种数字内容，有效降低成本，并以最高质量支持有效的推广。',
    },
    tags: {
      ko: ['#AI마케팅', '#디지털콘텐츠', '#비용효율화', '#퀄리티향상'],
      en: ['#AIMarketing', '#DigitalContent', '#CostEfficiency', '#QualityImprovement'],
      ja: ['#AIマーケティング', '#デジタルコンテンツ', '#コスト効率化', '#品質向上'],
      zh: ['#AI营销', '#数字内容', '#成本效率', '#质量提升']
    }
  }
};

// 음성 대화 페이지 설명을 위한 번역 함수
export function translateVoiceChat(key: VoiceChatDescriptionKey, lang: Language): string {
  try {
    return voiceChatDescriptions[key][lang] || voiceChatDescriptions[key]['ko'] || key;
  } catch (error) {
    console.error(`Voice chat translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}

// Values 콘텐츠를 위한 번역 함수
export function translateValues(key: ValuesContentKey, lang: Language): string {
  try {
    return valuesContent[key][lang] || valuesContent[key]['ko'] || key;
  } catch (error) {
    console.error(`Values translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}

// Posts 데이터를 배열로 변환하는 함수
export function getPostsArray() {
  return Object.values(postsData);
}

// 특정 Post를 가져오는 함수
export function getPost(postKey: PostKey) {
  return postsData[postKey];
}

export function translate(key: TranslationKey, lang: Language): string {
  try {
    const translation = translations[key]?.[lang] ?? translations[key]?.['ko'] ?? key;
    return translation || key;
  } catch (error) {
    console.error(`Translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}
