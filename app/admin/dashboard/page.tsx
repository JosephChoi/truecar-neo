"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError('리뷰 데이터를 불러오지 못했습니다.');
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (!error) {
        setReviews(reviews.filter(review => review.id !== id));
      } else {
        alert('삭제에 실패했습니다.');
      }
    }
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
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link href={`/review/${review.id}`} className="hover:text-blue-600 hover:underline">
                            {review.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.user_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.created_at?.slice(0, 10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/reviews/edit/${review.id}`)}>수정</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>삭제</Button>
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