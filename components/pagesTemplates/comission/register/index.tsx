"use client";

// Componentes
import RegisterSeller from "@/components/forms/registerSeller";
import RegisterRule from "@/components/forms/registerRule";

// Bibliotecas
import { Tab, Tabs } from "@heroui/react";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
interface RegisterComissionProps {
  paymentMethodData: TypeFilterProps[];
  peopleData: TypeFilterProps[];
  commissionRegisteredSellersData: TypeFilterProps[];
}

export default function RegisterComission({
  paymentMethodData,
  peopleData,
  commissionRegisteredSellersData,
}: RegisterComissionProps) {
  return (
    <RegisterRule
      commissionRegisteredSellersData={commissionRegisteredSellersData}
      paymentMethodData={paymentMethodData}
      peopleData={peopleData}
    />
  );
}
