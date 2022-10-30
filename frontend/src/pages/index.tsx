import React, { useContext } from "react";
import { FaBeer } from "react-icons/fa";
import { BankContext } from "../context/Context";

function Index() {
  const { connectWallet, currentAccount } = useContext(BankContext);

  return (
    <div>
      <button onClick={connectWallet} type="submit">
        {currentAccount ? currentAccount : "Connect wallet"}
      </button>
    </div>
  );
}

export default Index;
