"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchComments } from "@/lib/apis";

export function CommentsList() {
  const { data: comments } = useSuspenseQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  return (
    <div>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </div>
  );
}
