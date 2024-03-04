import { useState } from "react";

// Dados
import Data from "./../data/DataStock.json";

// Bibliotecas
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const StockTable = () => {
  const stockData = Data.estoque;

  const lowStock = stockData.filter(
    (data) => data.itens_abaixo_minimo < data.quantidade
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "produto", headerName: "PRODUTOS", width: 226 },
    { field: "quantidade", headerName: "ESTOQUE ATUAL", width: 250 },
    { field: "dia_recompra", headerName: "DIA DE RECOMPRA", width: 250 },
    {
      field: "quantidade_recompra",
      headerName: "QUANTIDADE RECOMPRA",
      width: 250,
    },
    { field: "itens_abaixo_minimo", headerName: "ITENS ABAIXO", width: 150 },
    { field: "valor_recompra", headerName: "VALOR DE RECOMPRA", width: 178 },
  ];

  return (
    <section className="container px-3 font-mono">
      <div className="w-full  overflow-auto rounded-lg shadow-lg">
        <div className="w-full">
          <Box>
            <Box
              height="400px"
              sx={{
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "bold",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
                "& .MuiDataGrid-cell": {
                  borderLeft: "1px solid #cecece",
                  fontSize: "12px",
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
                rows={lowStock}
                columns={columns}
                checkboxSelection={false}
              />
            </Box>
          </Box>
        </div>
      </div>
    </section>
  );
};

export default StockTable;
