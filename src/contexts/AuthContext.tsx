// Framework
import Router from "next/router";

// Biblioteca
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "react-toastify";

// Service
import { api } from "@/service/api/apiClient";

// React
import { createContext, ReactNode, useEffect, useState } from "react";

// Tipagem
type SignInProps = {
    username: string;
    password: string;
}

type AuthContextData = {
    user: string;
    role: string;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token');
        destroyCookie(undefined, '@nextauth.role'); // Remove o role
        Router.push("/");
    } catch (err) {
        console.error("Error ao deslogar: ", err);
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userName, setUserName] = useState<string>("");
    const [roleUser, setRoleUser] = useState<string>("");

    useEffect(() => {
        const { '@nextauth.token': token, '@nextauth.role': role } = parseCookies();

        async function loadUser() {
            if (token) {
                try {
                    const resp = await api.post('/v1/auth/validate', { token });
                    setUserName(resp.data.returnObject.body.username as string);
                    setRoleUser(role);
                } catch (err) {
                    console.error("Erro ao validar token:", err);
                    signOut();
                }
            }
        }

        loadUser();
    }, []);

    async function signIn({ password, username }: SignInProps) {
        try {
            const resp = await api.post('/v1/auth/login', {
                username,
                password
            });

            const { access_token } = resp.data.returnObject.body;
            const { role } = resp.data.returnObject.body.user;

            setCookie(undefined, '@nextauth.token', access_token, {
                maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mês
                path: "/" // Quais caminhos terão acesso ao cookie
            });

            // Armazena o role no cookie
            setCookie(undefined, '@nextauth.role', role, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });

            setUserName(username);
            setRoleUser(role);

            api.defaults.headers['Authorization'] = `Bearer ${access_token}`;

            toast.success('Bem vindo!', { icon: <span>🚀</span> });

            if(role === "vendedor") {
                Router.push('/sales');
            } else {
                Router.push('/davs');
            }
            
        } catch (err) {
            toast.error("Erro ao acessar!");
            console.log("Error: ", err);
        }
    }

    return (
        <AuthContext.Provider value={{ user: userName, role: roleUser, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
