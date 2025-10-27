"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/apis";

export function PostList() {
  const { data: posts, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
  });

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
}
