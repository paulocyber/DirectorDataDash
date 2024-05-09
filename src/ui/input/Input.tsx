import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function Input({ error, ...rest }: InputProps) {
    return (
        <input {...rest} className={`border ${error && 'border-red-500'} w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md`} />
    )
}