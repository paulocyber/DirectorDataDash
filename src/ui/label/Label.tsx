import { LabelHTMLAttributes, ReactNode } from "react";

interface labelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode,
}

export function Label({ children, ...rest }: labelProps) {
    return (
        <label className="block font-semibold" {...rest}>{children}</label>
    )
}