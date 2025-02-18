import { useEffect, useState, useCallback } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, fromNano, toNano } from "@ton/core";
import { useTonconnect } from "./useTonconnect";

export function useMainContract() {
  const addr = "EQD7uGhe2l40Mdpk_cuwRGr0GESdJbVRIzPS5f9XrTi0cYdO";

  const client = useTonClient();
  const { sender } = useTonconnect();

  // State for contract data
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
    contract_balance: string;
  }>(null);

  // Memoized function to fetch the main contract
  const fetchMainContract = useCallback(async () => {
    if (!client) return null;
    console.log("Fetching contract:", addr);

    const contract = new MainContract(Address.parse(addr));
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  // Open the contract
  const mainContract = useAsyncInitialize(fetchMainContract, []);

  // Fetch contract data periodically (polling)
  useEffect(() => {
    if (!mainContract) return;

    let isMounted = true;
    console.log("Contract Mounted:", isMounted);

    const fetchContractData = async () => {
      try {
        const val = await mainContract.getData();
        const balance = await mainContract.getBalance();

        if (isMounted) {
          setContractData({
            counter_value: val.number,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
            contract_balance: fromNano(balance.balance).toString(),
          });

          console.log(contractData);
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    // Fetch data immediately and then every 5 seconds
    fetchContractData();
    const interval = setInterval(fetchContractData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval); // Cleanup on unmount
    };
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString() ?? null,
    ...contractData,
    sendIncrement: async () => {
      if (!mainContract) return;
      return mainContract.sendIncreament(sender, toNano("0.01"), 5);
    },

    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("0.02"));
    },

    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawalRequest(
        sender,
        toNano(0.005),
        toNano("0.02")
      );
    },
  };
}
