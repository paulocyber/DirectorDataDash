"use client";

// Componentes
import { Input } from "@/components/ui/input";
import Container from "./../../ui/container/index";

// Bibliotecas
import { addToast, Button, Divider, Select, SelectItem } from "@heroui/react";
import { FaCheck, FaOrcid, FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { IoArrowBack, IoDocument } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { FiSave } from "react-icons/fi";

// Utils
import { FormatPhone } from "@/utils/mask/formatPhone";
import { FormatCpf } from "@/utils/mask/formatCpf";
import { setupApiClient } from "@/utils/fetchs/api";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
import { ItemsSellers } from "@/types/sellers";
interface RegisterSellerProps {
  employeesData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
  commissionSalespeopleData?: ItemsSellers;
}

export default function RegisterSeller({
  employeesData,
  sellersData,
  commissionSalespeopleData,
}: RegisterSellerProps) {
  const [id, setId] = useState(
    commissionSalespeopleData
      ? commissionSalespeopleData.user.id.toString()
      : ""
  );
  const [name, setName] = useState(
    commissionSalespeopleData ? commissionSalespeopleData.name : ""
  );
  const [email, setEmail] = useState(
    commissionSalespeopleData ? commissionSalespeopleData.email : ""
  );
  const [phone, setPhone] = useState(
    commissionSalespeopleData ? commissionSalespeopleData.phone : ""
  );
  const [cpf, setCpf] = useState(
    commissionSalespeopleData ? commissionSalespeopleData.cpf : ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);
  const router = useRouter();

  const sellerCode = employeesData.filter(
    (employee) =>
      employee.APELIDO_PSS?.toLocaleLowerCase() === String(name).toLowerCase()
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (commissionSalespeopleData) {
        const payload = {
          name,
          email,
          phone,
          cpf,
          externalId: `${sellerCode[0].ID_PSS}`,
        };

        await api.patch(`/v1/sellers/${commissionSalespeopleData.id}`, payload);

        router.push("/sellers");
      } else {
        await api.post("/v1/sellers", {
          name: name,
          email: email,
          phone: phone,
          cpf: cpf,
          externalId: sellerCode[0].ID_PSS,
          userId: id,
        });
      }

      addToast({
        title: commissionSalespeopleData
          ? "Vendedor atualizado com sucesso!"
          : "Vendedor cadastrado com sucesso!",
        description: commissionSalespeopleData
          ? "Dados alterados com sucesso"
          : "O vendedor foi registrado na regra de comissão.",
        color: "success",
        icon: <FaCheck />,
      });

      setId("");
      setName("");
      setEmail("");
      setCpf("");
    } catch (err) {
      console.log("Error: ", err);

      addToast({
        title: "Erro ao cadastrar vendedor",
        description:
          "Não foi possível registrar o vendedor. Verifique os dados e tente novamente.",
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
          {commissionSalespeopleData ? "Cadastrar Vendedor" : "Editar cadastro"}
        </h2>
        <p className="text-gray-600 mt-1">
          Primeiro cadastre o vendedor na regra de comissão. Só depois isso
          estará pronto, aí sim você pode criar uma regra específica para esse
          vendedor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 py-5 pb-4">
        <div className="grid grid-cols-1 px-4 gap-6">
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
              const name = sellersData.find(
                (seller) => String(seller.id) === id
              );

              setId(id);
              setName(name?.username ?? "");
            }}
          >
            {sellersData.map((seller) => (
              <SelectItem key={seller.id}>{seller.username}</SelectItem>
            ))}
          </Select>
          <Input
            label="E-mail"
            labelPlacement="outside"
            variant="bordered"
            name="email"
            isRequired
            placeholder="Ex: setor@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={{
              input: "",
            }}
            startContent={<MdOutlineEmail className="text-gray-400 text-ls" />}
          />
          <Input
            label="Telefone"
            labelPlacement="outside"
            isRequired
            variant="bordered"
            name="phone"
            placeholder="Ex: (85) 90000-0000"
            value={phone}
            onChange={(e) => {
              const formatted = FormatPhone(e.target.value);
              setPhone(formatted);
            }}
            classNames={{
              input: "",
            }}
            startContent={<BiPhone className="text-gray-400 text-ls" />}
          />
          <Input
            label="Cpf"
            isRequired
            labelPlacement="outside"
            variant="bordered"
            name="text"
            placeholder="Ex: 000.000.000-00"
            value={cpf}
            onChange={(e) => {
              const formatted = FormatCpf(e.target.value);
              setCpf(formatted);
            }}
            classNames={{
              input: "",
            }}
            startContent={<IoDocument className="text-gray-400 text-ls" />}
          />
          <Input
            labelPlacement="outside"
            className="w-full"
            label="Código do vendedor"
            placeholder="Código do venedor"
            startContent={<FaOrcid className="text-gray-400 text-ls" />}
            classNames={{
              input: "",
              description: "text-red-800 font-extrabold",
            }}
            variant="bordered"
            isDisabled={true}
            value={sellerCode.length > 0 ? sellerCode[0].ID_PSS : ""}
            description="OBS: VERIFIQUE SE O CÓDIGO DO VENDEDOR ESTÁ IGUAL AO QUE CONSTA NO MULTSISTEM."
          />
        </div>

        <div className="w-full px-4">
          <Divider className="" />
        </div>
        <div className="px-4 justify-end space-x-4 flex">
          <Button
            type="submit"
            isLoading={loading}
            className="w-56 bg-gradient-to-b from-orange-400 to-orange-600"
            color="primary"
            startContent={
              !loading && <FiSave className="text-gray-200 text-lg" />
            }
          >
            {commissionSalespeopleData ? "Editar Vendedor" : "Salvar Vendedor"}
          </Button>
          <Link href="/sellers">
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
