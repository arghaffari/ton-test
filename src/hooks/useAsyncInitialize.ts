import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(func: () => Promise<T>, deps?: any[]) {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    let isMounted = true; // Prevent memory leak if component unmounts

    (async () => {
      try {
        const result = await func();
        if (isMounted) {
          setState(result);
        }
      } catch (error) {
        console.error("useAsyncInitialize error:", error);
      }
    })();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted components
    };
  }, deps ?? []); // Ensure deps is always an array

  return state;
}
