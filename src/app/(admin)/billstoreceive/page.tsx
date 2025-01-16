// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Componentes
import LayoutBillsToReceive from "@/components/layouts/billsToReceive";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

export const metadata: Metadata = {
    title: "Relatório dos Contas a receber",
    description: "Informações o que tem a receber",
};

export default async function BillsToReceivePage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { year, today } = getCurrentDateDetails()
    const { billsToReceiveAll, topClientLate, summaryReceive, summaryReceiveRelease } = billsToReceiveQueries({ dateInit: '2023/01/01', dateEnd: today, year })

    const [allBillsResponse, lateClientsResponse, summaryBilletResponse, summaryReceiveReleaseResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveAll }),
        api.post("/v1/find-db-query", { query: topClientLate }),
        api.post("/v1/find-db-query", { query: summaryReceive }),
        api.post("/v1/find-db-query", { query: summaryReceiveRelease }),
    ]);

    const overdueBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToReceiveData) =>
            (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
            parseInt(bill.ATRASO_RCB) > 0
    );

    const openBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToReceiveData) =>
            (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
            parseInt(bill.ATRASO_RCB) === 0
    );

    const paidBills = allBillsResponse.data.returnObject.body.filter(
        (bill: ItemsBillsToReceiveData) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
    );

    const totalOverdueAmount = calculateTotalByKey(overdueBills, (bill: ItemsBillsToReceiveData) => bill.RESTANTE_RCB);
    const totalOpenAmount = calculateTotalByKey(openBills, (bill: ItemsBillsToReceiveData) => bill.RESTANTE_RCB);
    const totalReceivedAmount = calculateTotalByKey(paidBills, (bill: ItemsBillsToReceiveData) => bill.VALOR_PAGO_RCB);

    const receivableSummary = [
        { name: "Valor em atraso", value: totalOverdueAmount },
        { name: "Valor em aberto", value: totalOpenAmount },
        { name: "Valor recebido", value: totalReceivedAmount },
    ];

    const topClientsLate = convertFieldsToNumber<ItemsBillsToReceiveData>(
        lateClientsResponse.data.returnObject.body,
        ['RESTANTE_RCB']
    ).sort((a, b) => parseInt(b.RESTANTE_RCB) - parseInt(a.RESTANTE_RCB))

    return (
        <LayoutBillsToReceive
            allBillsData={allBillsResponse.data.returnObject.body}
            topClientsLateData={topClientsLate}
            summaryBilletData={summaryBilletResponse.data.returnObject.body}
            summaryReceiveReleaseData={summaryReceiveReleaseResponse.data.returnObject.body}
            summaryOfReceivableData={receivableSummary}
            today={today}
        />
    )
}