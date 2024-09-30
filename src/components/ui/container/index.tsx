// React
import { ReactNode } from "react";

// Tipagem
interface ContainerProps {
    children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
    return (
        <div className="pb-5">
            <div className="px-4 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}