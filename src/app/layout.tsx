// Next
import type { Metadata } from "next";

// Css
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

// React
import { AuthProvider } from "@/contexts/auth";
import { Providers } from "@/contexts/recoil";

// Biblioteca
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Login - Sistema de Gestão",
  description: "Acesse sua conta para entrar no sistema e gerenciar suas informações.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-Br">
      <body
        className=""
      >
        <AuthProvider>
          <NextTopLoader
            color="#ef4444"
          />
          <ToastContainer autoClose={3000} />
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
