import { Suspense } from "react";
import {
  type PrefetchOptions,
  type PrefetchInfiniteOptions,
  isPrefetchOptions,
  isPrefetchInfiniteOptions,
} from "../query.types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "../../../lib/query";

type Props = {
  prefetchOptions:
    | PrefetchOptions[]
    | PrefetchInfiniteOptions[]
    | PrefetchOptions
    | PrefetchInfiniteOptions;
  children: React.ReactNode;
};

export async function PrefetchBoundary({ prefetchOptions, children }: Props) {
  const queryClient = getQueryClient();

  if (Array.isArray(prefetchOptions)) {
    // Streaming을 위해 await 하지 않음
    Promise.all(
      prefetchOptions.map((option) => {
        if (isPrefetchOptions(option)) {
          return queryClient.prefetchQuery(option);
        }
        if (isPrefetchInfiniteOptions(option)) {
          return queryClient.prefetchInfiniteQuery(option);
        }
      })
    );
  } else {
    if (isPrefetchOptions(prefetchOptions)) {
      queryClient.prefetchQuery(prefetchOptions);
    }
    if (isPrefetchInfiniteOptions(prefetchOptions)) {
      queryClient.prefetchInfiniteQuery(prefetchOptions);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

interface SuspensePrefetchBoundaryProps extends Props {
  fallback: React.ReactNode;
}

export async function SuspensePrefetchBoundary({
  prefetchOptions,
  children,
  fallback,
}: SuspensePrefetchBoundaryProps) {
  return (
    <Suspense fallback={fallback}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        {children}
      </PrefetchBoundary>
    </Suspense>
  );
}
