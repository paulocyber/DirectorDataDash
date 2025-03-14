// Biblioteca
import { Button as Btn } from "@heroui/react";

// React
import { ComponentProps, ReactNode } from "react";

// Tipagem
type ButtonProps = ComponentProps<typeof Btn> & {
    children?: ReactNode;
    custom?: boolean;
}

export function Button({ children, custom, ...rest }: ButtonProps) {

    return (
        <Btn className="w-full" {...rest}>
            {children}
        </Btn>
    )
}