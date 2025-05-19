// Bibliotecas
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

type PageSize =
  | "A4"
  | "A3"
  | "A5"
  | "LETTER"
  | "LEGAL"
  | { width: number; height: number };

type CreatePdf = {
  pageSize: PageSize;
  pageMargins: [number, number, number, number];
  header?: any;
  content: any[];
  footer?: (currentPage: number, pageCount: number) => any;
  styles?: Record<string, any>;
};

interface BillsToReceiveProps {
  token: string;
  allBillsData: ItemsBillsToReceiveData[];
  openBillsData: ItemsBillsToReceiveData[];
  dateStart: string;
  dateEnd: string;
}

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(" ")[0].split("/");
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

export default async function BillsToReceivePdf({
  token,
  allBillsData,
  openBillsData,
  dateStart,
  dateEnd,
}: BillsToReceiveProps) {
  pdfMake.vfs = pdfFonts.vfs;
  const openBills = allBillsData.filter(
    (bill) => bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );

  const getMostRecentPaidBills = (bills: ItemsBillsToReceiveData[]) => {
    const today = new Date();

    const paidBills = bills.filter(
      (bill) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
    );

    if (paidBills.length === 0) return [];

    const sortedBills = paidBills.sort((a, b) => {
      const dateA = parseDate(a.DATA_RECEBIMENTO_RCI);
      const dateB = parseDate(b.DATA_RECEBIMENTO_RCI);

      return (
        Math.abs(today.getTime() - dateA.getTime()) -
        Math.abs(today.getTime() - dateB.getTime())
      );
    });

    const closestDate = parseDate(sortedBills[0].DATA_RECEBIMENTO_RCI);

    return sortedBills.filter(
      (bill) =>
        parseDate(bill.DATA_RECEBIMENTO_RCI).getTime() === closestDate.getTime()
    );
  };

  const recentPaidBills = getMostRecentPaidBills(allBillsData);

  const overdueBills = allBillsData.filter(
    (bill: ItemsBillsToReceiveData) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) > 0
  );
  const totalPendingAmount = calculateTotalByKey(
    overdueBills,
    (bill) => bill.RESTANTE_RCB
  );
  const totalReceipt = calculateTotalByKey(openBills, (bill) => bill.RESTANTE_RCB);

  const totalOpenAmount = calculateTotalByKey(
    openBills,
    (bill) => bill.RESTANTE_RCB
  );

  const totalPaid = calculateTotalByKey(
    recentPaidBills,
    (bill) => bill.VALOR_PAGO_RCB
  );

  const sortedOpenBills = [...openBillsData].sort((a, b) => {
    const dateA = parseDate(a.DATA_VENCIMENTO_RCB.split(" ")[0]);
    const dataB = parseDate(b.DATA_VENCIMENTO_RCB.split(" ")[0]);

    return dataB.getTime() - dateA.getTime();
  });



  const tableBody = [
    [
      {
        text: "N° Dav",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Data do Vencimento",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Vendedor",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Valor Restante",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Valor Pago",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
    ],
    ...sortedOpenBills.map((bill, index) => [
      {
        text: bill.ID_ORIGEM,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.DATA_VENCIMENTO_RCB.split(" ")[0],
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.VENDEDOR,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: formatCurrency(Number(bill.RESTANTE_RCB.replace(",", "."))),
        fontSize: 7,
        alignment: "center",
        color: "red",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: formatCurrency(
          Number(
            bill.VALOR_PAGO_RCB ? bill.VALOR_PAGO_RCB.replace(",", ".") : 0
          )
        ),
        fontSize: 7,
        alignment: "center",
        color: "green",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
    ]),
  ];

  const docDefinition: CreatePdf = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    header: [
      {
        columns: [
          {
            text: "Relatório do Contas a Receber",
            style: "header",
            alignment: "left",
            margin: [10, 15, 15, 8],
            fontSize: 14,
            bold: true,
          },
          {
            text: `${dateStart} - ${dateEnd}`,
            alignment: "right",
            fontSize: 10,
            margin: [0, 15, 10, 0],
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 595 - 80,
            y2: 0,
            lineWidth: 1,
            color: "#4a90e2",
          },
        ],
      },
    ],

    content: [
      {
        columns: [
          {
            text: `Notas vencidas: ${formatCurrency(totalPendingAmount)}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
            color: "red",
          },
        ],
        columnGap: 10, // Espaçamento entre os "cards"
      },
      {
        table: {
          headerRows: 1,
          widths: [80, 120, 120, 80, 80],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex: any) => (rowIndex === 0 ? "#1d4ed8" : null),
          hLineWidth: () => 0.1,
          vLineWidth: () => 0.1,
          hLineColor: () => "#CCCCCC",
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
        alignment: "center",
        margin: [0, 0, 0, 0],
      },
      {
        columns: [
          {
            text: `
             Total da Mercadoria: \n ${formatCurrency(totalReceipt)}

             Valor pago: \n ${formatCurrency(totalPaid)}

             Saldo á pagar: \n ${formatCurrency(totalOpenAmount - totalPaid)}
             `,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 0],
            alignment: "left",
            width: 100,
          },
        ],
      },
    ],
    footer: (currentPage: number, pageCount: number) => [
      {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: "center",
        fontSize: 8,
      },
    ],
  };

  pdfMake.createPdf(docDefinition).open();
}
