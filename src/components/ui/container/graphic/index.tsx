// React
import { ReactNode } from "react";

// Componentes
import Loading from "../../loading";

export default function GraphicContainer({ children, loading }: { children: ReactNode, loading: boolean }) {

    if (loading) {
        return (
            <div className="flex w-full flex-col h-[400px] overflow-auto">
                <main className="p-4 space-y-1 flex items-center justify-center h-full">
                    <Loading />
                </main>
            </div>
        )
    }

    return (
        <div className="flex w-full flex-col h-[400px] overflow-auto">
            <main className="p-4 space-y-1 h-full ">
                {children}
            </main>
        </div>
    )
}