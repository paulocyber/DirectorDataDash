// React
import { ReactNode } from "react";

// Componentes
import Loading from "../../loading";

export default function GraphicContainer({ children, loading }: { children: ReactNode; loading: boolean }) {
    return (
        <div className="flex w-full flex-col h-[400px] rounded-lg">
            <main
                className={`p-4  h-full z-0 ${loading ? "flex items-cente items-center justify-center " : ""
                    }`}
            >
                {loading ? <Loading /> : children}
            </main>
        </div>
    );
}
