import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface SpecialistProps {
  name: string;
  role: string;
  quote: string;
  description: string;
  imageSrc: string;
}

function SpecialistCard({ name, role, quote, description, imageSrc }: SpecialistProps) {
  return (
    <Card className="overflow-hidden border-none shadow-xl flex flex-col items-center pt-10 pb-4">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
          <Image
            src={imageSrc}
            alt={name}
            width={144}
            height={144}
            className="rounded-full object-cover w-36 h-36"
          />
        </div>
        <div className="p-6 w-full flex flex-col items-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">{name}</h3>
          <p className="text-blue-600 font-medium mb-4 text-center">{role}</p>
          <div className="mb-4 bg-blue-50 p-4 rounded-lg w-full">
            <p className="text-gray-900 italic font-medium text-lg text-center">"{quote}"</p>
          </div>
          <p className="text-gray-700 text-center">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SpecialistTeam() {
  const specialists = [
    {
      name: "박배혁 대표",
      role: "CEO",
      quote: "내 가족을 위한 차라고 생각하면 그게 답이다",
      description: "항공사승무원, 호텔리어, 금융사 컨설턴트등 다양한 경력 소지자. 어떤 업종이든 고객의 입장에서 생각하는 것이 비지니스의 시작이라 생각합니다.",
      imageSrc: "/images/ceo1.jpg"
    },
    {
      name: "채기은 대표",
      role: "Co-CEO",
      quote: "세상에 구하지 못하는 중고차는 없다",
      description: "업계 경력 25년 단 한번의 계약 해지가 없는 무결점 거래 성사. 좋은 차를 구하는 것이 좋은 고객을 만드는 길이라 믿습니다.",
      imageSrc: "/images/ceo2.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
              OUR TEAM
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              TrueCar - Specialist
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              맞춤형 중고차 서비스를 만들어 낸 트루카만의 스페셜리스트를 소개합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {specialists.map((specialist, index) => (
              <SpecialistCard 
                key={index} 
                name={specialist.name}
                role={specialist.role}
                quote={specialist.quote}
                description={specialist.description}
                imageSrc={specialist.imageSrc}
              />
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              트루카의 전문가들은 20년 이상의 경력을 바탕으로<br/>
              고객님께 정직하고 신뢰할 수 있는 서비스를 제공하기 위해 노력하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 