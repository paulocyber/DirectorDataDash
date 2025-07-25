"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

// Bibliotecas
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import { AiOutlinePercentage } from "react-icons/ai";
import { FaCheck, FaMoneyBill, FaOrcid, FaRegUser } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { setupApiClient } from "@/utils/fetchs/api";

// Next
import Link from "next/link";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
import { ItemsComissionData } from "@/types/comission";
import { useRouter } from "next/navigation";
interface RegisterRuleProps {
  commissionRegisteredSellersData: TypeFilterProps[];
  paymentMethodData: TypeFilterProps[];
  peopleData: TypeFilterProps[];
  commissionRule?: ItemsComissionData;
}

export default function RegisterRule({
  commissionRegisteredSellersData,
  paymentMethodData,
  peopleData,
  commissionRule,
}: RegisterRuleProps) {
  const [id, setId] = useState(commissionRule ? commissionRule.seller.id : "");
  const [name, setName] = useState(
    commissionRule ? commissionRule.seller.name : ""
  );
  const [idPaymentMethod, setIdPaymentMethod] = useState(
    commissionRule ? commissionRule.paymentMethodExternalId : ""
  );
  const [paymentMethod, setPaymentMethod] = useState(
    commissionRule ? commissionRule.paymentMethod : ""
  );
  const [commissionPercentage, setCommissionPercentage] = useState(
    commissionRule?.commissionPercentage
      ? commissionRule.commissionPercentage
      : ""
  );
  const [valuePerSale, setValuePerSale] = useState(
    commissionRule ? commissionRule.valuePerSale : ""
  );
  const [saleValue, setSaleValue] = useState(
    commissionRule ? commissionRule.saleValue : ""
  );
  const [idClient, setIdClient] = useState(
    commissionRule ? commissionRule.clientExternalId : ""
  );
  const [client, setClient] = useState(
    commissionRule ? commissionRule.client : ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);
  const router = useRouter();
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
      const payload = {
        paymentMethodExternalId: paymentMethod ? paymentCode[0].ID_FRM : "",
        paymentMethod: paymentMethod ? paymentCode[0].DESCRICAO_FRM : "",
        commissionPercentage,
        valuePerSale: valuePerSale ? valuePerSale : 0,
        saleValue: saleValue ? saleValue : 0,
        client: client ? client : "",
        clientExternalId: clientCode?.[0]?.ID_PSS
          ? clientCode?.[0]?.ID_PSS
          : "",
        sellerId: id,
      };

      if (commissionRule) {
        await api.patch(`/v1/commission-rules/${commissionRule.id}`, payload);
      } else {
        await api.post("/v1/commission-rules", payload);
      }

      addToast({
        title: commissionRule ? "Comissão atualizada" : "Comissão cadastrada",
        description: commissionRule
          ? "Dados alterados com sucesso."
          : "Regra de comissão criada com sucesso.",
        color: "success",
        icon: <FaCheck />,
      });

      setId("");
      setName("");
      setIdPaymentMethod("");
      setPaymentMethod("");
      setCommissionPercentage("");
      setValuePerSale("");
      setSaleValue("");
      setIdClient("");
      setClient("");

      router.push("/commision");
    } catch (err) {
      console.error("Erro ao salvar regra de comissão:", err);

      addToast({
        title: "Erro ao salvar regra",
        description:
          "Não foi possível salvar a regra de comissão. Verifique os dados e tente novamente.",
        color: "danger",
        icon: <TiWarning />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {commissionRule
            ? "Editar Regra de Comissão"
            : "Cadastrar Regra de Comissão"}
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
              <SelectItem key={String(seller.id)} textValue={name}>
                {seller.name}
              </SelectItem>
            ))}
          </Select>
          <Autocomplete
            labelPlacement="outside"
            suppressContentEditableWarning={false}
            suppressHydrationWarning={false}
            className="w-full"
            label="Selecione Metodo de pagamento"
            placeholder="Selecione Metodo de pagamento"
            startContent={<FaMoneyBill className="text-gray-400 text-ls" />}
            variant="bordered"
            selectedKey={idPaymentMethod || null}
            onSelectionChange={(key: React.Key | null) => {
              if (key === null) setIdPaymentMethod("");
              const id = String(key);
              const name = paymentMethodData.find(
                (paymentMethod) => String(paymentMethod.ID_FRM) === id
              );

              setIdPaymentMethod(id);
              setPaymentMethod(name?.DESCRICAO_FRM ?? "");
            }}
          >
            {paymentMethodData.map((payment) => (
              <AutocompleteItem key={payment.ID_FRM} textValue={paymentMethod}>
                {payment.DESCRICAO_FRM}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            label="Porcentagem da Comissão"
            labelPlacement="outside"
            variant="bordered"
            isRequired
            name="commissionPercentage"
            placeholder="Ex: 1%"
            value={commissionPercentage.toString()}
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
            placeholder="Ex: 1%"
            value={valuePerSale.toString()}
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
            placeholder="Ex: 1%"
            value={saleValue.toString()}
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
            suppressContentEditableWarning={false}
            suppressHydrationWarning={false}
            className="w-full"
            label="Cliente"
            placeholder="Ex: clienteX"
            startContent={<FaRegUser className="text-gray-400 text-ls" />}
            variant="bordered"
            selectedKey={idClient || null}
            onSelectionChange={(key: React.Key | null) => {
              if (key === null) setIdClient("");
              const id = String(key);
              const person = peopleData.find((p) => String(p.ID_PSS) === id);
              setClient(person?.APELIDO_PSS ?? "");
              setIdClient(id);
            }}
          >
            {peopleData.map((people) => (
              <AutocompleteItem
                key={people.ID_PSS}
                textValue={client.toString() ? client : "lista"}
              >
                {people.APELIDO_PSS}
              </AutocompleteItem>
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
            {commissionRule ? "Editar regra" : "Salvar regra"}
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
