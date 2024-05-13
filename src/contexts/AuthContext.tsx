// React
import { ReactNode, createContext, useEffect, useState } from "react"

// Services
import { api } from "../services/apiClient";

// Biblioteca
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "react-toastify";

// Framework
import Router from "next/router";

// Tipagem
type AuthContextData = {
    user: UserProps | undefined,
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    loading: boolean;
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
    const [user, setUser] = useState<UserProps>()
    const [loading, setLoading] = useState<boolean>(false)
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();

        async function loadUser() {
            if (token) {
                try {
                    const resp = await api.post('/v1/auth/validate', { token: token });
                    console.log
                    setUser(resp.data.returnObject.body);
                } catch (err) {
                    console.error("Erro ao validar token:", err);
                    signOut(); // Token não for valido vou deslogar
                }
            }
        }
        loadUser();
    }, []);

    async function signIn({ username, password }: SignInProps) {
        // console.log(`UserName: ${username}, Password: ${password}`)
        setLoading(true)
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

            setUser({ username: username });

            // console.log("Token: ", user)

            api.defaults.headers['Authorization'] = `Bearer ${access_token}`

            toast.success('🚀 Bem vindo!')

            Router.push('/')
        } catch (err) {
            toast.error("Erro ao acessar!")
            console.log("Erro: ", err)
        } finally {
            setLoading(false)
        }
    }
    // console.log("Usuario: ", user)
    return (
        <AuthContext.Provider value={{ user: user || { username: '' }, isAuthenticated, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}