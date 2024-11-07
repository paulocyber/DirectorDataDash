// Bibliotecas
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "./../../../mask/truncateString/index";

// Tipagem
import { profitsFromSale, salesProgressData } from "@/types/sales";

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
  header: any[];
  content: any[];
  footer: (currentPage: number, pageCount: number) => any[];
};

export default function SalesGoalsPDF(
  sellersAndGoals: profitsFromSale[],
  progressSalesRelatory: salesProgressData[],
  date: string
) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const formattedSales = sellersAndGoals.map((sale) => ({
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

  const topSellers = formattedSales
    .sort((a, b) => parseFloat(b.VALOR_LIQUIDO) - parseFloat(a.VALOR_LIQUIDO))
    .slice(0, 3);

  const topTableBody = [
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
        text: vendedor.VALOR_LIQUIDO,
        fontSize: 7,
        alignment: "center",
        fillColor: index % 2 === 0 ? "#f2f6fa" : null,
      },
    ]),
  ];

  const tableBody = [
    // Cabeçalho da tabela com as colunas renomeadas
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
    // Corpo da tabela, excluindo a coluna ID_VENDEDOR
    ...formattedSales.map((sale, index) => [
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
      // ...
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
      // ...
    ]),
  ];

  const docDefinition: CreatePdf = {
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
            text: date,
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
        // Seção dos cards com os valores
        columns: [
          {
            text: `Meta grupo play: ${formatCurrency(progressSalesRelatory[2].value)}`, // Exemplo de valor da meta
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Total lucro: ${formatCurrency(progressSalesRelatory[1].value)}`, // Exemplo de valor do lucro
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          {
            text: `Vendas: ${formatCurrency(progressSalesRelatory[0].value)}`, // Exemplo de valor das vendas
            fontSize: 10,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
        ],
        columnGap: 10, // Espaçamento entre os "cards"
      },
      {
        // Tabela principal
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*"],
          body: tableBody,
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
          body: topTableBody,
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
    footer: (currentPage: number, pageCount: number) => [
      {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: "center",
        fontSize: 8,
      },
    ],
  };

  // Gerar o PDF
  pdfMake.createPdf(docDefinition).open();
}
