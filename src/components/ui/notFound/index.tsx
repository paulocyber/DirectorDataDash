// Bibliotecas
import { IoMdInformationCircleOutline } from "react-icons/io";

// Next
import Link from "next/link";

export function NotFound({ href }: { href: string }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-10 rounded-lg ">
                <div className="bg-red-100 text-red-500 p-4 rounded-full mb-6">
                    <IoMdInformationCircleOutline className="h-8 w-8" />
                </div>

                <p className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-gray-300">
                    500
                </p>

                <p className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide text-gray-700 mt-4 text-center">
                    Dados não encontrados
                </p>

                <p className="text-gray-500 text-center mt-4">
                    Ops! Desculpe, não encontramos nenhuma informação relacionada a este documento.
                </p>

                <Link
                    href={href}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
                >
                    Voltar
                </Link>
            </div>
        </div>
    )
}