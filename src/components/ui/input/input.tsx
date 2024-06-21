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

export function Search({ ...rest }: InputProps) {
    return (
        <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 ">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full md:p-2 p-1 md:ps-10 ps-10 text-sm text-black-900 border rounded-lg bg-white-50 dark:bg-white-700 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black"
                    {...rest}
                />
            </div>
        </div>
    )
}