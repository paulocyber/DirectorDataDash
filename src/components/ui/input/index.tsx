// Biblioteca
import { Input } from "@nextui-org/react";

// React
import { ComponentProps } from "react";

// Tipagem 
type InputFormProps = ComponentProps<typeof Input>

export function InputForm({ ...rest }: InputFormProps) {
    return (
        <Input
            {...rest}
            className=""
            classNames={{ inputWrapper: "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent border" }}
        />
    )
}