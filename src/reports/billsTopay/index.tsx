// Biblioteca
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Biblioteca
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";

type PageSize = 'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL' | { width: number; height: number };

type CreatePdf = {
    pageSize: PageSize;
    pageMargins: [number, number, number, number];
    header: any[];
    content: any[];
    footer: (currentPage: number, pageCount: number) => any[];
}

export default function billsToPayPDF(billetPaidAndOpen: BillsToPayItem[], amountInOpen: number, amountExpired: number, amountPaid: number, quantidadeAmountPaid: string) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle: any = [
        {
            text: 'Relatório do contas a pagar',
            style: 'subheader',
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 15, 0, 15], // Esquerda, Cima, Direita, Baixo
            italics: true
        }
    ];

    const data = billetPaidAndOpen.map((billet) => {
        return [
            { text: billet.STATUS_PGM != "2" ? "Em aberto" : "Pago", fontSize: 6, border: [false, false, false, true] },
            { text: billet.DATA_VENCIMENTO_PGM.split(' ')[0], fontSize: 6, border: [false, false, false, true] },
            { text: formatCurrency(Number(billet.VALOR_PGM.replace(",", "."))), fontSize: 6, border: [false, false, false, true] },
            { text: billet.NUMERO_DOCUMENTO_PGM, fontSize: 6, border: [false, false, false, true] },
            { text: billet.GRUPO_CENTRO, fontSize: 6, border: [false, false, false, true] },
            { text: billet.NOME_PSS, fontSize: 6, border: [false, false, false, true] },
            { text: billet.CENTRO_CUSTO, fontSize: 6, border: [false, false, false, true] },
            { text: billet.DESCRICAO_FRM, fontSize: 6, border: [false, false, false, true] },
        ]
    });

    const details: any = [
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                    [
                        { text: '#', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'DT. VENC.', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'VALOR.', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'DESCRIÇÃO', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'NAT. CUSTO', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'CAT. DESP.', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'CTR. CUSTO', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                        { text: 'FRM. PGTO.', style: 'tableHeader', fontSize: 7, bold: true, border: [false, true, false, true] },
                    ],
                    ...data
                ]
            }
        }
    ];

    const totalAmountInOpen: any = {
        text: `Valor total em aberto: ${formatCurrency(amountInOpen)}`,
        alignment: 'right',
        fontSize: 8,
        bold: true,
        margin: [0, 5, 0, 5], // Margem: esquerda, cima, direita, baixo
    };

    const totalAmountExpired: any = {
        text: `Valor Total de Boletos Vencidos: ${formatCurrency(amountExpired)}`,
        alignment: 'right',
        fontSize: 8,
        bold: true,
        margin: [0, 5, 0, 5], // Margem: esquerda, cima, direita, baixo
    };

    const totalAmountPaid: any = {
        text: `Total de boletos pagos: ${formatCurrency(amountPaid)}`,
        alignment: 'right',
        fontSize: 8,
        bold: true,
        margin: [0, 5, 0, 5], // Margem: esquerda, cima, direita, baixo
    };

    const quantityAmountPaid: any = {
        text: `Total de boletos pagos: ${quantidadeAmountPaid}`,
        alignment: 'right',
        fontSize: 8,
        bold: true,
        margin: [0, 5, 0, 5], // Margem: esquerda, cima, direita, baixo
    };

    function footer(currentPage: number, pageCount: number): any[] {
        return [
            {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right',
                fontSize: 9,
                bold: true
            }
        ];
    }

    const docDefinitions: CreatePdf = {
        pageSize: 'A4',
        pageMargins: [20, 40, 15, 40],
        header: reportTitle,
        content: [details, totalAmountInOpen, totalAmountExpired, totalAmountPaid, quantityAmountPaid],
        footer: footer
    };

    pdfMake.createPdf(docDefinitions).open();
}
