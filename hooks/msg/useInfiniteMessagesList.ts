import { useMemo } from "react";
import { trpc } from "~/utils/trpc";

export function useInfiniteMessagesList(limit: number = 20) {
  const { data, ...rest } = trpc.msg.list.useInfiniteQuery(
    { limit },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const list = useMemo(
    () => data?.pages.map((item) => item.list).flat(),
    [data?.pages]
  );

  return {
    ...rest,
    list,
  };
}
