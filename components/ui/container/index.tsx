// React
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
    return (
        <div className="py-2 px-2">
            <div className="bg-white w-full shadow-xl rounded-2xl">
                {children}
            </div>
        </div>
    )
}