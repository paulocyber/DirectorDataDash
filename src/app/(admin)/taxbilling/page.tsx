// Utils
import { setupApiClient } from "@/services/api";
import { groupSumBy } from "@/utils/filters/groupSumBy";
import getCurrentDateDetails from "@/utils/getDate"
import { TaxQueries } from "@/utils/queries/tax"

// Componentes
import LayoutTaxBilling from "@/components/layouts/taxBilling";

// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TaxBilling() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    const api = setupApiClient(token as string)

    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const { today, year, month } = getCurrentDateDetails()
    const { nfce, nfe } = TaxQueries({ dateInit: `${year}/${month}/01`, dateEnd: today })

    const [responseNfce, responseNfe] = await Promise.all([
        api.post("/v1/find-db-query", { query: nfce }),
        api.post("/v1/find-db-query", { query: nfe }),
    ])
    const notesByCompany = [...responseNfce.data.returnObject.body, ...responseNfe.data.returnObject.body]
    const billingByCompany = groupSumBy(notesByCompany, { key: "EMPRESA", valueKey: 'VALOR_LIQUIDO_SDS' }).sort((a, b) => b.value - a.value)

    return (
        <LayoutTaxBilling
            taxInvoicingData={billingByCompany}
            dateInit={`${year}/${month}/01`}
            dateEnd={today}
        />
    )
} 