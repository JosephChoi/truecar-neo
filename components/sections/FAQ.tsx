"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  HandThumbUpIcon,
  ClockIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  DocumentIcon,
  FingerPrintIcon,
  KeyIcon,
  LightBulbIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  backgroundColor: string;
  borderColor: string;
  primaryColor: string;
  QuestionIcon: React.ElementType;
  AnswerIcon: React.ElementType;
}

export default function FAQ() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "허위매물이나 시세보다 비싸게 사게 되는 건 아닌가요?",
      answer: "절대 그렇지 않습니다! 트루카는 20년간 축적된 데이터를 기반으로 정확한 시세 분석과 함께 투명한 가격 정책을 제공합니다. 고객님께 항상 실제 시세보다 저렴한 가격으로 차량을 찾아드립니다.",
      backgroundColor: "bg-blue-50",
      borderColor: "border-blue-200",
      primaryColor: "text-blue-600",
      QuestionIcon: InformationCircleIcon,
      AnswerIcon: CheckCircleIcon
    },
    {
      id: 2,
      question: "타 사이트에서 본 차량을 샘플로 올리면 해당 차량을 구매하게 되는건가요?",
      answer: "꼭 그렇지는 않습니다. 타 사이트의 차량은 참고 사항으로만 활용되며, 트루카는 고객님의 요구 조건에 맞는 최적의 차량을 새롭게 찾아드립니다. 원하시는 차량과 비슷한 옵션과 조건으로 더 좋은 상태의 차량을 제안해 드립니다.",
      backgroundColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      primaryColor: "text-indigo-600",
      QuestionIcon: DocumentIcon,
      AnswerIcon: MagnifyingGlassIcon
    },
    {
      id: 3,
      question: "맞춤형 주문으로 구매 시 차량가격이 더 비싼가요?",
      answer: "아닙니다. 오히려 트루카의 맞춤형 주문은 중간 유통과정을 줄여 일반 시세보다 더 저렴한 가격으로 제공됩니다. 트루카는 고객님께 최적의 가격과 최상의 컨디션의 차량을 연결해 드리는 것을 목표로 합니다.",
      backgroundColor: "bg-purple-50",
      borderColor: "border-purple-200",
      primaryColor: "text-purple-600",
      QuestionIcon: CurrencyDollarIcon,
      AnswerIcon: LightBulbIcon
    },
    {
      id: 4,
      question: "주문 후 반드시 차량을 구매해야 하나요?",
      answer: "전혀 그렇지 않습니다. 트루카의 주문은 어떠한 구매 의무도 없습니다. 차량을 찾아드린 후 고객님께서 마음에 들지 않으시면 언제든지 거절하실 수 있습니다. 만족스러운 차량을 찾을 때까지 부담 없이 상담받으세요.",
      backgroundColor: "bg-sky-50",
      borderColor: "border-sky-200",
      primaryColor: "text-sky-600",
      QuestionIcon: ClipboardDocumentCheckIcon,
      AnswerIcon: HandThumbUpIcon
    },
    {
      id: 5,
      question: "주문을 하면 차량을 언제쯤 볼 수 있나요?",
      answer: "고객님의 요구 조건에 따라 다르지만, 일반적으로 주문 후 3~7일 내에 조건에 맞는 차량을 제안해 드립니다. 특별한 사양이나 희소성 높은 차량의 경우 더 오래 걸릴 수 있으나, 항상 진행 상황을 실시간으로 알려드립니다.",
      backgroundColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      primaryColor: "text-cyan-600",
      QuestionIcon: ClockIcon,
      AnswerIcon: TruckIcon
    },
    {
      id: 6,
      question: "차량 구매 후 문제가 생기면 어떻게 하나요?",
      answer: "트루카는 모든 차량에 대해 품질 보증을 제공합니다. 구매 후 발생하는 주요 기계적 문제에 대해서는 보증 기간 내 무상 수리를 지원해 드립니다. 20년간 단 한 건의 불만 접수가 없었던 트루카의 명성을 경험해보세요.",
      backgroundColor: "bg-teal-50",
      borderColor: "border-teal-200",
      primaryColor: "text-teal-600",
      QuestionIcon: WrenchScrewdriverIcon,
      AnswerIcon: ShieldCheckIcon
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">자주하는 질문</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="relative h-64 w-full perspective-1000 cursor-pointer"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onTouchStart={() => setHoveredCard(hoveredCard === item.id ? null : item.id)}
            >
              <motion.div
                className={`absolute inset-0 rounded-2xl ${item.backgroundColor} shadow-lg p-8 flex flex-col items-start justify-center backface-hidden border border-gray-100`}
                initial={false}
                animate={{
                  rotateY: hoveredCard === item.id ? 180 : 0,
                  opacity: hoveredCard === item.id ? 0 : 1
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className={`p-3 ${item.backgroundColor} rounded-full border-2 ${item.borderColor} mb-4`}>
                  <item.QuestionIcon className={`w-8 h-8 ${item.primaryColor}`} />
                </div>
                <p className="text-xl font-medium text-gray-800">
                  {item.question}
                </p>
                <div className="absolute bottom-4 right-4 opacity-20">
                  <QuestionMarkCircleIcon className="w-10 h-10 text-gray-400" />
                </div>
              </motion.div>
              
              <motion.div
                className={`absolute inset-0 rounded-2xl ${item.backgroundColor} shadow-lg p-8 flex flex-col items-start justify-center backface-hidden border border-gray-100`}
                initial={{ rotateY: -180 }}
                animate={{
                  rotateY: hoveredCard === item.id ? 0 : -180,
                  opacity: hoveredCard === item.id ? 1 : 0
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className={`p-3 ${item.backgroundColor} rounded-full border-2 ${item.borderColor} mb-4`}>
                  <item.AnswerIcon className={`w-8 h-8 ${item.primaryColor}`} />
                </div>
                <p className="text-base text-gray-700">
                  {item.answer}
                </p>
                <div className="absolute bottom-4 right-4 opacity-20">
                  <CheckCircleIcon className="w-10 h-10 text-gray-400" />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 