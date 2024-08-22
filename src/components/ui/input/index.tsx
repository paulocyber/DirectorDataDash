// Biblioteca
import { Input as Inp } from "@nextui-org/react";

// React
import { ComponentProps } from "react";

// Tipagem 
type InputProps = ComponentProps<typeof Inp>

export function Input({ ...rest }: InputProps) {
    return (
        <Inp
            {...rest}
            className="w-full"
            classNames={{ inputWrapper: "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent border" }}
        />
    )
}