// Bibliotecas
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";

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

interface BillsToPayPdfProps {
  allBillets: ItemsBillsToPay[];
  overdueBills: ItemsBillsToPay[];
  billetFilter: ItemsBillsToPay[];
  dateStart: string;
  dateEnd: string;
}

export default function BillsToPayPdf({
  allBillets,
  overdueBills,
  billetFilter,
  dateStart,
  dateEnd,
}: BillsToPayPdfProps) {
  pdfMake.vfs = pdfFonts.vfs;

  const openBills = allBillets.filter(
    (bill: ItemsBillsToPay) =>
      bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4"
  );

  const paidBills = allBillets.filter(
    (bill: ItemsBillsToPay) => bill.STATUS_PGM === "2"
  );

  const tableBody = [
    [
      {
        text: "Status",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Data",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Valor",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Descrição",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Natureza do Custo",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Categoria Da Despesa",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Centro de Custo",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
    ],
    ...billetFilter.map((bill, index) => [
      {
        text: bill.STATUS_PGM === "2" ? "Pago" : "Em Aberto",
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.DATA_VENCIMENTO_PGM.split(" ")[0],
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: formatCurrency(Number(bill.VALOR_PGM.replace(",", "."))),
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.NUMERO_DOCUMENTO_PGM,
        fontSize: 7,
        alignment: "left",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.GRUPO_CENTRO,
        fontSize: 7,
        alignment: "left",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.NOME_PSS,
        fontSize: 7,
        alignment: "left",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: bill.CENTRO_CUSTO,
        fontSize: 7,
        alignment: "left",
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
            text: "Relatório do Contas a Pagar",
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
            text: `Valores em Aberto: ${formatCurrency(
              openBills.reduce(
                (acc, bill) => acc + Number(bill.VALOR_PGM.replace(",", ".")),
                0
              )
            )}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Valores Vencidos: ${formatCurrency(
              overdueBills.reduce(
                (acc, bill) =>
                  acc + Number(bill.RESTANTE_PGM.replace(",", ".")),
                0
              )
            )}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
            color: "red",
          },
          {
            text: `Valores Pagos: ${formatCurrency(
              paidBills.reduce(
                (acc, bill) =>
                  acc + Number(bill.VALOR_PAGO_PGM.replace(",", ".")),
                0
              )
            )}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Total de boletos pagos: ${paidBills.length}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
        ],
        columnGap: 10, // Espaçamento entre os "cards"
      },
      {
        table: {
          headerRows: 1,
          widths: [38, 42, 45, "*", "*", "*", "*"],
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
