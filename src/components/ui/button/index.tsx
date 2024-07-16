// Biblioteca
import { Button } from "@nextui-org/react";

// React
import { ComponentProps, ReactNode } from "react";

// Tipagem
type BtnProps = ComponentProps<typeof Button> & {
    children: ReactNode
}

export function Btn({ children, ...rest }: BtnProps) {
    return (
        <Button className="w-full" {...rest}>
            {children}
        </Button>
    )
}