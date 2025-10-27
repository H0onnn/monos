/**
 * App router + tanstack-query prefetch + RSC
 */
import Link from "next/link";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query";
import { fetchPosts, fetchComments } from "@/lib/apis";
import { PostList } from "./_components/post-list";
import { CommentsList } from "./_components/comment-list";

export default async function TanstackRSCPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
    }),
    queryClient.prefetchQuery({
      queryKey: ["comments"],
      queryFn: fetchComments,
    }),
  ]);

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <Link
        href="/"
        className="inline-block mb-6 text-[#3182F6] no-underline text-sm"
      >
        ← 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#191F28]">
          TanStack Query Prefetch + RSC
        </h1>
      </div>

      {/* 설명 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          서버 프리패치
        </div>

        <div className="p-3 bg-orange-50 rounded-lg text-sm text-[#4E5968]">
          <div className="font-semibold mb-1 text-orange-600">플로우</div>
          server prefetch → 캐시 저장 → 즉시 표시
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostList />
        <CommentsList />
      </HydrationBoundary>
    </div>
  );
}
