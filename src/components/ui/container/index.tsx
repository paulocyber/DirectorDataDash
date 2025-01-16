// React
import { ReactNode } from "react";

// Tipagem
interface ContainerProps {
    children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
    return (
        <div className="py-2 px-2">
            <div className="bg-white w-full shadow-xl rounded-lg">
                {children}
            </div>
        </div>
    )
}