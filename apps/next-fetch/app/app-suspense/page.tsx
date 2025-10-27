/**
 * App router + suspense
 */
import { Suspense } from "react";
import { fetchPosts, fetchComments, fetchUser } from "@/lib/apis";
import Link from "next/link";

async function UserSection() {
  const user = await fetchUser();

  return (
    <div className="bg-white border border-[#E5E8EB] rounded-xl p-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-base font-semibold text-[#191F28]">User</div>
        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-semibold">
          {(user.loadTime / 1000).toFixed(1)}s
        </div>
      </div>
      <div className="text-sm text-[#4E5968]">{user.name}</div>
    </div>
  );
}

async function PostsSection() {
  const posts = await fetchPosts();

  return (
    <div className="bg-white border border-[#E5E8EB] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-semibold text-[#191F28]">
          Posts ({posts.length})
        </div>
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-semibold">
          {posts[0]?.loadTime ? (posts[0]?.loadTime / 1000).toFixed(1) : 0}s
        </div>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="mb-3 pb-3 border-b border-[#F2F4F6]">
          <div className="text-sm font-semibold mb-1 text-[#191F28]">
            {post.title}
          </div>
          <div className="text-xs text-[#8B95A1]">{post.body}</div>
        </div>
      ))}
    </div>
  );
}

async function CommentsSection() {
  const comments = await fetchComments();

  return (
    <div className="bg-white border border-[#E5E8EB] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-semibold text-[#191F28]">
          Comments ({comments.length})
        </div>
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded font-semibold">
          {comments[0]?.loadTime
            ? (comments[0]?.loadTime / 1000).toFixed(1)
            : 0}
          s
        </div>
      </div>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2 text-sm text-[#4E5968]">
          {comment.text}
        </div>
      ))}
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

export default function AppRouterSuspense() {
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
          App Router + Suspense
        </h1>
        <div className="inline-block px-4 py-2 bg-green-50 rounded-lg text-xl font-bold text-green-600 font-mono">
          ~3초 (병렬)
        </div>
      </div>

      {/* 타임라인 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          병렬 실행 + 스트리밍
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">User</div>
            <div className="w-1/3 h-8 bg-green-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]">
              1s
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">Comments</div>
            <div className="w-2/3 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]">
              2s
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">Posts</div>
            <div className="w-full h-8 bg-blue-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]">
              3s
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-600 text-center font-semibold">
          동시 실행 → 가장 느린 것 기준 3초!
        </div>
      </div>

      {/* 데이터 섹션들 */}
      <div className="flex flex-col gap-4">
        <Suspense fallback={<LoadingSkeleton label="Comments" />}>
          <CommentsSection />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton label="Posts" />}>
          <PostsSection />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton label="User" />}>
          <UserSection />
        </Suspense>
      </div>
    </div>
  );
}
