"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import Table from "@/components/ui/tables";
import { renderCell } from "@/components/renderCell/comissions";

// Dados
import collumns from "@/data/columns/comission/columns.json";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Next
import { redirect } from "next/navigation";

// Bibliotecas
import { useTopLoader } from "nextjs-toploader";

// Tipagem
import { ItemsComissionData } from "@/types/comission";
interface LayoutComissionProps {
  data: ItemsComissionData[];
}

export default function LayoutComission({ data }: LayoutComissionProps) {
  const [commissionsRules, setCommissionRules] = useState(data);
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);
  const loader = useTopLoader();

  async function handleRefresh() {
    setLoading(true);

    const res = await api.get("/v1/commission-rules");

    setCommissionRules(res.data.returnObject.body);
    setLoading(false);
  }

  function handleRegisterRule() {
    loader.start();
    redirect("/commision/register");
  }

  return (
    <Container>
      <ToolBar
        title="Gestão de Comissionamento"
        titleAdd="Nova regra"
        handleRefreshClick={handleRefresh}
        handleAdd={handleRegisterRule}
      />
      <Table
        data={commissionsRules}
        columns={collumns}
        renderCell={renderCell}
        loading={loading}
      />
    </Container>
  );
}
