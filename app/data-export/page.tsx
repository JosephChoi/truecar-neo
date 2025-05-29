"use client";

import { useState } from "react";
import { ReviewService } from '@/lib/firestore-utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DataExportPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportFirebaseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Firebase 데이터 조회 시작...');
      
      // 리뷰 데이터 조회
      console.log('리뷰 데이터 조회 중...');
      try {
        const result = await ReviewService.getAllReviews();
        const reviewData = result.reviews;
        console.log('리뷰 데이터:', reviewData);
        setReviews(reviewData || []);
      } catch (reviewError: any) {
        console.error('리뷰 조회 오류:', reviewError);
        setError(`리뷰 조회 오류: ${reviewError.message}`);
      }
      
      // 관리자 사용자 데이터 조회
      console.log('관리자 데이터 조회 중...');
      try {
        const adminRef = collection(db, 'admin_users');
        const adminSnapshot = await getDocs(adminRef);
        const adminData = adminSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('관리자 데이터:', adminData);
        setAdminUsers(adminData || []);
      } catch (adminError: any) {
        console.error('관리자 조회 오류:', adminError);
        setError(prev => prev ? `${prev}, 관리자 조회 오류: ${adminError.message}` : `관리자 조회 오류: ${adminError.message}`);
      }
      
    } catch (err: any) {
      console.error('전체 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Firebase 데이터 내보내기
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={exportFirebaseData}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '데이터 조회 중...' : 'Firebase 데이터 조회'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 리뷰 데이터 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">리뷰 데이터 ({reviews.length}개)</h2>
            {reviews.length > 0 && (
              <button
                onClick={() => downloadJSON(reviews, 'firebase-reviews')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                JSON 다운로드
              </button>
            )}
          </div>
          
          {reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">차량 유형</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">생성일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.slice(0, 10).map((review, index) => (
                    <tr key={review.id || index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{review.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{review.author}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{review.vehicle_type}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {review.created_at?.toDate ? review.created_at.toDate().toLocaleString() : review.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reviews.length > 10 && (
                <p className="mt-2 text-sm text-gray-500">... 그 외 {reviews.length - 10}개 더</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">리뷰 데이터가 없습니다.</p>
          )}
        </div>

        {/* 관리자 데이터 섹션 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">관리자 데이터 ({adminUsers.length}개)</h2>
            {adminUsers.length > 0 && (
              <button
                onClick={() => downloadJSON(adminUsers, 'firebase-admin-users')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                JSON 다운로드
              </button>
            )}
          </div>
          
          {adminUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">생성일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminUsers.map((admin, index) => (
                    <tr key={admin.id || index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{admin.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {admin.created_at?.toDate ? admin.created_at.toDate().toLocaleString() : admin.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">관리자 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
} 