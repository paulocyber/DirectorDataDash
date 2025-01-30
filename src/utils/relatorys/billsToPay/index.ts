// Bibliotecas
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { groupSumBy } from "@/utils/filters/groupSumBy";

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
  status: string[];
  dateStart: string;
  dateEnd: string;
}

export default function BillsToPayPdf({
  allBillets,
  overdueBills,
  billetFilter,
  status,
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

  const aggregatedPayByBrand = groupSumBy(billetFilter, {
    key: "CENTRO_CUSTO",
    valueKey: status.includes("Em aberto") ? "VALOR_PGM" : "VALOR_PAGO_PGM",
  }).sort((a, b) => b.value - a.value);

  const summaryTable = {
    table: {
      headerRows: 1,
      widths: ["30%", "30%"],
      body: [
        [
          {
            text: "Centro de Custo",
            bold: true,
            alignment: "center",
            fillColor: "#1d4ed8",
            color: "#ffffff",
            fontSize: 8,
          },
          {
            text: "Valor Pago",
            bold: true,
            alignment: "center",
            fillColor: "#1d4ed8",
            color: "#ffffff",
            fontSize: 8,
          },
        ],
        ...aggregatedPayByBrand.map((item, index) => [
          {
            text: item.brand,
            fontSize: 7,
            alignment: "left",
            fillColor: index % 2 === 0 ? "#f2f6fa" : null,
          },
          {
            text: formatCurrency(item.value),
            fontSize: 7,
            alignment: "right",
            fillColor: index % 2 === 0 ? "#f2f6fa" : null,
          },
        ]),
      ],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => "#CCCCCC",
      vLineColor: () => "#CCCCCC",
      paddingTop: () => 3,
      paddingBottom: () => 3,
    },
    margin: [0, 10, 0, 0],
  };

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
        text: "Fornecedores",
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
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          summaryTable,
          {
            text: `Valores Pagos: ${formatCurrency(
              paidBills.reduce(
                (acc, bill) =>
                  acc + Number(bill.VALOR_PAGO_PGM.replace(",", ".")),
                0
              )
            )} \n
            Total de boletos pagos: ${paidBills.length}`,
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
