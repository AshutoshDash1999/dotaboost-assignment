import { useState } from "react";

// Client-side paging for long lists that arrive in one response
export function useShowMore<T>(items: T[], step = 50) {
  const [count, setCount] = useState(step);

  return {
    visible: items.slice(0, count),
    hasMore: items.length > count,
    remaining: items.length - count,
    showMore: () => setCount((current) => current + step),
    reset: () => setCount(step),
  };
}
