export type ItemsSellers = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  externalId: string;
  user: {
    id: number;
    username: string;
    role: string;
    ativo: boolean;
    criado_em: string;
    atualizado_em: string;
  };
};
