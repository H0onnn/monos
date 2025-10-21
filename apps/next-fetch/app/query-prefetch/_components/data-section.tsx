"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchComments } from "../../../lib/apis";
import { useState, useEffect } from "react";

export function DataSection() {
  const [timer, setTimer] = useState(0);

  const {
    data: posts,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const {
    data: comments,
    isLoading: commentsLoading,
    isFetching: commentsFetching,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const isLoading = postsLoading || commentsLoading;

  // 로딩 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const start = Date.now();
      interval = setInterval(() => {
        setTimer(Date.now() - start);
      }, 10);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #E5E8EB",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#3182F6",
            fontFamily: "monospace",
            marginBottom: "0.5rem",
          }}
        >
          {(timer / 1000).toFixed(1)}s
        </div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#8B95A1",
          }}
        >
          첫 방문: 데이터 가져오는 중...
        </div>
        <div
          style={{
            marginTop: "1rem",
            height: "4px",
            background: "#E5E8EB",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min((timer / 3000) * 100, 100)}%`,
              background: "#3182F6",
              transition: "width 0.1s linear",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Posts */}
      <div
        style={{
          background: "white",
          border: "1px solid #E5E8EB",
          borderRadius: "12px",
          padding: "1.5rem",
          position: "relative",
        }}
      >
        {postsFetching && !postsLoading && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              fontSize: "0.75rem",
              color: "#3182F6",
              background: "#F0F4FF",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontWeight: "600",
            }}
          >
            리페칭...
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{ fontSize: "1rem", fontWeight: "600", color: "#191F28" }}
          >
            Posts ({posts?.length})
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#4CAF50",
              background: "#E8F5E9",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontWeight: "600",
            }}
          >
            ✓ 캐시 사용
          </div>
        </div>

        {posts?.map((post) => (
          <div
            key={post.id}
            style={{
              marginBottom: "0.75rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #F2F4F6",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.25rem",
                color: "#191F28",
              }}
            >
              {post.title}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#8B95A1" }}>
              {post.body}
            </div>
          </div>
        ))}
      </div>

      {/* Comments */}
      <div
        style={{
          background: "white",
          border: "1px solid #E5E8EB",
          borderRadius: "12px",
          padding: "1.5rem",
          position: "relative",
        }}
      >
        {commentsFetching && !commentsLoading && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              fontSize: "0.75rem",
              color: "#3182F6",
              background: "#F0F4FF",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontWeight: "600",
            }}
          >
            리페칭...
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{ fontSize: "1rem", fontWeight: "600", color: "#191F28" }}
          >
            Comments ({comments?.length})
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#4CAF50",
              background: "#E8F5E9",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontWeight: "600",
            }}
          >
            ✓ 캐시 사용
          </div>
        </div>

        {comments?.map((comment) => (
          <div
            key={comment.id}
            style={{
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              color: "#4E5968",
            }}
          >
            {comment.text}
          </div>
        ))}
      </div>

      {/* 캐시 정보 */}
      <div
        style={{
          background: "white",
          border: "1px solid #E5E8EB",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#191F28",
          }}
        >
          캐시 설정
        </div>
        <div
          style={{ fontSize: "0.875rem", color: "#4E5968", lineHeight: "1.6" }}
        >
          <div>• staleTime: 60초</div>
          <div>• gcTime: 5분</div>
          <div>• refetchOnWindowFocus: true</div>
        </div>
      </div>
    </div>
  );
}
