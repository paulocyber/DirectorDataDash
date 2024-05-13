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
        <button {...rest} >
            <span className="inline-block mr-2">{children}</span>
            {loading ?
                <div className="inline-block w-3 h-3">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                </div>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>}
        </button>
    )
}