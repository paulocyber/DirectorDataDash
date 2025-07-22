'use client'

// Bibliotecas
import { AiOutlineFileUnknown } from "react-icons/ai";
import { motion } from "framer-motion";

export default function DataNotFound() {
    return (
        <main className="flex flex-col items-center h-screen justify-center w-full px-4">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="flex items-center justify-center w-24 h-24 mx-auto bg-blue-100 rounded-full mb-6"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <AiOutlineFileUnknown className="text-5xl text-blue-600" />
                </motion.div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Dados não encontrados
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    Não encontramos as informações que você procura. Elas podem ter sido movidas,
                    excluídas ou ainda não existirem.
                </p>
            </motion.div>
        </main>
    );
}
