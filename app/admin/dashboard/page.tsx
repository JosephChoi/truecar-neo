"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReviewService } from '@/lib/firestore-utils';

interface ViewsStats {
  totalViews: number;
  reviewCount: number;
  avgViews: number;
  maxViews: number;
  minViews: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [viewsStats, setViewsStats] = useState<ViewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 리뷰 목록과 조회수 통계를 동시에 가져오기
        const [reviewResult, statsResult] = await Promise.all([
          ReviewService.getAllReviews(50), // 더 많은 리뷰 가져오기
          ReviewService.getViewsStats()
        ]);
        
        setReviews(reviewResult.reviews || []);
        setViewsStats(statsResult);
      } catch (err) {
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await ReviewService.deleteReview(id);
        setReviews(reviews.filter(review => review.id !== id));
        
        // 삭제 후 통계 업데이트
        const updatedStats = await ReviewService.getViewsStats();
        setViewsStats(updatedStats);
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return '-';
    if (dateString.toDate) {
      return dateString.toDate().toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <Button onClick={() => router.push("/admin/reviews/new")}>새 리뷰 작성</Button>
          </div>

          {/* 조회수 통계 카드들 */}
          {viewsStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 조회수</p>
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(viewsStats.totalViews)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 리뷰 수</p>
                    <p className="text-2xl font-bold text-green-600">{formatNumber(viewsStats.reviewCount)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">평균 조회수</p>
                    <p className="text-2xl font-bold text-purple-600">{formatNumber(viewsStats.avgViews)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">최고 조회수</p>
                    <p className="text-2xl font-bold text-orange-600">{formatNumber(viewsStats.maxViews)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">최저 조회수</p>
                    <p className="text-2xl font-bold text-red-600">{formatNumber(viewsStats.minViews)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">{error}</div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">리뷰 목록 ({reviews.length}개)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <Link href={`/review/${review.id}`} className="hover:text-blue-600 hover:underline">
                            <div className="max-w-xs truncate">{review.title}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {review.author || '익명'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatNumber(review.views || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            review.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {review.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/reviews/edit/${review.id}`)}>
                              수정
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
                              삭제
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 