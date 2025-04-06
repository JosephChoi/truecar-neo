"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
  imageUrl?: string;
}

interface ReviewFormData {
  title: string;
  content: string;
  author: string;
  date: string;
  hasOrderDetail: boolean;
  orderDetail?: OrderDetail;
}

interface ReviewFormProps {
  initialData?: ReviewFormData;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
}

export default function ReviewForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: ReviewFormProps) {
  const [hasOrderDetail, setHasOrderDetail] = useState(
    initialData?.hasOrderDetail || false
  );

  const defaultValues: ReviewFormData = {
    title: initialData?.title || "",
    content: initialData?.content || "",
    author: initialData?.author || "",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    hasOrderDetail: initialData?.hasOrderDetail || false,
    orderDetail: initialData?.orderDetail || {
      vehicleType: "",
      budget: "",
      mileage: "",
      preferredColor: "",
      repairHistory: "",
      referenceSite: "",
      imageUrl: ""
    }
  };

  const form = useForm<ReviewFormData>({
    defaultValues
  });

  const handleFormSubmit = (data: ReviewFormData) => {
    if (!hasOrderDetail) {
      delete data.orderDetail;
    }
    onSubmit(data);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">
          {initialData ? "리뷰 수정" : "새 리뷰 작성"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="리뷰 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>작성자</FormLabel>
                  <FormControl>
                    <Input placeholder="작성자 이름을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>작성일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="hasOrderDetail"
                  checked={hasOrderDetail}
                  onChange={(e) => setHasOrderDetail(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="hasOrderDetail">주문 내역 추가</Label>
              </div>

              {hasOrderDetail && (
                <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
                  <h2 className="text-lg font-semibold mb-2">주문 내역 정보</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="orderDetail.vehicleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>차종</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderDetail.budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>구매 예산</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderDetail.mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>주행거리</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderDetail.preferredColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>선호색상</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderDetail.repairHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>수리여부</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderDetail.referenceSite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>참고 타 사이트</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="orderDetail.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>차량 이미지 URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="이미지 URL을 입력하세요" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          차량 이미지의 URL을 입력하세요. 직접 업로드는 지원하지 않습니다.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="리뷰 내용을 입력하세요" 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
              <Button type="submit">
                {initialData ? "수정 완료" : "작성 완료"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 