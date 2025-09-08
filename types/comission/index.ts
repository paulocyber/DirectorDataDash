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

export type ItemsCommissionCalculationData = {
  sellerName: string;
  sellerId: string;
  sellerExternalId: string;
  commission: ItemsComission;
  totalSale: number;
  totalCommission: number;
};

export type ItemsComissionCalculation1Data = {
  sellerName: string;
  sellerId: string;
  sellerExternalId: string;
  commission: {
    client: {
      value: number;
      commissionPercentage: number;
    };
    valuePerSale: {
      value: number;
      commissionPercentage: number;
    };
    paymentMethod: {
      value: number;
      commissionPercentage: number;
    };
    saleValue: {
      value: number;
      commissionPercentage: number;
    };
    default: {
      value: 1768.1;
      commissionPercentage: 1;
    };
  };
  totalSale: number;
  totalCommission: number;
};

export type ItemsComission = {
  client: {
    value: number;
    commissionPercentage: number;
  };
  valuePerSale: {
    value: number;
    commissionPercentage: number;
  };
  paymentMethod: {
    value: number;
    commissionPercentage: number;
  };
  saleValue: {
    value: number;
    commissionPercentage: number;
  };
  default: {
    value: number;
    commissionPercentage: number;
  };
};
