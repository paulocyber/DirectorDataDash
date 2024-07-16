// React
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
    return (
        <div className="pb-5">
            <div className="px-4 lg:px-8">
                <div className="bg-white shadow-xl sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    )
}