// React
import { InputHTMLAttributes } from "react";

// Biblioteca
import { SiVerizon } from "react-icons/si";

// Tipagem
interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> { }

export function CheckBox({ ...rest }: CheckBoxProps) {
    return (
        <div className="inline-flex items-center">
            <label
                className="relative flex cursor-pointer items-center rounded-full"
                htmlFor="checkbox"
            >
                <input
                    type="checkbox"
                    {...rest}
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="#ffffff"
                        stroke="#ffffff"
                        strokeWidth="1"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        >
                        </path>
                    </svg>
                </div>
            </label>
        </div>
    )
}