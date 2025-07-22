// Bibliotecas
import { FaClipboardList, FaTable } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";

// Tipagem
type MenuItem = {
  id: number;
  href: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
};

type MenuSection = {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  allowedRoles: string[];
};

interface RulesByUsersProps {
  role: string;
}

export default function RulesByUsers({ role }: RulesByUsersProps) {
  const sellersSection = [
    {
      id: 1,
      href: "/davs",
      label: "Relatorio dav's",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 2,
      href: "/davs/table",
      label: "Relatorio dav's",
      icon: <FaTable className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 3,
      href: "/salesgoal",
      label: "Vendas e metas",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 4,
      href: "/commision",
      label: "Regras de comissão",
      icon: <FaTable className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
  ];

  const salesSection = [
    {
      id: 1,
      href: "/sales",
      label: "Vendas e metas",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 2,
      href: "/latecustomer",
      label: "Clientes em atraso",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
  ];

  const financialSection = [
    {
      id: 1,
      href: "/billstopay",
      label: "Contas a pagar",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 2,
      href: "/billstopay/table",
      label: "Contas a pagar",
      icon: <FaTable className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 3,
      href: "/billstoreceive",
      label: "Contas a receber",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: 4,
      href: "/billstoreceive/table",
      label: "Contas a receber",
      icon: <FaTable className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
    // {
    //   id: 5,
    //   href: "/latecustomer",
    //   label: "Clientes em atraso",
    //   icon: <AiFillDashboard className="w-5 h-5" />,
    //   color: "from-orange-400 to-orange-600",
    // },
  ];
  const stockSection = [
    {
      id: 1,
      href: "/salesbybrand",
      label: "Vendas por marcas",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
    // {
    //   id: 2,
    //   href: "/vendas/relatorio",
    //   label: "Entradas x Vendas",
    //   icon: <FaTable className="w-5 h-5" />,
    // },
    // {
    //   id: 3,
    //   href: "/salesbygroup",
    //   label: "Vendas por Grupo",
    //   icon: <AiFillDashboard className="w-5 h-5" />,
    // },
  ];
  const taxSection = [
    {
      id: 1,
      href: "/taxbilling",
      label: "Faturamento fiscal",
      icon: <FaTable className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
  ];
  const tiSection = [
    {
      id: 1,
      href: "/users",
      label: "Gerenciamento de usuário",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-orange-400 to-orange-600",
    },
  ];
  const rhSection = [
    {
      id: 3,
      href: "/salesgoal",
      label: "Vendas e metas",
      icon: <AiFillDashboard className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
    },
  ];

  const filteredSellersSection = sellersSection.filter((item) => {
    if (role.toLowerCase() === "financeiro" && item.id === 4) {
      return false; // remove comissão para financeiro
    }
    return true;
  });

  const settingsMenu: MenuSection[] = [
    {
      title: "Vendas",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: filteredSellersSection,
      allowedRoles: ["diretoria", "financeiro", "tecnologia", "admin"],
    },
    {
      title: "Vendedores",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: salesSection,
      allowedRoles: ["vendedor", "Vendedora"],
    },
    {
      title: "Financeiro",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: financialSection,
      allowedRoles: ["diretoria", "financeiro", "tecnologia", "admin"],
    },
    {
      title: "Estoque",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: stockSection,
      allowedRoles: ["diretoria", "financeiro", "tecnologia", "admin"],
    },
    {
      title: "Fiscal",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: taxSection,
      allowedRoles: ["diretoria", "financeiro", "tecnologia", "admin"],
    },
    {
      title: "RH",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: rhSection,
      allowedRoles: ["rh"],
    },
    {
      title: "T.I",
      icon: <FaClipboardList className="w-5 h-5 text-gray-900" />,
      items: tiSection,
      allowedRoles: ["admin"],
    },
  ];

  const sectionsToRender = settingsMenu.filter((sec) =>
    sec.allowedRoles.includes(role.toLowerCase())
  );

  return sectionsToRender;
}

export const redirectMap: Record<string, string> = {
  estoque: "/salesbybrand",
  rh: "/salesgoal",
  Fiscal: "/taxbilling",
  vendedor: "/sales",
  vendedora: "/sales",
  diretoria: "/davs",
  financeiro: "/davs",
  tecnologia: "/davs",
  admin: "/davs",
};
