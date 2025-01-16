// React
import { ReactNode } from "react";

// Componentes
import { Layout } from "@/components/ui/layout";

// Next - Framework
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SellersRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (!token || !['vendedor', 'vendedora'].includes(role)) {
        redirect('/');
    }

    return (
        <Layout role={role}>
            {children}
        </Layout>
    );
}