import { useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState, useCallback } from "react";
import { Sender, SenderArguments } from "@ton/core";
import { ConnectedWallet } from "@tonconnect/ui"; // ✅ Import the correct type

export const useTonconnect = (): { sender: Sender; connected: boolean } => {
  const [tonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState<boolean>(tonConnectUI.connected);

  // Correcting the event listener type mismatch
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(
      (wallet: ConnectedWallet | null) => {
        setConnected(!!wallet); // ✅ Convert `wallet` to boolean (`true` if connected, `false` if null)
      }
    );

    return () => unsubscribe(); // ✅ Cleanup to remove listener
  }, [tonConnectUI]);

  // Memoized function to send transactions
  const sendTransaction = useCallback(
    async (args: SenderArguments) => {
      try {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    },
    [tonConnectUI]
  );

  return {
    sender: { send: sendTransaction },
    connected,
  };
};
