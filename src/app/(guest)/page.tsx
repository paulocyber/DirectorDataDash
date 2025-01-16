'use client'

// Next
import Image from "next/image";

// Imagens
import slogan from "../../../public/assets/playcell.png"

// Componentes
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Biblioteca
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";

// React
import { SyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { toast } from "react-toastify";

export default function SigInPage() {
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const { signIn } = useContext(AuthContext)

  async function handleSignIn(e: SyntheticEvent) {
    e.preventDefault()

    setLoading(true)

    if (name === '' && password === '') {
      toast.error("Por Favor, insirar seu email e senha.")
      setError(true)
    }

    setError(false)
    await signIn({ username: name, password })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <div className="w-full flex items-center justify-center py-4">
          <Image
            src={slogan}
            alt="Logo PlayCell"
            quality={100}
            priority={true}
            className="w-40"
          />
        </div>

        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form onSubmit={handleSignIn} className="px-5 py-7">
            <div className="pb-5">
              <Input
                type="text"
                label="Nome: "
                labelPlacement="outside"
                radius="md"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                isInvalid={error}
              />
            </div>
            <div className="pb-5">
              <Input
                type={isVisible ? "text" : "password"}
                label="Senha: "
                labelPlacement="outside"
                radius="md"
                id="name"
                name="name"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite seu nome"
                isInvalid={error}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <IoEyeOutline className="text-lg text-default-400 pointer-events-none" />
                    ) : (
                      <FiEyeOff className="text-lg text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </div>
            <div>
              <Button type="submit" isLoading={loading} color="primary">Entrar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
