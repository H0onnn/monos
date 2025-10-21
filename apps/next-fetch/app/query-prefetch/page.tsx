/**
 * App router + tanstack-query prefetch no RSC
 */
import Link from "next/link";
import { DataSection } from "./_components/data-section";

export default function TanStackPrefetchPage() {
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
          TanStack Query Prefetch
        </h1>
      </div>

      {/* 설명 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          프리패치
        </div>

        <div className="p-3 bg-orange-50 rounded-lg text-sm text-[#4E5968]">
          <div className="font-semibold mb-1 text-orange-600">플로우</div>
          prefetch → 캐시 저장 → 즉시 표시
        </div>
      </div>

      <DataSection />
    </div>
  );
}
