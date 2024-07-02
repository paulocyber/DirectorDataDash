import { AuthContext } from "@/contexts/AuthContext";
import { Html, Head, Main, NextScript } from "next/document";
import { useContext } from "react";

export default function Document() {
  return (
    <Html lang="pt-Br">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
