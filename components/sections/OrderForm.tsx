"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carModel: "",
    budget: "",
    mileage: "",
    carUrl: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 폼 데이터를 처리하는 로직 추가
    console.log(formData);
    // 폼 제출 후 필요한 작업 수행
    alert("상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.");
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              맞춤 중고차 상담하기
            </h2>
            <p className="text-xl text-gray-700">
              원하시는 차량 정보를 입력해주시면<br />
              전문 상담사가 최적의 차량을 찾아드립니다
            </p>
          </div>
          
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">이름</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      required
                      className="h-12 rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">이메일</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="h-12 rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium">연락처</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      required
                      className="h-12 rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carModel" className="font-medium">희망 차종</Label>
                    <Input
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      placeholder="예: 그랜저 IG"
                      className="h-12 rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="font-medium">희망 가격대</Label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="예: 2000-2500만원"
                      className="h-12 rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mileage" className="font-medium">희망 주행거리</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="예: 5만km 이하"
                      className="h-12 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carUrl" className="font-medium">
                    다른 사이트에서 보신 차량이 있다면 URL을 입력해주세요
                  </Label>
                  <Input
                    id="carUrl"
                    name="carUrl"
                    value={formData.carUrl}
                    onChange={handleChange}
                    placeholder="예: https://www.encar.com/dc/dc_cardetailview.do?pageid=..."
                    className="h-12 rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium">추가 요청사항</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="추가적인 요청사항이 있으시면 자유롭게 작성해주세요."
                    rows={4}
                    className="min-h-[120px] rounded-md"
                  />
                </div>
                
                <div className="text-center pt-4">
                  <Button type="submit" size="lg" className="w-full md:w-auto px-12 py-6 h-auto text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                    무료 상담 신청하기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 