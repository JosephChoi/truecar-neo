"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carModel: "",
    budget: "",
    mileage: "",
    preferredColor: "관계없음",
    repairHistory: "완전무사고차량",
    carUrl: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 제출 중 상태로 변경
    setIsSubmitting(true);
    setSubmitStatus({});
    
    try {
      // 구글 스프레드시트의 웹앱 URL
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbwb7veDwHZMRa7JuuPO97V2P5i36OD5R24kpF-XtOHi801WsnbjQ9x_seuS2Eh8BxQMcQ/exec";
      
      // 데이터 전송 방식 변경 - JSON을 문자열로 직접 전송
      const jsonData = JSON.stringify(formData);
      const data = new FormData();
      data.append('data', jsonData);
      
      // 데이터 전송 시도 (CORS 정책 문제로 iframe 방식 사용)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = googleScriptUrl;
      form.target = '_blank'; // 새 창에서 결과를 열지 않도록 숨겨진 iframe 사용
      
      // 히든 필드 추가
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'data';
      hiddenField.value = jsonData;
      form.appendChild(hiddenField);
      
      // iframe 생성 및 숨김
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      form.target = 'hidden_iframe';
      
      // 폼 제출
      document.body.appendChild(form);
      form.submit();
      
      // 폼과 iframe 제거
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 1000);
      
      // 성공 처리
      setSubmitStatus({
        success: true,
        message: "상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.",
      });
      
      // 모달 표시
      setShowModal(true);
      
      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        phone: "",
        carModel: "",
        budget: "",
        mileage: "",
        preferredColor: "관계없음",
        repairHistory: "완전무사고차량",
        carUrl: "",
        message: "",
      });
    } catch (error) {
      // 에러 처리
      console.error("주문 제출 오류:", error);
      setSubmitStatus({
        success: false,
        message: "서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
      // 에러 모달 표시
      setShowModal(true);
    } finally {
      // 제출 상태 종료
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border border-gray-200 shadow-xl overflow-hidden rounded-xl bg-white">
            <CardContent className="p-8">
              {/* 성공/실패 메시지 표시 */}
              {submitStatus.message && !showModal && (
                <div className={`mb-6 p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {submitStatus.message}
                </div>
              )}
              
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredColor" className="font-medium">선호하는 차량색상(외부)</Label>
                    <select
                      id="preferredColor"
                      name="preferredColor"
                      value={formData.preferredColor}
                      onChange={handleChange}
                      className="h-12 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3"
                    >
                      <option value="흰색">흰색</option>
                      <option value="검정색">검정색</option>
                      <option value="은색(회색)">은색(회색)</option>
                      <option value="파란색(남색)">파란색(남색)</option>
                      <option value="관계없음">관계없음</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="repairHistory" className="font-medium">단순수리여부</Label>
                    <select
                      id="repairHistory"
                      name="repairHistory"
                      value={formData.repairHistory}
                      onChange={handleChange}
                      className="h-12 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3"
                    >
                      <option value="완전무사고차량">완전무사고차량</option>
                      <option value="단순교환(볼트체결부품)">단순교환(볼트체결부품)</option>
                      <option value="관계없음">관계없음</option>
                    </select>
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
                
                <div className="text-center pt-4 space-y-4">
                  <p className="text-gray-600 text-sm">
                    ※ 차량신청 후 3일 이내에 전문상담사의 확인 전화가 있을 예정입니다.
                  </p>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto px-12 py-6 h-auto text-lg font-medium bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "처리 중..." : "차량 주문하기"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 결과 모달 - 별도 렌더링하여 DOM 중첩 오류 방지 */}
      {typeof window !== 'undefined' && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  {submitStatus.success ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <span>주문 신청 완료</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-500" />
                      <span>오류가 발생했습니다</span>
                    </>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {submitStatus.success ? (
                <div className="space-y-3">
                  <p>고객님의 주문 신청이 성공적으로 접수되었습니다.</p>
                  <p>3일 이내에 트루카의 전문 상담사가 연락드릴 예정입니다.</p>
                  <p>입력하신 이메일 주소로 주문 확인 메일이 발송되었습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>주문 처리 중 오류가 발생했습니다.</p>
                  <p>잠시 후 다시 시도하시거나, 고객센터로 문의해 주세요.</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto"
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
} 