// Configurações
import { fontSans } from "@/config/fonts";
import clsx from "clsx";

// Bibliotecas
import { ToastProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";

// Css
import "@/styles/globals.css";

// React
import { AuthProvider } from "@/providers/auth";
import { Providers } from "@/providers/jotai";

export const maxDuration = 30;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider>
          <Providers>
            <ToastProvider placement="top-right" />
            {children}
          </Providers>
          <NextTopLoader />
        </AuthProvider>
      </body>
    </html>
  );
}
