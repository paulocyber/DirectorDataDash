"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { RenderCell } from "@/components/renderCell/sellers";

// Dados
import columns from "@/data/columns/sellers/columns.json";

// Next
import { useTopLoader } from "nextjs-toploader";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Tipagem
import { ItemsSellers } from "@/types/sellers";
interface LayoutSellersProps {
  data: ItemsSellers[];
}
// Vendor lider tabela 2 todos
export default function LayoutSellers({ data }: LayoutSellersProps) {
  const [sellers, setSellers] = useState(data);
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const loader = useTopLoader();
  const api = setupApiClient(token);

  async function handleRefresh() {
    setLoading(true);

    const res = await api.get("/v1/sellers");
    setSellers(res.data.returnObject.body);
    setLoading(false);
  }

  return (
    <main className="w-full">
      <Container>
        <ToolBar
          title="Gereciamento de vendedor"
          titleAdd="Adicionar vendedor"
          handleRefreshClick={handleRefresh}
          handleAdd={() => {
            loader.start();
            redirect("/sellers/register");
          }}
        />
        <Table
          data={sellers}
          columns={columns}
          loading={loading}
          renderCell={(item, columnUid) => (
            <RenderCell
              item={item}
              columnKey={columnUid}
              onEdit={(id) => {
                loader.start();
                redirect(`/sellers/edit/${id}`);
              }}
              onDelete={async (id: string) => {
                await api.delete(`/v1/sellers/${id}`);
                handleRefresh();
              }}
            />
          )}
        />
      </Container>
    </main>
  );
}
