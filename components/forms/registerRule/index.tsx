// React
import { useContext, useState } from "react";

// Componentes
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

// Bibliotecas
import {
  addToast,
  Autocomplete,
  Button,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import { AiOutlinePercentage } from "react-icons/ai";
import {
  FaCheck,
  FaMoneyBill,
  FaOrcid,
  FaRegUser,
  FaUser,
} from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";

// Next
import Link from "next/link";

// Utils
import { convertMaskPercent } from "@/utils/mask/formatPercent";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
import { TiWarning } from "react-icons/ti";
import { AuthContext } from "@/providers/auth";
import { setupApiClient } from "@/utils/fetchs/api";
interface RegisterRuleProps {
  commissionRegisteredSellersData: TypeFilterProps[];
  paymentMethodData: TypeFilterProps[];
  peopleData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
}

export default function RegisterRule({
  commissionRegisteredSellersData,
  paymentMethodData,
  peopleData,
  sellersData,
}: RegisterRuleProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [idPaymentMethod, setIdPaymentMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [valuePerSale, setValuePerSale] = useState("");
  const [saleValue, setSaleValue] = useState("");
  const [idClient, setIdClient] = useState("");
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);

  const clientCode = peopleData.filter((people) =>
    client
      ? String(client).toLowerCase() === people.APELIDO_PSS?.toLocaleLowerCase()
      : ""
  );
  const paymentCode = paymentMethodData.filter(
    (payment) =>
      payment.DESCRICAO_FRM?.toLocaleLowerCase() ===
      String(paymentMethod).toLowerCase()
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      console.log("ID: ", id);
      // await api.post("/v1/commission-rules", {
      //   paymentMethodExternalId: paymentCode[0].ID_FRM,
      //   paymentMethod,
      //   commissionPercentage,
      //   valuePerSale,
      //   saleValue,
      //   client: client ? client : "",
      //   clientExternalId: clientCode?.[0]?.ID_PSS ?? "",
      //   seller_id: id,
      // });

      addToast({
        title: "Vendedor cadastrado com sucesso!",
        description: "O vendedor foi registrado na regra de comissão.",
        color: "success",
        icon: <FaCheck />,
      });

      setId("");
      setName("");
    } catch (err) {
      console.log("Error: ", err);

      addToast({
        title: "Erro ao cadastrar regra",
        description:
          "Não foi possível registrar o regra. Verifique os dados e tente novamente.",
        color: "danger",
        icon: <TiWarning />,
      });
    }

    setLoading(false);
  }

  return (
    <Container>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Cadastrar Regra de Comissão
        </h2>
        <p className="text-gray-600 mt-1">
          Configure as condições e taxas para cálculo de comissões
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 py-5 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-4 gap-6">
          <Select
            labelPlacement="outside"
            className="w-full"
            label="Selecione Vendedor"
            placeholder="Selecione Vendedor"
            isRequired
            startContent={<FaRegUser className="text-gray-400 text-ls" />}
            variant="bordered"
            selectedKeys={new Set(id ? [id] : [])}
            onSelectionChange={(keys: string | Set<React.Key>) => {
              const id = Array.from(keys)[0] as string;

              setId(id);
            }}
          >
            {commissionRegisteredSellersData.map((seller) => (
              <SelectItem key={seller.id}>{seller.name}</SelectItem>
            ))}
          </Select>
          <Select
            labelPlacement="outside"
            className="w-full"
            label="Selecione Metodo de pagamento"
            placeholder="Selecione Metodo de pagamento"
            isRequired
            startContent={<FaMoneyBill className="text-gray-400 text-ls" />}
            variant="bordered"
            selectedKeys={new Set(idPaymentMethod ? [idPaymentMethod] : [])}
            onSelectionChange={(keys: string | Set<React.Key>) => {
              const id = Array.from(keys)[0] as string;
              const name = paymentMethodData.find(
                (paymentMethod) => String(paymentMethod.ID_FRM) === id
              );

              setIdPaymentMethod(id);
              setPaymentMethod(name?.DESCRICAO_FRM ?? "");
            }}
          >
            {paymentMethodData.map((paymentMethod) => (
              <SelectItem key={paymentMethod.ID_FRM}>
                {paymentMethod.DESCRICAO_FRM}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Porcentagem da Comissão"
            labelPlacement="outside"
            variant="bordered"
            name="commissionPercentage"
            isRequired
            placeholder="Ex: 1%"
            value={commissionPercentage}
            onChange={(e) => {
              setCommissionPercentage(e.target.value);
            }}
            classNames={{
              input: "",
            }}
            startContent={
              <AiOutlinePercentage className="text-gray-400 text-ls" />
            }
          />

          <Input
            label="Valor por venda"
            labelPlacement="outside"
            variant="bordered"
            name="valuePerSale"
            isRequired
            placeholder="Ex: 1%"
            value={valuePerSale}
            onChange={(e) => setValuePerSale(e.target.value)}
            classNames={{
              input: "",
            }}
            startContent={
              <AiOutlinePercentage className="text-gray-400 text-ls" />
            }
          />

          <Input
            label="Valor de venda"
            labelPlacement="outside"
            variant="bordered"
            name="valuePerSale"
            isRequired
            placeholder="Ex: 1%"
            value={saleValue}
            onChange={(e) => setSaleValue(e.target.value)}
            classNames={{
              input: "",
            }}
            startContent={
              <AiOutlinePercentage className="text-gray-400 text-ls" />
            }
          />

          <Autocomplete
            labelPlacement="outside"
            className="w-full"
            label="Cliente"
            placeholder="Ex: clienteX"
            startContent={<FaRegUser className="text-gray-400 text-ls" />}
            variant="bordered"
            selectedKey={idClient || null}
            onSelectionChange={(key: React.Key | null) => {
              if (key === null) return;
              const id = String(key);
              const person = peopleData.find((p) => String(p.ID_PSS) === id);
              setClient(person?.APELIDO_PSS ?? "");
              setIdClient(id);
            }}
          >
            {peopleData.map((people) => (
              <SelectItem key={people.ID_PSS}>{people.APELIDO_PSS}</SelectItem>
            ))}
          </Autocomplete>
        </div>
        <div className="px-4 pt-1">
          <Input
            labelPlacement="outside"
            className="w-full"
            label="Código do cliente"
            placeholder="Código do cliente"
            startContent={<FaOrcid className="text-gray-400 text-ls" />}
            classNames={{
              input: "",
              description: "text-red-800 font-extrabold",
            }}
            variant="bordered"
            isDisabled={true}
            value={clientCode.length > 0 ? clientCode[0].ID_PSS : ""}
            description="OBS: VERIFIQUE SE O CÓDIGO DO CLIENTE ESTÁ IGUAL AO QUE CONSTA NO MULTSISTEM."
          />
        </div>
        <div className="w-full px-4">
          <Divider className="" />
        </div>

        <div className="px-4 justify-end space-x-4 flex">
          <Button
            type="submit"
            isLoading={loading}
            className="w-56"
            color="primary"
            startContent={
              !loading && <FiSave className="text-gray-200 text-lg" />
            }
          >
            Salvar Vendedor
          </Button>
          <Link href="/commision">
            <Button
              className="w-56"
              variant="ghost"
              startContent={<IoArrowBack className="text-gray-600 text-lg" />}
            >
              Voltar
            </Button>
          </Link>
        </div>
      </form>
    </Container>
  );
}
