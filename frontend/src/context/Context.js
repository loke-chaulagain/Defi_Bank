import { useEffect, useState, createContext } from "react";
import { bankContractAddress, usdtAbi, shibAbi, maticAbi, bankAbi } from "../utils/constants";

export const BankContext = createContext();

export const BankContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [bankContract, setBankContract] = useState(undefined);
  const [tokenContracts, setTokenContracts] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});
  const [tokenSymbols, setTokenSymbols] = useState([]);

  const [amount, setAmount] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [isDeposit, setIsDeposit] = useState(true);

  // Helper function
  const toBytes32 = (text) => ethers.utils.formatBytes32String(text);
  const toString = (bytes32) => ethers.utils.parseBytes32String(bytes32);
  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEther = (wei) => ethers.utils.formatEther(wei).toString();
  const toRound = (num) => Number(num).toFixed(2);

  useEffect(() => {
    const init = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const bankContract = await new ethers.Contract(bankContractAddress, bankAbi);
      setBankContract(bankContract);

      bankContract
        .connect(provider)
        .getWhitelistedSymbols()
        .then((result) => {
          const symbols = result.map((s) => toString(s));
          setTokenSymbols(symbols);
          getTokenContracts(symbols, bankContract, provider);
        });
    };
    init();
  }, []);

  const [currentAccount, setCurrentAccount] = useState("");

  // This functions runs on every page refresh and gets connected wallet address.

  useEffect(() => {
    const isWalletConnected = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          } else {
            console.log("Wallet is not connected please try again once ");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Please install metamask");
      }
    };
    isWalletConnected();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
        console.log(`Wallet connected successfully and wallet address is ${accounts[0]}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install metamask");
    }
  };

  // Function that listen on account changed
  useEffect(() => {
    const walletRemovedOrWalletChangedListener = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", (accounts) => {
          setCurrentAccount(accounts[0]);
        });
      } else {
        console.log("Please install metamask");
      }
    };
    walletRemovedOrWalletChangedListener();
  });

  return <BankContext.Provider value={{ connectWallet, currentAccount }}>{children}</BankContext.Provider>;
};
