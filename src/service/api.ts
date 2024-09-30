// Biblioteca
import axios from "axios";

// // Framework - Next
// import { cookies } from "next/headers";

export function setupApiClient(ctx?: string) {

    const api = axios.create({
        baseURL: "https://sistema-suporte-play-uljpe.ondigitalocean.app",
    });

    // Interceptador para adicionar o token, se existir
    api.interceptors.request.use((config) => {
        // Se o token estiver disponível, adicione-o ao cabeçalho
        if (ctx) {
            config.headers.Authorization = `Bearer ${ctx}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return api;
}