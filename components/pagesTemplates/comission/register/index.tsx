"use client";

// Componentes
import RegisterSeller from "@/components/forms/registerSeller";

// Bibliotecas
import { Tab, Tabs } from "@heroui/react";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Utils

// Next

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
import { setupApiClient } from "@/utils/fetchs/api";
import RegisterRule from "@/components/forms/registerRule";
interface RegisterComissionProps {
  paymentMethodData: TypeFilterProps[];
  employeesData: TypeFilterProps[];
  peopleData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
  commissionRegisteredSellersData: TypeFilterProps[];
}

export default function RegisterComission({
  paymentMethodData,
  employeesData,
  peopleData,
  sellersData,
  commissionRegisteredSellersData,
}: RegisterComissionProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);

  return (
    <Tabs aria-label="Options" variant="underlined">
      <Tab key="sellers" title="Registrar Vendedores">
        <RegisterSeller
          employeesData={employeesData}
          sellersData={sellersData}
        />
      </Tab>
      <Tab key="comissions" title="Registrar Regra">
        <RegisterRule
          commissionRegisteredSellersData={commissionRegisteredSellersData}
          paymentMethodData={paymentMethodData}
          peopleData={peopleData}
          sellersData={sellersData}
        />
      </Tab>
    </Tabs>
  );
}
