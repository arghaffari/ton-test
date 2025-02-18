import { useCallback } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonClient() {
  const fetchTonClient = useCallback(async () => {
    return new TonClient({
      endpoint: await getHttpEndpoint(),
    });
  }, []); // ✅ Empty dependency array ensures it doesn't change

  return useAsyncInitialize(fetchTonClient, []); // ✅ Pass an empty dependency array
}
