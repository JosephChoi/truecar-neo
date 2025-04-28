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
  views?: number;
  imageUrl?: string;
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
  views = 0,
  imageUrl,
  orderDetail,
  isAdmin = false,
  onEdit,
  onDelete
}: ReviewDetailProps) {
  // 내용을 단락으로 분할
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  // 이미지 URL 결정 (리뷰 직접 이미지 또는 주문 내역 이미지)
  const displayImageUrl = imageUrl || orderDetail?.imageUrl;

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
            
            <div className="flex items-center mt-2 md:mt-0">
              <span className="text-gray-500">조회수: {views}</span>
              {isAdmin && (
                <div className="flex space-x-2 ml-4">
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
        </div>
        
        {/* 주문내역과 이미지를 좌우로 배치 (PC), 모바일에서는 세로 배치 */}
        <div className="flex flex-col md:flex-row border-b border-gray-200 pb-4 pt-3">
          {/* 주문내역 - 항상 먼저 표시 (모바일에서도 첫번째) */}
          {orderDetail && (
            <div className="w-full md:w-1/2 order-1 border border-gray-200 rounded-md overflow-hidden mx-6 md:ml-6 md:mr-3 mt-3">
              <div className="bg-gray-100 py-2 px-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">[ 주문내역 ]</h2>
              </div>
              <div className="bg-white">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">차종</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.vehicleType}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">구매 예산</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.budget}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">주행거리</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.mileage}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">선호색상</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.preferredColor}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">수리여부</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.repairHistory}</td>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold w-2/5">참고 타 사이트</th>
                      <td className="px-4 py-2 text-gray-900">{orderDetail.referenceSite}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* 이미지 - PC에서는 오른쪽, 모바일에서는 주문내역 아래 */}
          {displayImageUrl && (
            <div className="py-3 px-6 md:px-5 w-full md:w-1/2 order-2 flex items-center justify-center md:mr-6 md:ml-3 mt-4 md:mt-0">
              <div className="relative w-full h-72 md:h-80 rounded-lg overflow-hidden">
                <img 
                  src={displayImageUrl} 
                  alt={title}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* 본문 내용 */}
        <div className="p-6 md:p-8 mt-3">
          <div className="prose max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 