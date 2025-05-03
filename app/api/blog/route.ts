import { NextResponse } from 'next/server';
import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

// parseString을 Promise로 변환
const parseStringAsync = promisify(parseString);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get('blogId');
  
  if (!blogId) {
    return NextResponse.json(
      { error: 'blogId 매개변수가 필요합니다.' },
      { status: 400 }
    );
  }
  
  try {
    // 네이버 블로그 RSS URL
    const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`;
    
    // RSS 피드 가져오기
    const response = await axios.get(rssUrl);
    const xmlData = response.data;
    
    // XML 파싱 (타입 안전성을 위해 any 타입으로 처리)
    const result = await parseStringAsync(xmlData) as any;
    
    // 타입 안전하게 접근
    if (!result || !result.rss || !result.rss.channel || !Array.isArray(result.rss.channel) || !result.rss.channel[0].item) {
      throw new Error('RSS 피드 형식이 예상과 다릅니다.');
    }
    
    // 블로그 정보 추출
    const items = result.rss.channel[0].item;
    
    // 모든 포스트 반환
    const posts = items.map((item: any) => {
      // HTML 태그 제거 함수
      const stripHtml = (html: string) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
      };
      // 요약 텍스트 생성
      const rawDescription = item.description?.[0] || '';
      const cleanDescription = stripHtml(rawDescription);
      const summary = cleanDescription.length > 150 
        ? cleanDescription.substring(0, 150) + "..." 
        : cleanDescription;
      return {
        title: item.title?.[0] || '제목 없음',
        summary,
        date: item.pubDate?.[0] || new Date().toISOString(),
        link: item.link?.[0] || `https://blog.naver.com/${blogId}`
      };
    });
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('블로그 데이터 가져오기 오류:', error);
    return NextResponse.json(
      { error: '블로그 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 