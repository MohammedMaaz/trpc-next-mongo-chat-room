import { useMemo } from "react";
import { trpc } from "~/utils/trpc";

export function useInfiniteMessagesList(limit: number = 10) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.msg.list.useInfiniteQuery(
      { limit },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const list = useMemo(
    () => data?.pages.map((item) => item.list).flat(),
    [data?.pages]
  );

  return {
    list,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
