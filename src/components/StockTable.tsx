import { useState } from 'react';

// Utils

// Bibliotecas
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const StockTable = () => {
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'produtos', headerName: 'PRODUTOS', width: 214 },
        { field: 'quantidade', headerName: 'ESTOQUE ATUAL', width: 180 },
        { field: 'dia_recompra', headerName: 'DIA DE RECOMPRA', width: 150 },
        { field: 'quantidade_recompra', headerName: 'QUANTIDADE RECOMPRA', width: 240 },
        { field: 'itens_abaixo_minimo', headerName: 'ITENS ABAIXO', width: 150 },
    ];

    const rows = [
        { id: 1, produtos: 'Produto de', quantidade: 30, dia_recompra: '24/12/2023', quantidade_recompra: 45, itens_abaixo_minimo: 50 },
        { id: 2, produtos: 'Produto asdc', quantidade: 24, dia_recompra: '27/12/2023', quantidade_recompra: 50, itens_abaixo_minimo: 25 },
        { id: 3, produtos: 'Lannister', quantidade: 50, dia_recompra: '29/12/2023', quantidade_recompra: 30, itens_abaixo_minimo: 150 },
        { id: 4, produtos: 'Produto vfds', quantidade: 175, dia_recompra: '04/01/2024', quantidade_recompra: 45, itens_abaixo_minimo: 200 },
        { id: 5, produtos: 'Produto sdx', quantidade: 100, dia_recompra: '09/01/2024', quantidade_recompra: 30, itens_abaixo_minimo: 150 },
        { id: 6, produtos: 'Produto qw5', quantidade: 130, dia_recompra: '11/01/2024', quantidade_recompra: 40, itens_abaixo_minimo: 180 },
        { id: 7, produtos: 'Produto zxs', quantidade: 160, dia_recompra: '05/06/2023', quantidade_recompra: 90, itens_abaixo_minimo: 240 },
    ]

    return (
        <div className="bg-white shadow-lg rounded-xl lg:col-span-2">

            <div className='flex items-center justify-between w-full'>
                <div className="py-5 px-5">
                    <h1 className='font-bold md:text-lg text-sm'>Lucro por Produto</h1>
                </div>
            </div>

            <section className="container  mx-auto px-3 font-mono h-[420px]">
                <div className="w-full mb-8  overflow-auto rounded-lg shadow-lg">
                    <div className="w-full">
                        <Box>
                            <Box
                                height="400px"
                                sx={{
                                    "& .MuiDataGrid-columnHeader": {
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "white",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderLeft: "1px solid #cecece",
                                        fontSize: "12px"
                                    },
                                    "& .MuiDataGrid-footer": {
                                        backgroundColor: "#efefef",
                                        borderTop: "1px solid #ccc",
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        color: "#555",
                                    },
                                    "& .MuiDataGrid-pageInfo": {
                                        fontSize: "0.9rem",
                                        margin: "0 10px",
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    checkboxSelection={false}
                                    className=""

                                />
                            </Box>
                        </Box>
                    </div>
                </div>
            </section >

        </div >
    )
}

export default StockTable