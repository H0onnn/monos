"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/apis";

export function PostsList() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div
        style={{
          border: "2px dashed #2196F3",
          padding: "1rem",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        <h2>📝 Posts 로딩 중...</h2>
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
        border: "2px solid #2196F3",
        padding: "1rem",
        borderRadius: "8px",
        background: "white",
      }}
    >
      <h2>📝 Posts (TanStack Query)</h2>
      <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "1rem" }}>
        ✅ Hydrated from server cache (로딩 시간: {posts?.[0]?.loadTime}ms)
      </p>

      {posts?.map((post) => (
        <div
          key={post.id}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            background: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>{post.title}</h3>
          <p style={{ margin: 0 }}>{post.body}</p>
        </div>
      ))}

      <div
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          background: "#fff3e0",
          borderRadius: "4px",
          fontSize: "0.9em",
        }}
      >
        <strong>🔄 자동 리페칭 설정:</strong>
        <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
          <li>staleTime: 60초</li>
          <li>gcTime: 5분</li>
          <li>refetchOnWindowFocus: true (기본값)</li>
        </ul>
      </div>
    </section>
  );
}
