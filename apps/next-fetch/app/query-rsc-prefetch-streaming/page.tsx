/**
 * App router + tanstack-query prefetch + RSC + Streaming (Suspense)
 */
import Link from "next/link";
import { SuspensePrefetchBoundary } from "./_components/prefetch-boundary";
import { PostList } from "./_components/post-list";
import { CommentsList } from "./_components/comment-list";
import { fetchComments, fetchPosts } from "@/lib/apis";

export default function StreamingFetchPage() {
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
          TanStack Query Prefetch + RSC + Streaming
        </h1>
      </div>

      {/* 설명 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          스트리밍 프리패치
        </div>

        <div className="p-3 bg-orange-50 rounded-lg text-sm text-[#4E5968]">
          <div className="font-semibold mb-1 text-orange-600">플로우</div>
          server prefetch →
        </div>
      </div>

      <SuspensePrefetchBoundary
        fallback={<LoadingSkeleton label="Posts" />}
        prefetchOptions={{ queryKey: ["posts"], queryFn: fetchPosts }}
      >
        <PostList />
      </SuspensePrefetchBoundary>

      <SuspensePrefetchBoundary
        fallback={<LoadingSkeleton label="Comments" />}
        prefetchOptions={{ queryKey: ["comments"], queryFn: fetchComments }}
      >
        <CommentsList />
      </SuspensePrefetchBoundary>
    </div>
  );
}

function LoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="bg-white border border-[#E5E8EB] rounded-xl p-6">
      <div className="text-base font-semibold text-[#8B95A1] mb-4">{label}</div>
      <div className="h-10 bg-gradient-to-r from-[#F2F4F6] via-[#E5E8EB] to-[#F2F4F6] bg-[length:200%_100%] rounded-lg" />
    </div>
  );
}
