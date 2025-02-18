import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(func: () => Promise<T>, deps?: any[]) {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = await func();
        console.log("Async Initialized Result:", result); // Debugging log
        if (isMounted) {
          setState(result);
        }
      } catch (error) {
        console.error("useAsyncInitialize error:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, deps ?? []);

  return state;
}
