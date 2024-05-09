import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Context
import { AuthProvider } from "@/contexts/AuthContext";

// Biblioteca
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </AuthProvider>
  );
}
