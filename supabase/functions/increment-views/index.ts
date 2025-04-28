import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // OPTIONS preflight 요청 처리 (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // POST 요청에서 reviewId 추출
  const { reviewId } = await req.json();

  console.log("SUPABASE_URL:", Deno.env.get("SUPABASE_URL"));
  console.log("SUPABASE_SERVICE_ROLE_KEY:", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  console.log("reviewId:", reviewId);

  // 서비스 키로 supabase 클라이언트 생성 (엣지 펑션 환경변수 사용)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error: fetchError } = await supabase
    .from("reviews")
    .select("views")
    .eq("id", reviewId)
    .single();

  if (fetchError) {
    // 에러 처리
  }

  const { error } = await supabase
    .from("reviews")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", reviewId);

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
});