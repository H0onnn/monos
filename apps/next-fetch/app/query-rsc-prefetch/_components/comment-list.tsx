"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../../lib/apis";

export function CommentsList() {
  const { data: comments, isPending } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
    staleTime: 60 * 1000,
  });

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      {comments?.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </div>
  );
}
