// Next
import Head from "next/head";

// Components
import { Label } from "@/components/ui/label/Label";
import { CheckBox } from "@/components/ui/checkBox/checkBox";
import { Input } from "@/components/ui/input/input";
import { TextError } from "@/components/ui/errorMessage/TextError";
import { Button } from "@/components/ui/button/button";

// React
import { FormEvent, useContext, useState } from "react";

// Utils
import { AuthContext } from "@/contexts/AuthContext";

// Rotas
import { canSSRGuest } from "@/utils/canSSRGuest";

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
              <Input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Digite sua Senha" />
              <div onClick={() => setShowPassword(!showPassword)} className="py-2 flex items-center font-semibold ">
                <CheckBox className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 " id="checkbox" />
                <p className="px-2 text-[11px]">Mostra senha</p>
              </div>
              <TextError error={error} />
              <div className="flex justify-between items-baseline">
                <Button type='submit' loading={loading} className={`transition duration-400 ${loading ? 'bg-green-500 hover:bg-red-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'}   text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block`}>{loading ? 'Carregando...' : 'Entrar'}</Button>
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