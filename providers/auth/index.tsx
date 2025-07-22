"use client"

// Next
import { useRouter } from "next/navigation";

// Bibliotecas
import { setupApiClient } from "@/utils/fetchs/api";

// React
import { createContext, ReactNode, useEffect, useState } from "react";

// Tipagem
type SignInProps = {
    username: string;
    password: string;
};

type AuthContextData = {
    user: string;
    role: string;
    token: string;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userName, setUserName] = useState<string>("");
    const [ruleUser, setRuleUser] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const api = setupApiClient()
    const router = useRouter()

    async function signIn({ username, password }: SignInProps) {
        try {
            const resp = await api.post("/v1/auth/login", {
                username,
                password,
            });

            const { access_token } = resp.data.returnObject.body
            const { role } = resp.data.returnObject.body.user

            document.cookie = `@nextauth.token=${access_token}; max-age=${60 * 60 * 24 * 30
                }; path=/`;
            document.cookie = `@nextauth.role=${role}; max-age=${60 * 60 * 24 * 30
                }; path=/`;

            setUserName(username);
            setRuleUser(role);

            api.defaults.headers["Authorization"] = `Bearer ${access_token}`;

        } catch (err) {
            console.log("Error: ", err);
        }
    }

    useEffect(() => {
        const cookies = document.cookie.split("; ").reduce((prev, current) => {
            const [name, ...rest] = current.split("=");
            prev[name] = decodeURIComponent(rest.join("="));
            return prev;
        }, {} as Record<string, string>);

        const token = cookies["@nextauth.token"];
        const role = cookies["@nextauth.role"];

        async function loadUser() {
            if (token) {
                try {
                    const resp = await api.post("/v1/auth/validate", { token });
                    setToken(token)
                    setUserName(resp.data.returnObject.body.username as string)
                    setRuleUser(role);
                } catch (err) {
                    console.log("Erro ao validar token:", err)
                    signOut()
                }
            }
        }

        loadUser()
    }, [])

    function signOut() {
        try {
            document.cookie = '@nextauth.token=; max-age=0; path=/'
            document.cookie = '@nextauth.role=; max-age=0; path=/';
            router.push("/")
        } catch (err) {
            console.error("Error ao deslogar: ", err);
        }
    }

    return (
        <AuthContext.Provider value={{ user: userName, role: ruleUser, token: token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}