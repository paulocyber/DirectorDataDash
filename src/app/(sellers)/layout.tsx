// React
import { ReactNode } from "react";

// Componentes
import { Layout } from "@/components/ui/layout";

// Next - Framework
import { cookies } from "next/headers"; 
import { redirect } from "next/navigation";

export default function SellersRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies(); // Obter os cookies
    const token = cookieStore.get('@nextauth.token')?.value;
    const role = cookieStore.get('@nextauth.role')?.value;

    if (!token || role !== 'vendedor') {
        redirect('/');
    }

    return (
        <Layout role={role} >
            {children}
        </Layout>
    ); 
}