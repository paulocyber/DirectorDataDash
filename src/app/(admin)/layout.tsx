// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Componentes
import { Layout } from "@/components/ui/layout";

// React
import { ReactNode } from "react";

// Biblioteca
import { setupApiClient } from "@/services/api";

// Utils
import { companyQueries } from "@/utils/queries/employees";
import { suppliersQueries } from "@/utils/queries/suppliers";

export default async function AdminRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    const api = setupApiClient(token)

    if (!token || ['vendedor', 'vendedora'].includes(role)) {
        redirect('/')
    }

    const enterpriseQuery = companyQueries()
    const suppliers = suppliersQueries()

    const [responseCompany, responseSuppliers] = await Promise.all([
        api.post("/v1/find-db-query", { query: enterpriseQuery }),
        api.post("/v1/find-db-query", { query: suppliers }),
    ])

    return (
        <Layout
            role={role}
            enterprises={responseCompany.data.returnObject.body}
            suppliers={responseSuppliers.data.returnObject.body}
        >
            {children}
        </Layout>
    )
}