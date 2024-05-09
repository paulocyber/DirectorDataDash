// React
import { ReactNode, createContext, useState } from "react"

// Services
import { api } from "../services/apiClient";

// Biblioteca
import { destroyCookie, setCookie } from "nookies";
import { toast } from "react-toastify";

// Framework
import Router from "next/router";

// Tipagem
type AuthContextData = {
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    // signOut: () => void;
}

type UserProps = {
    username: string;
}

type SignInProps = {
    username: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push("/")
    } catch (err) {
        console.log('Error ao deslogar', err)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | undefined>(undefined);
    const isAuthenticated = !!user;

    async function signIn({ username, password }: SignInProps) {
        // console.log(`UserName: ${username}, Password: ${password}`)
        try {
            const resp = await api.post('/v1/auth/login', {
                username,
                password
            })

            const { access_token } = resp.data.returnObject.body;

            // console.log("Token: ", access_token)

            setCookie(undefined, '@nextauth.token', access_token, {
                maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
                path: "/" // Quais caminhos terao acesso ao cookie
            })

            setUser({
                username
            })

            // console.log("Token: ", access_token)

            api.defaults.headers['Authorization'] = `Bearer ${access_token}`

            toast.success('Bem vindo!')

            Router.push('/')
        } catch (err) {
            toast.error("Erro ao acessar!")
            console.log("Erro: ", err)
        }
    }
    // console.log("Usuario: ", user)
    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}