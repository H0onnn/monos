/**
 * App router RSC basic fetch
 */
import { fetchPosts, fetchComments, fetchUser } from "@/lib/apis";
import Link from "next/link";

export default async function AppRouterBasic() {
  const startTime = Date.now();

  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  const totalLoadTime = Date.now() - startTime;

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
          App Router Basic
        </h1>
        <div className="inline-block px-4 py-2 bg-orange-50 rounded-lg text-xl font-bold text-orange-600 font-mono">
          {(totalLoadTime / 1000).toFixed(2)}초 소요
        </div>
      </div>

      {/* 타임라인 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          순차 실행 (Waterfall)
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">User</div>
            <div
              className="h-8 bg-green-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]"
              style={{ width: `${(user.loadTime / totalLoadTime) * 100}%` }}
            >
              {(user.loadTime / 1000).toFixed(1)}s
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">Posts</div>
            <div
              className="h-8 bg-blue-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]"
              style={{
                width: `${posts?.[0]?.loadTime && totalLoadTime ? (posts[0].loadTime / totalLoadTime) * 100 : 0}%`,
              }}
            >
              {posts?.[0]?.loadTime
                ? (posts[0].loadTime / 1000).toFixed(1)
                : "-"}
              s
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[80px] text-sm text-[#8B95A1]">Comments</div>
            <div
              className="h-8 bg-orange-500 rounded-md flex items-center justify-center text-white text-sm font-semibold min-w-[60px]"
              style={{
                width: `${comments?.[0]?.loadTime && totalLoadTime ? (comments[0].loadTime / totalLoadTime) * 100 : 0}%`,
              }}
            >
              {comments?.[0]?.loadTime
                ? (comments[0].loadTime / 1000).toFixed(1)
                : "-"}
              s
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-orange-50 rounded-lg text-sm text-orange-600 text-center font-semibold">
          async/await 사용해도 순차 실행되면 느려요
        </div>
      </div>

      {/* 데이터 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">User</div>
        <div className="text-sm text-[#4E5968]">{user.name}</div>
      </div>

      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          Posts ({posts.length})
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

      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          Comments ({comments.length})
        </div>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-2 text-sm text-[#4E5968]">
            {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
}
