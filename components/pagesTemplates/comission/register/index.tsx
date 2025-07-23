"use client";

// Componentes
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

// Bibliotecas
import { Button, Divider, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { MdOutlineEmail } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { IoArrowBack, IoDocument } from "react-icons/io5";
import { FaMoneyBill, FaOrcid, FaRegUser } from "react-icons/fa";

// React
import { useState } from "react";

// Tipagem
import { TypeFilterProps } from "@/types/filters/selecting";
import { FiSave } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
interface RegisterComissionProps {
  paymentMethodData: TypeFilterProps[];
  employeesData: TypeFilterProps[];
  sellersData: TypeFilterProps[];
}

export default function RegisterComission({
  paymentMethodData,
  employeesData,
  sellersData,
}: RegisterComissionProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const sellerCode = employeesData.filter(
    (employee) =>
      employee.APELIDO_PSS?.toLocaleLowerCase() === String(name).toLowerCase()
  );

  return (
    <Tabs aria-label="Options" variant="underlined">
      <Tab key="sellers" title="Registrar Vendedores">
        <Container>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Cadastrar Vendedor
            </h2>
            <p className="text-gray-600 mt-1">
              Primeiro cadastre o vendedor na regra de comissão. Só depois isso
              estará pronto, aí sim você pode criar uma regra específica para
              esse vendedor.
            </p>
          </div>

          <form className="space-y-6 py-5 pb-4">
            <div className="grid grid-cols-1 px-4 gap-6">
              <Select
                labelPlacement="outside"
                className="w-full"
                label="Selecione Vendedor"
                placeholder="Selecione Vendedor"
                startContent={<FaRegUser className="text-gray-400 text-ls" />}
                variant="bordered"
                selectedKeys={new Set(id ? [id] : [])}
                onSelectionChange={(keys: string | Set<React.Key>) => {
                  const id = Array.from(keys)[0] as string;
                  const name = sellersData.find(
                    (seller) => String(seller.id) === id
                  );

                  setId(id);
                  setName(name ? name.username : "");
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
                placeholder="Ex: setor@domain.com"
                isRequired
                classNames={{
                  input: "",
                }}
                startContent={
                  <MdOutlineEmail className="text-gray-400 text-ls" />
                }
              />
              <Input
                label="Telefone"
                labelPlacement="outside"
                variant="bordered"
                name="phone"
                placeholder="Ex: (85) 90000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                isRequired
                classNames={{
                  input: "",
                }}
                startContent={<BiPhone className="text-gray-400 text-ls" />}
              />
              <Input
                label="Cpf"
                labelPlacement="outside"
                variant="bordered"
                name="text"
                placeholder="Ex: 000.000.000-00"
                isRequired
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
                className="w-56"
                color="primary"
                startContent={<FiSave className="text-gray-200 text-lg" />}
              >
                Salvar Vendedor
              </Button>
              <Button
                className="w-56"
                variant="ghost"
                startContent={<IoArrowBack className="text-gray-600 text-lg" />}
              >
                Voltar
              </Button>
            </div>
          </form>
        </Container>
      </Tab>
      <Tab key="comissions" title="Registrar Regra">
        <Container>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Cadastrar Regra de Comissão
            </h2>
            <p className="text-gray-600 mt-1">
              Configure as condições e taxas para cálculo de comissões
            </p>
          </div>

          <form className="space-y-6 pb-4">
            <div className="grid grid-cols-1 px-4 lg:grid-cols-2 gap-6">
              {/* <Select className="max-w-xs" label="Select an animal">
            {animals.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select> */}
              <Input
                label="Metodo de pagamento"
                name="mmetodo"
                placeholder="Ex: PIX/TED"
                isRequired
                startContent={<FaMoneyBill className="text-gray-400" />}
              />
              <Input
                label="Metodo de pagamento"
                name="mmetodo"
                placeholder="Ex: PIX/TED"
                isRequired
                startContent={<FaMoneyBill className="text-gray-400" />}
              />
            </div>
          </form>
        </Container>
      </Tab>
    </Tabs>
  );
}
