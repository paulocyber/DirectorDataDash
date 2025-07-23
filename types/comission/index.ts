export type ItemsComissionData = {
  id: string;
  paymentMethod: string;
  paymentMethodExternalId: string;
  commissionPercentage: number;
  valuePerSale: number;
  saleValue: number;
  client: string;
  clientExternalId: string;
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    externalId: string;
  };
};
