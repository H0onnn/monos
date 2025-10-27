"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/lib/apis";

export function CommentsList() {
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  if (isLoading) {
    return (
      <div
        style={{
          border: "2px dashed #FF9800",
          padding: "1rem",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        <h2>💬 Comments 로딩 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          border: "2px solid #f44336",
          padding: "1rem",
          borderRadius: "8px",
          background: "#ffebee",
        }}
      >
        <h2>❌ 에러 발생</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <section
      style={{
        border: "2px solid #FF9800",
        padding: "1rem",
        borderRadius: "8px",
        background: "white",
      }}
    >
      <h2>💬 Comments (TanStack Query)</h2>
      <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "1rem" }}>
        ✅ Hydrated from server cache (로딩 시간: {comments?.[0]?.loadTime}ms)
      </p>

      {comments?.map((comment) => (
        <div
          key={comment.id}
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            background: "#fff3e0",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{comment.text}</p>
        </div>
      ))}

      <div
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          background: "#e8f5e9",
          borderRadius: "4px",
          fontSize: "0.9em",
        }}
      >
        <strong>💡 TanStack Query 장점:</strong>
        <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
          <li>네트워크 요청 없이 즉시 렌더링</li>
          <li>백그라운드 리페칭 자동 처리</li>
          <li>중복 요청 자동 방지</li>
        </ul>
      </div>
    </section>
  );
}
