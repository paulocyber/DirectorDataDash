// Next
import Head from "next/head";

// Components
import { AuthContext } from "@/contexts/AuthContext";
import { Label } from "@/ui/label/Label";
import { Input } from "@/ui/input/Input";
import { TextError } from "@/ui/errorMessage/TextError";
import { Button } from "@/ui/button/Button";

// React
import { FormEvent, useContext, useState } from "react";
import { canSSRGuest } from "@/utils/canSSRGuest";

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { signIn } = useContext(AuthContext)

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true)

    if (username === '' && password === '') {
      setError("Por Favor, insirar seu email e senha.")
    }

    let data = {
      username: username,
      password: password
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <div className="relative py-3 sm:w-96 mx-auto text-center">
          <h2 className="text-2xl font-bold ">Login</h2>
          <div className="mt-4 bg-white shadow-md rounded-lg text-left">
            <div className={`h-2 ${loading ? 'bg-green-500' : 'bg-blue-500'} ${error && 'bg-red-500'} rounded-t-md`}></div>
            <form onSubmit={handleLogin} className="px-10 py-8 ">
              <Label htmlFor='user'>Usuario: </Label>
              <Input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="UserName" error={error} />
              <Label htmlFor='passoword'>Password: </Label>
              <Input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Digite sua Senha" />
              <TextError error={error} />
              <div className="flex justify-between items-baseline">
                <Button type='submit' loading={loading}>{loading ? 'Carregando...' : 'Entrar'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})