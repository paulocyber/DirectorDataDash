"use client";

// Nest
import Image from "next/image";
import Link from "next/link";

// Imagens
import slogan from "../../../public/img/playcell.png";

// React
import { SyntheticEvent, useState } from "react";

// Componentes
import { Input } from "@/components/ui/input";

// Bibliotecas
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { addToast } from "@heroui/react";
import { TiWarning } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

export default function SignUp() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassoword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();
  const loader = useTopLoader();
  const api = setupApiClient();

  async function handleSignUp(e: SyntheticEvent) {
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

    if (password !== confirmPassoword) {
      addToast({
        title: "As senhas não conferem",
        description:
          "Verifique e tente novamente para prosseguir com o cadastro.",
        color: "danger",
        icon: <TiWarning />,
      });
      setError(true);
      setLoading(false);
      loader.done();
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      addToast({
        title: "Senha fraca",
        description:
          "A senha deve ter 8+ caracteres, incluindo letras maiúsculas, minúsculas, número e caractere especial.",
        color: "danger",
        icon: <TiWarning />,
      });
      setError(true);
      setLoading(false);
      loader.done();
      return;
    }

    try {
      await api.post("/v1/auth/register", {
        username: name,
        password,
        role: "vendedor",
      });

      setName("");
      setPassword("");
      setConfirmPassword("");
      setError(false);
      setLoading(false);

      addToast({
        title: "Cadastro realizado com sucesso!",
        description:
          "Seu usuário foi criado. Aguarde a ativação pelo administrador.",
        color: "success",
        icon: <FaCheckCircle />,
      });

      router.push("/");
    } catch (err) {
      addToast({
        title: "Falha no cadastro",
        description:
          "Ocorreu um problema ao processar seu cadastro. Tente novamente.",
        color: "danger",
        icon: <TiWarning />,
      });

      setError(true);
      setLoading(false);
      setError(true);
      loader.done();

      console.log("Error: ", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center pb-4">
          <Image src={slogan} alt="Logo PlayCell" className="w-40 py-2" />
          <h1 className="text-2xl font-bold text-center">Crie sua conta</h1>
          <p className="text-center text-gray-600">
            Bem-vindo! Preencha seus dados para começar.
          </p>
        </div>

        {error && <div className="mb-4 text-center text-red-600">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-9">
          <Input
            type="text"
            label="Nome"
            labelPlacement="outside"
            radius="md"
            id="name"
            name="name"
            error={error}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />

          <Input
            type={isVisible ? "text" : "password"}
            label="Senha"
            labelPlacement="outside"
            radius="md"
            id="password"
            name="password"
            error={error}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
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

          <Input
            type={isVisible ? "text" : "password"}
            label="Confirme sua senha"
            labelPlacement="outside"
            radius="md"
            id="confirmPassword"
            name="confirmPassword"
            error={error}
            value={confirmPassoword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
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

          <Button
            type="submit"
            isLoading={loading}
            color="primary"
            className="w-full"
          >
            Cadastrar
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já possui conta?
          <Link
            href="/"
            className="text-blue-600 font-medium ml-1 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
