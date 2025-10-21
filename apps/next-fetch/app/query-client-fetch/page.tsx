/**
 * App router와 tanstack-query
 */
import Link from "next/link";
import { PostsList } from "./_components/post-list";
import { CommentsList } from "./_components/comment-list";

export default function TanStackPage() {
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
          TanStack Query
        </h1>
        <div className="inline-block px-4 py-2 bg-[#F0F4FF] rounded-lg text-xl font-bold text-[#3182F6] font-mono">
          첫방문 3초 • 재방문 0초
        </div>
      </div>

      {/* 설명 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          클라이언트 캐싱
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3 bg-orange-50 rounded-lg text-sm text-[#4E5968]">
            <div className="font-semibold mb-1 text-orange-600">첫 방문</div>
            클라이언트에서 fetch → 3초 대기 → 캐시 저장
          </div>

          <div className="p-3 bg-green-50 rounded-lg text-sm text-[#4E5968]">
            <div className="font-semibold mb-1 text-green-600">
              재방문 (핵심!)
            </div>
            캐시 사용 → 즉시 표시 (0초)
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <PostsList />
        <CommentsList />
      </div>

      <div className="mt-4 p-4 bg-[#F0F4FF] rounded-lg text-sm text-[#3182F6] text-center font-semibold">
        💡 메인 페이지로 돌아갔다가 다시 방문해보세요!
      </div>
    </div>
  );
}
