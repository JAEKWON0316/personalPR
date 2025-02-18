'use client'

import { useState } from 'react'
import { Language, translate } from '../utils/translations'
import SophisticatedButton from './SophisticatedButton'

interface MyValuesProps {
  language: Language
}

const MyValues: React.FC<MyValuesProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const content = {
    ko: [
      translate('valuesDescription', language),
      "인류 역사의 전환점에는 두 가지 도구가 있습니다. 고대의 인류에게 신이 선사한 불은 단순한 자연의 현상을 넘어, 생존과 문명의 초석이 되었습니다. 불은 어둠을 밝히고 추위를 물리치며, 날것의 음식을 조리 가능한 형태로 변화시켜 우리 몸과 두뇌가 한층 발전할 수 있는 환경을 마련했습니다. 그리하여 불은 단순한 자연의 힘을 인간의 창의력과 결합시켜 금속 가공, 도자기 제작, 농업 혁신 등 다양한 분야에서 문명의 씨앗 역할을 했습니다.",
      "오늘날, 인류는 스스로 창조해낸 도구인 인공지능(AI)으로 새로운 시대를 열고 있습니다. AI는 방대한 데이터를 실시간으로 분석하며, 이를 토대로 금융, 의료, 제조업 등 수많은 산업 분야에서 최적의 의사결정을 돕고 있습니다. 또한, AI는 예술과 문학 같은 창의적 영역에서도 인간과 함께 협업하여 전례 없는 혁신을 이끌고 있습니다. 이처럼 AI는 인간의 한계를 극복하고, 미래 사회의 경쟁력을 좌우하는 강력한 도구로 자리 잡았습니다.",
      "불이 인류에게 생명의 불씨를 제공했다면, AI는 현대 사회에 새로운 생명의 기운을 불어넣고 있습니다. 두 도구 모두 각자의 시대에서 혁신의 상징이자, 인간이 한계에 도전하고 미래를 개척하는 원동력으로 작용해왔습니다. 오늘날 우리는 과거의 불처럼, AI를 통해 더 나은 세상을 꿈꾸며, 그 속에서 윤리와 책임의 가치를 함께 고민해야 합니다.",
      "이처럼, 신이 만든 최고의 도구인 불과 인류가 창조한 최고의 도구인 AI는 각각 우리에게 생존의 터전과 미래의 가능성을 열어준 귀중한 선물입니다. 두 도구가 보여준 혁신과 진보의 이야기는 앞으로도 인류가 무한한 가능성에 도전하는 데 있어 영원한 영감의 원천이 될 것입니다."
    ],
    en: [
      translate('valuesDescription', language),
      "At Clean Air, we prioritize our customers' health and safety. While air conditioners are essential appliances we use daily, if not properly maintained, they can accumulate bacteria, mold, and fine dust that seriously affect health. To address this, we always provide the highest quality cleaning services to help our customers maintain a more comfortable and healthy environment.",
      "Our core values are honesty and trust. We provide transparent services to our customers, explain in detail what work has been done after cleaning, and consider it important to maintain long-term relationships based on trust. Additionally, we focus on providing efficient services using the latest technology.",
      "We also value sustainability. By using eco-friendly cleaning methods and products that consider the environment, we strive to not only satisfy our customers but also contribute to the global environment. As a member of the local community, we fulfill our social responsibilities and, as the chairman of the Saemaul Youth Association, work towards regional development. Clean Air continuously grows for our customers' happiness and health, striving to become a company that works for a better tomorrow.",
      "Thank you."
    ],
    ja: [
      translate('valuesDescription', language),
      "クリーンエアは、お客様の健康と安全を最優先に考えています。エアコンは私たちが毎日使用する必需品ですが、適切に管理されないと、細菌、カビ、微細粉塵が蓄積され、健康に深刻な影響を及ぼす可能性があります。これを解決するため、私たちは常に最高品質の洗浄サービスを提供し、お客様がより快適で健康的な環境で生活できるようサポートしています。",
      "私たちの核心的価値は誠実と信頼です。お客様に常に透明性のあるサービスを提供し、洗浄後にはどのような作業が行われたのか詳しく説明し、信頼を基に長期的な関係を維持することを重要視しています。また、最新技術を活用して効率的なサービスを提供することに注力しています。",
      "また、持続可能性も重視しています。環境に配慮した環境にやさしい洗浄方法と製品を使用し、お客様にご満足いただくだけでなく、地球環境にも貢献できるよう最善を尽くしています。地域社会の一員として、社会的責任を果たし、セマウル会青年会長として地域発展にも力を入れています。クリーンエアはお客様の幸せと健康のために継続的に成長し、より良い明日のために努力する企業となります。",
      "ありがとうございます。"
    ],
    zh: [
      translate('valuesDescription', language),
      "在清洁空气，我们将客户的健康和安全放在首位。空调是我们每天使用的必需家电，但如果没有得到适当的维护，细菌、霉菌和微尘会积累，对健康造成严重影响。为了解决这个问题，我们始终提供最高质量的清洗服务，帮助客户维持更舒适、健康的环境。",
      "我们的核心价值观是诚实和信任。我们始终为客户提供透明的服务，在清洗后详细说明所完成的工作，并认为基于信任维持长期关系很重要。此外，我们专注于利用最新技术提供高效的服务。",
      "我们也重视可持续性。通过使用考虑环境的环保清洗方法和产品，我们不仅努力让客户满意，还为地球环境做出贡献。作为当地社区的一员，我们履行社会责任，作为新村会青年会长，也致力于地区发展。清洁空气为了客户的幸福和健康持续成长，努力成为为更好的明天而奋斗的企业。",
      "谢谢。"
    ]
  }

  const currentContent = content[language] ?? content['ko'] ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full">
        <div className="mb-6 relative px-10 py-6 flex flex-col items-center">
          <svg className="absolute top-0 left-0 w-12 h-12 text-gray-300 transform -translate-x-1/6 -translate-y-1/6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <h2 className="text-2xl sm:text-3xl relative z-10 text-center mb-6">
            {translate('valuesDescription', language).split('\n').map((line: string, i: number) => (
              <span key={i} className="block text-2xl sm:text-4xl font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
          <svg className="absolute bottom-0 right-0 w-12 h-12 text-gray-300 transform translate-x-1/6 translate-y-1/6 rotate-180" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <div className="space-y-4">
          {(isExpanded ? currentContent.slice(1) : currentContent.slice(1, 3)).map((paragraph, index) => (
            <p key={index} className="text-gray-600">{paragraph}</p>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <SophisticatedButton 
            expanded={isExpanded} 
            onClick={() => setIsExpanded(!isExpanded)} 
            language={language}
          />
        </div>
      </div>
    </div>
  )
}

export default MyValues