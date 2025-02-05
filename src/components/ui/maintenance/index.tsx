// Imagem
import manuntencion from "../../../../public/assets/engenheiro.png"

// Next
import Image from "next/image"

export default async function MainTence() {
    return (
        <div className="w-full max-h-screen h-full flex flex-col items-center justify-center text-center p-4">
            <Image src={manuntencion} alt="Página em Construção" width={300} height={300} />
            <h1 className="text-3xl font-bold mt-4">Página em Construção</h1>
            <p className="text-lg text-gray-600 mt-2">Estamos trabalhando para trazer novidades em breve. Fique ligado! 😶‍🌫️</p>
        </div>
    )
}