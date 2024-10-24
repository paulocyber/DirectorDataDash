// Bibliotecas
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { BillsToPayData } from "@/types/billsToPay";

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

export default function billsToPayPDF(
  allBillets: BillsToPayData[],
  amountInOpen: number,
  amountExpired: number,
  amountPaid: number,
  quantidadeAmountPaid: string
) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const reportTitle: any = [
    {
      text: "Relatório de Contas a Pagar",
      style: "header",
      alignment: "center",
      fontSize: 12, // Aumentado para destacar
      bold: true,
      margin: [0, 20, 0, 20], // Margem ajustada
    },
  ];

  const data = allBillets.map((billet) => {
    return [
      {
        text: billet.STATUS_PGM != "2" ? "Em aberto" : "Pago",
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: billet.DATA_VENCIMENTO_PGM.split(" ")[0],
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: formatCurrency(Number(billet.VALOR_PGM.replace(",", "."))),
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "right",
      },
      {
        text: billet.NUMERO_DOCUMENTO_PGM,
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: billet.GRUPO_CENTRO,
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: billet.NOME_PSS,
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: billet.CENTRO_CUSTO,
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
      {
        text: billet.DESCRICAO_FRM,
        fontSize: 5,
        margin: [0, 2, 0, 2],
        alignment: "center",
      },
    ];
  });

  const details: any = [
    {
      table: {
        headerRows: 1,
        widths: [
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
          "auto",
        ],
        body: [
          [
            {
              text: "Status",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Vencimento",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Valor",
              style: "tableHeader",
              fontSize: 8,
              alignment: "right",
            },
            {
              text: "Nº Documento",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Centro de Custo",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Nome",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Centro",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Descrição",
              style: "tableHeader",
              fontSize: 8,
              alignment: "center",
            },
          ],
          ...data,
        ],
      },
      layout: {
        fillColor: (rowIndex: number) =>
          rowIndex % 2 === 0 ? "#f0f0f0" : null,
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
      },
    },
  ];

  const totalAmountInOpen: any = {
    text: `Valor Total em Aberto: ${formatCurrency(amountInOpen)}`,
    alignment: "right",
    fontSize: 9,
    bold: true,
    margin: [0, 10, 0, 5],
    color: "blue", // Cor para destacar
  };

  const totalAmountExpired: any = {
    text: `Valor Total de Boletos Vencidos: ${formatCurrency(amountExpired)}`,
    alignment: "right",
    fontSize: 9,
    bold: true,
    margin: [0, 5, 0, 5],
    color: "red", // Cor para destacar
  };

  const totalAmountPaid: any = {
    text: `Total de Boletos Pagos: ${formatCurrency(amountPaid)}`,
    alignment: "right",
    fontSize: 9,
    bold: true,
    margin: [0, 5, 0, 5],
    color: "green", // Cor para destacar
  };

  const quantityAmountPaid: any = {
    text: `Quantidade de Boletos Pagos: ${quantidadeAmountPaid}`,
    alignment: "right",
    fontSize: 9,
    bold: true,
    margin: [0, 5, 0, 5],
  };

  function footer(currentPage: number, pageCount: number): any[] {
    return [
      {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: "right",
        fontSize: 8,
        margin: [0, 0, 20, 5],
        color: "#888888", // Tom mais suave
      },
    ];
  }

  const docDefinitions: CreatePdf = {
    pageSize: "A4",
    pageMargins: [30, 60, 30, 40],
    header: reportTitle,
    content: [
      details,
      { text: "", margin: [0, 10, 0, 10] }, // Espaço vazio para separação
      totalAmountInOpen,
      totalAmountExpired,
      totalAmountPaid,
      quantityAmountPaid,
    ],
    footer: footer,
  };

  pdfMake.createPdf(docDefinitions).open();
}
