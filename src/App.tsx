import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonconnect } from "./hooks/useTonconnect";
import { useState } from "react";


function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest
  } = useMainContract();

  console.log(recent_sender, owner_address);


  const { connected } = useTonconnect();

  const [loading, setLoading] = useState(false);

  const handleIncrement = async () => {
    if (!sendIncrement || loading) return;
    setLoading(true);
    try {
      await sendIncrement();
    } catch (error) {
      console.error("Increment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDeposit = async () => {
    if (!sendDeposit || loading) return;
    setLoading(true);
    try {
      await sendDeposit();
    } catch (error) {
      console.error("sending deposit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    if (!sendWithdrawalRequest || loading) return;
    setLoading(true);
    try {
      await sendWithdrawalRequest();
    } catch (error) {
      console.error("withdrawal failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">
            {contract_address ? contract_address.slice(0, 30) + "..." : "Loading..."}
          </div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance ?? "Loading..."}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && (
          <button
            onClick={handleIncrement}
            disabled={!sendIncrement || loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Processing..." : "Increment By 5"}
          </button>
        )}

        <br />

        {connected && (
          <button
            onClick={handleSendDeposit}
            disabled={!sendDeposit || loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Processing..." : "Send 0.02 Ton Deposit"}
          </button>
        )}

        {connected && (
          <button
            onClick={handleWithdrawalRequest}
            disabled={!sendWithdrawalRequest || loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Processing..." : "Withdraw 0.01 Ton Request"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
