"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/apis";

export function PostList() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
}
