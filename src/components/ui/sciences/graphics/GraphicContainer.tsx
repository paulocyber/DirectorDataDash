// React
import { ReactNode } from "react";
import Loading from "../../loading";

// Componentes

export default function GraphicContainer({ children, loading }: { children: ReactNode, loading: boolean }) {

    if (loading) {
        return (
            <div className="flex w-full flex-col h-[450px] overflow-auto">
                <main className="p-4 space-y-1 flex items-center justify-center h-full">
                    <Loading />
                </main>
            </div>
        )
    }

    return (
        <div className="flex w-full flex-col h-[420px] overflow-auto">
            <main className="p-4 space-y-1 h-full z-0">
                {children}
            </main>
        </div>
    )
}