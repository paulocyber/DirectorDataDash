// React
import { ReactNode } from "react";

// Next - Framework
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Componentes
import { Layout } from "@/components/ui/layout";

// Utils
import { enterpriseQueries } from "@/utils/queries/enterprise";
import { suppliersQuery } from "@/utils/queries/suppliers";

// Biblioteca
import { setupApiClient } from "@/service/api";
import { Recoil } from "@/contexts/AtomContext";

export default async function AdminRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;
    const role = cookieStore.get('@nextauth.role')?.value;

    const api = setupApiClient(token as string);

    if (!token || role === 'vendedor') {
        redirect('/')
    }

    const enterprise = enterpriseQueries()
    const suppliers = suppliersQuery()

    const [respEnterprise, respSuppliers] = await Promise.all([
        api.post("/v1/find-db-query", { query: enterprise }),
        api.post("/v1/find-db-query", { query: suppliers })
    ])

    return (
        <Layout role={role} supplier={respSuppliers.data.returnObject.body} enterprise={respEnterprise.data.returnObject.body}>
            <Recoil>
                {children}
            </Recoil>
        </Layout>
    )
}