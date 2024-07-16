// React
import { ReactNode } from "react";

// Framework - servidor
import Head from "next/head";

// Component
import { SideNav } from "../menu/SideNav";
import { HeaderNav } from "../menu/HeaderNav";

export default function Layout({ children, description }: { children: ReactNode, description: string }) {

    return (
        <>
            <Head>
                <title>{description}</title>
            </Head>
            <div className="bg-[#edf3fb] h-screen flex flex-col w-full overflow-auto">
                <SideNav />
                <HeaderNav />
                <main className="p-4 xl:ml-80">
                    {children}
                </main>
            </div>
        </>
    )
}