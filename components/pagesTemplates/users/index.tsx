"use client";

// Componentes
import Container from "@/components/ui/container";
import Table from "@/components/ui/tables";
import { RenderCell } from "@/components/renderCell/users";

// Componentes
import ToolBar from "@/components/ui/toolBar";

// Dados
import columns from "@/data/columns/users/columns.json";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Bibliotecas
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUser } from "react-icons/fa";

// Tipagem
import { ItemsUsers } from "@/types/users";
import { TiWarning } from "react-icons/ti";
interface LayoutUsersProps {
  data: ItemsUsers[];
}

export default function LayoutUsers({ data }: LayoutUsersProps) {
  const [users, setUser] = useState<ItemsUsers[]>(data);
  const [isEdit, setIsEdit] = useState(true);
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState<boolean>(false);
  const [password, setPassoword] = useState("");
  const [showPassoword, setShowPassoweord] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);

  async function handleRefresh() {
    setLoading(true);
    try {
      const res = await api.get("/v1/users");
      setUser(res.data.returnObject.body);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(id: number) {
    await api.delete(`/v1/users/${id}`);

    handleRefresh();
  }
  async function handleEdit(id: number) {
    const res = await api.get(`/v1/users/${id}`);
    const u = res.data.returnObject.body;
    setName(u.username);
    setRole(u.role);
    setActive(u.ativo);
    setId(u.id);
    setPassoword("");
    onOpen();
  }
  async function handleSubmit() {
    if (name.trim() === "" || role.trim() === "") {
      addToast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome de usuário e regra.",
        color: "danger",
        icon: <TiWarning />,
      });
    }

    if (isEdit === true) {
      await api.patch(`/v1/users/${id}`, {
        username: name,
        role,
        ativo: active,
        ...(password && { password }),
      });
    } else {
      if (password.trim() === "") {
        addToast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha sua senha",
          color: "danger",
          icon: <TiWarning />,
        });
      }

      await api.post(`/v1/users`, {
        username: name,
        role,
        ativo: active,
        password,
      });
    }

    handleRefresh();
    onOpenChange();
  }
  async function handleAddUser() {
    setIsEdit(false);
    onOpen();
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <main className="w-full">
      <Container>
        <ToolBar
          title="Gereciamento de usuário"
          titleAdd="Adicionar usuário"
          handleRefreshClick={handleRefresh}
          handleAdd={handleAddUser}
        />
        <Table
          data={users.sort((a, b) => a.id - b.id)}
          columns={columns}
          loading={loading}
          renderCell={(item, columnUid) => (
            <RenderCell
              item={item}
              columnKey={columnUid}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        />
      </Container>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        radius="lg"
      >
        <>
          <ModalContent className="w-full max-w-md p-6 bg-white dark:bg-gray-800">
            <ModalHeader className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Editar Informações
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Nome"
                variant="bordered"
                value={name}
                onValueChange={setName}
                name="nome"
                placeholder="Ex: João Silva"
                isRequired
                startContent={<FaUser className="text-gray-400" />}
              />
              <Input
                label="Regra"
                name="regra"
                value={role}
                onValueChange={setRole}
                placeholder="Ex: administrador"
                isRequired
                startContent={<FaShieldAlt className="text-gray-400" />}
              />
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ativo"
                  className="text-gray-900 dark:text-gray-200"
                >
                  Ativo
                </label>
                <Switch
                  id="ativo"
                  name="ativo"
                  isSelected={active}
                  onValueChange={setActive}
                />
              </div>
              {/* <Input
                type={showPassoword ? "password" : "text"}
                label="Nova senha"
                name="senha"
                value={password}
                onValueChange={setPassoword}
                placeholder="••••••••"
                isRequired={false}
                endContent={
                  <button onClick={() => setShowPassoweord(!showPassoword)}>
                    {showPassoword ? (
                      <FaEyeSlash className="text-gray-400 text-2xl" />
                    ) : (
                      <FaEye className="text-gray-400 text-2xl" />
                    )}
                  </button>
                }
              /> */}
            </ModalBody>
            <ModalFooter className="flex w-full justify-end gap-3">
              <Button
                onClick={onOpenChange}
                variant="bordered"
                className="w-full"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="solid"
                color="primary"
                className="w-full"
              >
                Salvar alterações
              </Button>
            </ModalFooter>
          </ModalContent>
        </>
      </Modal>
    </main>
  );
}
