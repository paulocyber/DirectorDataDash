// React
import { ReactNode } from "react";

// Componentes
import Loading from "../../loading";

export default function GraphicContainer({ children, loading }: { children: ReactNode, loading: boolean }) {

    return (
        <div className="flex w-full flex-col h-[420px] overflow-auto">
            <main className={`p-4 space-y-1 ${loading && 'flex items-center justify-center'} h-full z-0`}>
                {loading ? <Loading /> : children}
            </main>
        </div>
    )
}