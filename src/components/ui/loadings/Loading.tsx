// Biblioteca
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function Loading() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 my-2" />
            <p className="ml-2 text-sm">Carregando...</p>
        </div>
    )
}