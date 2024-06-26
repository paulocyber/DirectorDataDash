// Css
import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

// Framework
import type { AppProps } from "next/app";
import { Router } from "next/router";

// Context
import { AuthContext, AuthProvider } from "@/contexts/AuthContext";

// Biblioteca
import { ToastContainer } from 'react-toastify';
import nProgress from 'nprogress'
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  // Rotas
  Router.events.on('routeChangeStart', () => {
    nProgress.start()
  })

  Router.events.on('routeChangeComplete', () => {
    nProgress.done()
  })

  Router.events.on('routeChangeError', () => {
    nProgress.done()
  })

  return (
    <AuthProvider>
      <RecoilRoot>
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} />
      </RecoilRoot>
    </AuthProvider>
  );
}
