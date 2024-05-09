// React
import { ReactNode, ButtonHTMLAttributes } from "react";

// Biblioteca
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Tipagem
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode
}

export function Button({ loading, children, ...rest }: ButtonProps) {
    return (
        <button {...rest} className={`mt-4 transition duration-400 ${loading ? 'bg-green-500 hover:bg-red-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'}   text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block`}>
            <span className="inline-block mr-2">{children}</span>
            {loading ?
                <div className="inline-block w-3 h-3">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                </div>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>}
        </button>
    )
}