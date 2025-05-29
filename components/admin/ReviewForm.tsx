"use client";

import { useState, useRef, ChangeEvent } from "react";
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
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FirebaseStorageService } from '@/lib/firebase-storage-utils'
// Next.js Image 컴포넌트를 사용하지 않고 직접 참조하여 오류 발생
// import Image from "next/image";

// 최대 이미지 크기 (1MB)
const MAX_IMAGE_SIZE = 1024 * 1024;

interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
}

interface ReviewFormData {
  title: string;
  content: string;
  author: string;
  date: string;
  orderDetail: OrderDetail;
  imageUrl?: string; // 이미지 URL 필드 추가
}

interface ReviewFormProps {
  initialData?: ReviewFormData;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ReviewForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: ReviewFormProps) {
  // 이미지 관련 상태
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues: ReviewFormData = {
    title: initialData?.title || "",
    content: initialData?.content || "",
    author: initialData?.author || "",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    imageUrl: initialData?.imageUrl || "",
    orderDetail: {
      vehicleType: initialData?.orderDetail?.vehicleType || "",
      budget: initialData?.orderDetail?.budget || "",
      mileage: initialData?.orderDetail?.mileage || "",
      preferredColor: initialData?.orderDetail?.preferredColor || "",
      repairHistory: initialData?.orderDetail?.repairHistory || "",
      referenceSite: initialData?.orderDetail?.referenceSite || ""
    }
  };

  const form = useForm<ReviewFormData>({
    defaultValues
  });

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      // 이미지가 있으면 Firebase Storage에 업로드
      if (imagePreview && imagePreview.startsWith('data:')) {
        console.log('🔄 Firebase Storage에 이미지 업로드 중...')
        
        // Base64 데이터를 Blob으로 변환
        const base64Data = imagePreview.split(',')[1]
        const mimeType = imagePreview.split(',')[0].split(':')[1].split(';')[0]
        
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        
        // File 객체 생성
        const fileName = `review_${Date.now()}.jpg`
        const file = new File([blob], fileName, { type: mimeType })
        
        // Firebase Storage에 업로드
        const firebaseImageUrl = await FirebaseStorageService.uploadReviewImage(file)
        data.imageUrl = firebaseImageUrl
        
        console.log('✅ Firebase Storage 업로드 성공:', firebaseImageUrl)
      } else if (imagePreview) {
        // 이미 Firebase URL인 경우 (수정 시)
        data.imageUrl = imagePreview
      }
      
      onSubmit(data)
    } catch (error) {
      console.error('❌ 이미지 업로드 오류:', error)
      setImageError('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  };

  // 이미지 압축 함수
  const compressImage = (file: File, maxSize: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        // 브라우저 내장 Image 객체 사용 (next/image가 아님)
        const img = document.createElement('img');
        if (!event.target?.result) {
          reject(new Error('이미지를 읽을 수 없습니다'));
          return;
        }
        
        img.src = event.target.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 이미지 크기가 너무 큰 경우 비율 유지하여 더 많이 축소
          const MAX_WIDTH = 800; // 1200에서 800으로 감소
          const MAX_HEIGHT = 800; // 1200에서 800으로 감소
          
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
          
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas 컨텍스트를 생성할 수 없습니다'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // 품질 조정 (0.6 = 60% 품질로 감소)
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            
            // Base64 크기 대략 계산
            const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
            const approximateSize = (base64Length * 3) / 4;
            
            if (approximateSize > maxSize) {
              // 여전히 너무 크면 더 낮은 품질로 재압축 (0.3 = 30% 품질)
              resolve(canvas.toDataURL('image/jpeg', 0.3));
            } else {
              resolve(dataUrl);
            }
          } catch (error) {
            reject(new Error('이미지 압축 중 오류가 발생했습니다'));
          }
        };
        
        img.onerror = () => {
          reject(new Error('이미지 로드 실패'));
        };
      };
      
      reader.onerror = (error: ProgressEvent<FileReader>) => {
        reject(new Error('파일 읽기 실패'));
      };
    });
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        setImageError("파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        setImageError("이미지 파일만 업로드 가능합니다.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // 이미지 압축 (1MB 이하로)
      const compressedImage = await compressImage(file, MAX_IMAGE_SIZE);
      setImagePreview(compressedImage);
    } catch (error) {
      console.error("이미지 처리 오류:", error);
      setImageError("이미지 처리 중 오류가 발생했습니다. 다른 이미지로 시도해보세요.");
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

            {/* 이미지 업로드 영역 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-3">
                <FormLabel className="text-lg font-semibold">후기 이미지</FormLabel>
                <p className="text-sm text-gray-500">
                  JPG, PNG 형식의 이미지를 업로드하세요. (최대 10MB, 자동 압축됨)
                </p>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                    id="review-image"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    이미지 선택
                  </Button>
                  {imagePreview && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={handleRemoveImage}
                    >
                      이미지 제거
                    </Button>
                  )}
                </div>

                {/* 이미지 오류 표시 */}
                {imageError && (
                  <p className="text-sm text-red-500 mt-2">{imageError}</p>
                )}

                {/* 이미지 미리보기 */}
                {imagePreview && (
                  <div className="mt-4 relative w-full max-w-md">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="후기 이미지 미리보기" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 주문 내역 정보 - 항상 표시 (필수) */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold mb-2">주문 내역 정보</h2>
              <p className="text-sm text-gray-500 mb-4">
                고객의 주문 내역 정보를 입력해주세요. 모든 형식의 입력이 가능합니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderDetail.vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>차종</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 현대 그랜저 IG 익스클루시브" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="예: 3500만원" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="예: 3만키로 이하" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="예: 화이트 또는 실버" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="예: 무사고 또는 단순교환" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="예: 엔카, 보배드림 등" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '처리 중...' : (initialData ? "수정 완료" : "작성 완료")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 