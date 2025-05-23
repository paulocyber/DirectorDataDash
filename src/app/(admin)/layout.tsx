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
import { employeesQueries, PeopleQueries } from "@/utils/queries/people";
import { formOfPaymentsQueries } from './../../utils/queries/formOfPayments/index';
import { CostCenterQueries } from "@/utils/queries/costCenter";

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
    const people = PeopleQueries()
    const employees = employeesQueries()
    const formOfPayments = formOfPaymentsQueries()
    const costCenter = CostCenterQueries()

    const [responseCompany, responseSuppliers, responsePeople, responseEmployees, responseFormOfPayments, responseCostCenter] = await Promise.all([
        api.post("/v1/find-db-query", { query: enterpriseQuery }),
        api.post("/v1/find-db-query", { query: suppliers }),
        api.post("/v1/find-db-query", { query: people }),
        api.post("/v1/find-db-query", { query: employees }),
        api.post("/v1/find-db-query", { query: formOfPayments }),
        api.post("/v1/find-db-query", { query: costCenter }),
    ])

    return (
        <Layout
            role={role}
            enterprises={responseCompany.data.returnObject.body}
            suppliers={responseSuppliers.data.returnObject.body}
            people={responsePeople.data.returnObject.body}
            employees={responseEmployees.data.returnObject.body}
            formOfPayments={responseFormOfPayments.data.returnObject.body}
            costCenter={responseCostCenter.data.returnObject.body}
        >
            {children}
        </Layout>
    )
}