// Css
import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

// Framework
import type { AppProps } from "next/app";
import { Router } from "next/router";

// Biblioteca
import { ToastContainer } from "react-toastify";
import nProgress from 'nprogress'
import { RecoilRoot } from "recoil";

// React
import { AuthProvider } from "@/contexts/AuthContext";

// Componentes

export default function App({ Component, pageProps }: AppProps) {

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
