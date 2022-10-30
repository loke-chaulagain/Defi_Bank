import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { BankContextProvider } from "../context/Context";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap");
  }, []);
  return (
    <BankContextProvider>
      <Component {...pageProps} />
    </BankContextProvider>
  );
}

export default MyApp;
