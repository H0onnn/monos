"use client";

import Link from "next/link";
import { fetchPosts, fetchComments } from "../lib/apis";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const [prefetchState, setPrefetchState] = useState<{
    loading: boolean;
    time: number;
    done: boolean;
  }>({ loading: false, time: 0, done: false });

  const [loadingPages, setLoadingPages] = useState<Record<string, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (prefetchState.loading) {
      const start = Date.now();
      interval = setInterval(() => {
        setPrefetchState((prev) => ({ ...prev, time: Date.now() - start }));
      }, 10);
    } else {
      setPrefetchState((prev) => ({ ...prev, time: 0 }));
    }
    return () => clearInterval(interval);
  }, [prefetchState.loading]);

  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    Object.keys(loadingPages).forEach((page) => {
      const start = Date.now();
      timers[page] = setInterval(() => {
        setLoadingPages((prev) => ({
          ...prev,
          [page]: Date.now() - start,
        }));
      }, 10);
    });

    return () => {
      Object.values(timers).forEach((timer) => clearInterval(timer));
    };
  }, [Object.keys(loadingPages).join(",")]);

  const handlePrefetch = async () => {
    if (prefetchState.loading || prefetchState.done) return;

    setPrefetchState({ loading: true, time: 0, done: false });

    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: fetchPosts }),
      queryClient.prefetchQuery({
        queryKey: ["comments"],
        queryFn: fetchComments,
      }),
    ]);

    setPrefetchState({ loading: false, time: 0, done: true });
  };

  const handleLinkClick = (page: string) => {
    setLoadingPages((prev) => ({ ...prev, [page]: 0 }));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-2 text-[#191F28]">
        Next.js 렌더링 비교
      </h1>
      <p className="text-[#4E5968] mb-8">각 방식을 직접 체험해보세요</p>

      <div className="flex flex-col gap-3">
        {/* App Router Basic */}
        <Link
          href="/app-router"
          onClick={() => handleLinkClick("basic")}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages["basic"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#FFA726] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages["basic"] / 6000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                App Router Basic
              </div>
              <div className="text-sm text-[#8B95A1]">순차 실행</div>
            </div>
            {loadingPages["basic"] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#FFA726] font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(loadingPages["basic"] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#FFA726]">~6s</div>
            )}
          </div>
        </Link>

        {/* App Router Suspense */}
        <Link
          href="/app-suspense"
          onClick={() => handleLinkClick("suspense")}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages["suspense"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#4CAF50] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages["suspense"] / 3000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                App Router + Suspense
              </div>
              <div className="text-sm text-[#8B95A1]">병렬 실행 • 스트리밍</div>
            </div>
            {loadingPages["suspense"] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#4CAF50] font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(loadingPages["suspense"] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#4CAF50]">~3s</div>
            )}
          </div>
        </Link>

        {/* TanStack Query Prefetch*/}
        <Link
          href="/query-prefetch"
          onClick={() => handleLinkClick("tanstack")}
          onMouseEnter={handlePrefetch}
          className={`block p-6 border rounded-xl no-underline text-inherit transition-all relative overflow-hidden ${
            prefetchState.done
              ? "bg-[#F0F4FF] border-[#3182F6]"
              : "bg-white border-[#E5E8EB]"
          }`}
        >
          {prefetchState.loading && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#3182F6] transition-all duration-100 linear"
                style={{
                  width: `${Math.min((prefetchState.time / 3000) * 100, 100)}%`,
                }}
              />
            </div>
          )}

          {loadingPages["tanstack"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div className="h-full w-full bg-[#3182F6]" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                TanStack Query Prefetch
              </div>
              <div className="text-sm text-[#8B95A1]">
                {prefetchState.loading
                  ? "Prefetching..."
                  : prefetchState.done
                    ? "캐시 완료 • 즉시 표시"
                    : "마우스 올려서 Prefetch"}
              </div>
            </div>
            {prefetchState.loading ? (
              <div
                className="text-2xl font-bold text-[#3182F6] font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(prefetchState.time / 1000).toFixed(1)}s
              </div>
            ) : loadingPages["tanstack"] !== undefined ? (
              <div className="text-2xl font-bold text-[#3182F6] font-mono">
                0.0s
              </div>
            ) : prefetchState.done ? (
              <div className="text-xl text-[#3182F6]">✓ 0s</div>
            ) : (
              <div className="text-xl text-[#3182F6]">~3s</div>
            )}
          </div>
        </Link>

        {/* Tanstack query Client fetch */}
        <Link
          href="/query-client-fetch"
          onClick={() => handleLinkClick("client")}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages["client"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#9E9E9E] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages["client"] / 3000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                Tanstack Query Client Fetch
              </div>
              <div className="text-sm text-[#8B95A1]">비교용</div>
            </div>
            {loadingPages["client"] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#9E9E9E] font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(loadingPages["client"] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#9E9E9E]">~3s</div>
            )}
          </div>
        </Link>

        {/* Tanstack query Prefetch + RSC*/}
        <Link
          href="/query-rsc-prefetch"
          onClick={() => handleLinkClick("rsc")}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages["rsc"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-red-500 transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages["rsc"] / 3000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                Tanstack Query Prefetch + RSC
              </div>
              <div className="text-sm text-[#8B95A1]">RSC에서의 Prefetch</div>
            </div>
            {loadingPages["rsc"] !== undefined ? (
              <div
                className="text-2xl font-bold text-red-500 font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(loadingPages["rsc"] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-red-500">~3s</div>
            )}
          </div>
        </Link>

        {/* Tanstack query Prefetch + RSC + Streaming */}
        <Link
          href="/query-rsc-prefetch-streaming"
          onClick={() => handleLinkClick("rsc-streaming")}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages["rsc-streaming"] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-purple-500 transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages["rsc-streaming"] / 3000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                Tanstack Query Prefetch + RSC + Streaming
              </div>
              <div className="text-sm text-[#8B95A1]">
                RSC에서의 Streaming Prefetch
              </div>
            </div>
            {loadingPages["rsc-streaming"] !== undefined ? (
              <div
                className="text-2xl font-bold text-purple-500 font-mono"
                style={{ animation: "pulse 1s infinite" }}
              >
                {(loadingPages["rsc-streaming"] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-purple-500">~0s</div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
