"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
  imageUrl?: string;
}

interface ReviewDetailProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  orderDetail?: OrderDetail;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ReviewDetail({
  id,
  title,
  content,
  author,
  date,
  orderDetail,
  isAdmin = false,
  onEdit,
  onDelete
}: ReviewDetailProps) {
  // 내용을 단락으로 분할
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6">
        <Link 
          href="/review" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium text-gray-800">{author}</span>
              <span className="mx-2">•</span>
              <span>{date}</span>
            </div>
            
            {isAdmin && (
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onEdit}
                >
                  수정
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onDelete}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {orderDetail && (
          <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4">[ 주문내역 ]</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600 font-medium">차종</div>
                  <div className="text-gray-900">{orderDetail.vehicleType}</div>
                  
                  <div className="text-gray-600 font-medium">구매 예산</div>
                  <div className="text-gray-900">{orderDetail.budget}</div>
                  
                  <div className="text-gray-600 font-medium">주행거리</div>
                  <div className="text-gray-900">{orderDetail.mileage}</div>
                  
                  <div className="text-gray-600 font-medium">선호색상</div>
                  <div className="text-gray-900">{orderDetail.preferredColor}</div>
                  
                  <div className="text-gray-600 font-medium">수리여부</div>
                  <div className="text-gray-900">{orderDetail.repairHistory}</div>
                  
                  <div className="text-gray-600 font-medium">참고 타 사이트</div>
                  <div className="text-gray-900">{orderDetail.referenceSite}</div>
                </div>
              </div>
              
              {orderDetail.imageUrl && (
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <img 
                    src={orderDetail.imageUrl} 
                    alt={orderDetail.vehicleType}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="prose max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <div className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-600">
            조회수: 8
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-blue-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 