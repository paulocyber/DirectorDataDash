// React
import { ReactNode } from "react";

// Next - Framework
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Componentes
import { Layout } from "@/components/ui/layout";

// Utils
import { brandsQueries } from "@/utils/queries/brands";

// Biblioteca
import { setupApiClient } from "@/services/api";

export default async function AdminRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;
    const role = cookieStore.get('@nextauth.role')?.value;

    const api = setupApiClient(token as string);

    if (!token || role === 'vendedor') {
        redirect('/')
    }

    const brands = brandsQueries()

    const [respBrands] = await Promise.all([
        api.post("/v1/find-db-query", { query: brands })
    ])

    return (
        <Layout role={role} brands={respBrands.data.returnObject.body}>
            {children}
        </Layout>
    )
}