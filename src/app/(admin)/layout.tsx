// React
import { ReactNode } from "react";

// Next - Framework
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Componentes
import { Layout } from "@/components/ui/layout";

export default function AdminRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;
    const role = cookieStore.get('@nextauth.role')?.value;

    if(!token || role === 'vendedor') {
        redirect('/')
    }

    return (
        <Layout role={role}>
            {children}
        </Layout>
    )
}