// React
import { ReactNode, useEffect, useRef, useState } from "react";

// Framework - servidor
import Head from "next/head";

// Component
import { SideNav } from "../menu/sideNav";
import { HeaderNav } from "../menu/HeaderNav";

export default function PageLayout({ children, description }: { children: ReactNode, description: string }) {
    const [isOpen, setIsopen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsopen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsopen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{description}</title>
            </Head>
            <div className="relative bg-[#edf3fb] h-screen flex flex-col w-full overflow-auto">
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50" />
                )}
                <div ref={menuRef}>
                    <SideNav toggleMenuState={isOpen} Close={setIsopen} />
                </div>
                <HeaderNav open={setIsopen} toggleMenuState={isOpen} />
                <main className="p-4 xl:ml-80 z-20">
                    {children}
                </main>
            </div>
        </>
    )
}