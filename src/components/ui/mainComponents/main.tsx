// React
import { ReactNode } from "react";

interface MainProps {
    children: ReactNode;
}

export function Main({ children }: MainProps) {
    return (
        <div className="pb-5">
            <div className="px-4  lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}