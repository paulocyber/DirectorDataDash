"use client";

// Imagens
import slogan from "@/public/img/playcell.png";

// Componentes
import { Input } from "@/components/ui/input";

// Next
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// React
import { SyntheticEvent, useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Bibliotecas
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { TiWarning } from "react-icons/ti";
import { useTopLoader } from "nextjs-toploader";

export default function SignIn() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();
  const loader = useTopLoader();

  const { signIn, role } = useContext(AuthContext);

  async function handleSignIn(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    loader.start();

    if (name.trim() === "" || password.trim() === "") {
      addToast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome de usuário e senha.",
        color: "danger",
        icon: <TiWarning />,
      });
      setError(true);
      setLoading(false);
      loader.done();

      return;
    }

    const promise = signIn({ username: name, password });

    addToast({
      title: "Autenticando...",
      description: "Estamos verificando suas credenciais.",
      color: "primary",
      icon: <TiWarning />,
      promise,
    });

    try {
      await promise;

      addToast({
        title: `Bem-vindo de volta, ${name}!`,
        description: "Login realizado com sucesso.",
        color: "success",
      });
    } catch (err) {
      console.log("Error: ", (err as any).status);

      addToast({
        title: "Autorização pendente",
        description:
          "Seu acesso ainda não foi autorizado. Um administrador precisa ativar sua conta. Por favor, aguarde ou entre em contato se achar que houve um engano.",
        color: "warning",
        icon: <TiWarning />,
        promise,
      });

      loader.remove();

      setError(true);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col justify-center sm:py-12">
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
                error={error}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
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
                error={error}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite seu nome"
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
            <div className="w-full">
              <Button
                type="submit"
                isLoading={loading}
                color="primary"
                className="w-full"
              >
                Entrar
              </Button>

              <p className="mt-6 text-center text-sm text-gray-600">
                Novo por aqui?
                <Link
                  href="/signup"
                  className="text-blue-600 pl-1 hover:underline font-medium"
                >
                  Crie sua conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
