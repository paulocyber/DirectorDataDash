// BIbliotecas
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { PageSize } from "pdfmake/interfaces";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "@/utils/mask/truncateString";

// Tipagem
import { ItemsProfitsFromSales, ItemsSalesProgress } from "@/types/sales";
type CreatePdfItems = {
  pageSize: PageSize;
  pageMargins: [number, number, number, number];
  header?: any;
  content: any[];
  footer?: (currentPage: number, pageCount: number) => any;
  styles?: Record<string, any>;
};

interface SalesPdfProps {
  dateInit: string;
  dateEnd: string;
  company: string;
  salesProgressData: ItemsSalesProgress[];
  profitSales: ItemsProfitsFromSales[];
}

export default function SalesPdf({
  dateInit,
  dateEnd,
  company,
  salesProgressData,
  profitSales,
}: SalesPdfProps) {
  pdfMake.vfs = pdfFonts.vfs;

  const salesSummary = profitSales.map((sale) => ({
    ...sale,
    VALOR_LIQUIDO: formatCurrency(Number(sale.VALOR_LIQUIDO.replace(",", "."))),
    VALOR_LUCRO: formatCurrency(Number(sale.VALOR_LUCRO.replace(",", "."))),
    META_INDIVIDUAL: formatCurrency(
      Number(sale.META_INDIVIDUAL.replace(",", "."))
    ),
    MARGEM_LUCRO: sale.MARGEM_LUCRO
      ? (Number(sale.MARGEM_LUCRO.replace(",", ".")) * 100).toFixed(2) + "%"
      : "0%",
    BATEU_META:
      parseFloat(sale.VALOR_LIQUIDO.replace(",", ".")) >=
      parseFloat(sale.META_INDIVIDUAL)
        ? "sim"
        : "não",
  }));

  const topSellers = profitSales
    .sort(
      (a, b) =>
        Number(b.VALOR_LIQUIDO.replace(",", ".")) -
        Number(a.VALOR_LIQUIDO.replace(",", "."))
    )
    .slice(0, 3);

  const tableSales = [
    [
      {
        text: "Vendedor",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Meta Individual",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Total da Venda",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Lucro da Venda",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Margem de Lucro",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Bateu a Meta?", // Nova coluna
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
    ],
    ...salesSummary.map((sale, index) => [
      {
        text: truncateString(sale.APELIDO_PSS, 10),
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: sale.META_INDIVIDUAL,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: sale.VALOR_LIQUIDO,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: sale.VALOR_LUCRO,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: sale.MARGEM_LUCRO,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: sale.BATEU_META,
        fontSize: 7,
        alignment: "center",
        padding: [5, 5],
        color: sale.BATEU_META === "sim" ? "#ffffff" : "#000000",
        fillColor:
          sale.BATEU_META === "sim"
            ? "#14870c"
            : index % 2 === 0
              ? "#f2f6fa"
              : null,
      },
    ]),
  ];

  const salesRanking = [
    [
      {
        text: "Top 3 Vendedores",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
      {
        text: "Total da Venda",
        bold: true,
        fontSize: 8,
        alignment: "center",
        color: "#ffffff",
        fillColor: "#1d4ed8",
      },
    ],
    ...topSellers.map((vendedor, index) => [
      {
        text: truncateString(vendedor.APELIDO_PSS, 10),
        fontSize: 7,
        alignment: "center",
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
      {
        text: formatCurrency(Number(vendedor.VALOR_LIQUIDO.replace(",", "."))),
        fontSize: 7,
        alignment: "center",
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
    ]),
  ];

  const docDefinition: CreatePdfItems = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    header: [
      {
        columns: [
          {
            text: "Relatório de Vendas e Metas",
            style: "header",
            alignment: "left",
            margin: [10, 15, 15, 8],
            fontSize: 14,
            bold: true,
          },
          {
            text: `${dateInit} - ${dateEnd}`,
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
            text: `Meta ${company}: ${formatCurrency(salesProgressData[2].value)}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Total lucro: ${formatCurrency(salesProgressData[1].value)}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Vendas: ${formatCurrency(salesProgressData[0].value)}`,
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
        ],
        columnGap: 10,
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*"],
          body: tableSales,
        },
        layout: {
          fillColor: function (rowIndex: number) {
            return rowIndex === 0 ? "#1d4ed8" : null;
          },
          hLineWidth: () => 0.1,
          vLineWidth: () => 0.1,
          hLineColor: () => "#CCCCCC",
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
        alignment: "center",
        margin: [0, 20, 0, 0],
      },
      {
        // Tabela Top 3 Vendedores
        table: {
          headerRows: 1,
          widths: ["20%", "20%"],
          body: salesRanking,
        },
        layout: {
          fillColor: (rowIndex: any) => (rowIndex === 0 ? "#1d4ed8" : null),
          hLineWidth: () => 0.1,
          vLineWidth: () => 0.1,
          hLineColor: () => "#CCCCCC",
          paddingTop: () => 1,
          paddingBottom: () => 1,
        },
        alignment: "start",
        margin: [0, 8, 0, 0],
        width: "50%",
      },
    ],
    footer: (currentPage: number, pageCount: number) => {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: "center",
        fontSize: 8,
      };
    },
  };

  pdfMake.createPdf(docDefinition).open();
}
