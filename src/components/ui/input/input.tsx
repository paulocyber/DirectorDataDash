// React
import { InputHTMLAttributes } from "react";

// Tipagem
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function Input({ error, ...rest }: InputProps) {
    return (
        <input {...rest} className={`border ${error && 'border-red-500'} w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md`} />
    )
}

export function Search({...rest }: InputProps) {
    return (
        <input
            type="search"
            id="default-search"
            className="block w-full md:p-2 p-1 md:ps-10 ps-10 text-sm text-black-900 border rounded-lg bg-white-50 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black"
           {...rest}
        />
    )
}