"use client";

// Next
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// React
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Bibliotecas
import { IoClose, IoChevronDownOutline, IoExitOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useTopLoader } from "nextjs-toploader";

// Imagem
import slogan from "@/public/img/playcell.png";

// Dados
import RulesByUsers from "@/data/rulesByUsers";

// Tipagem
interface SideNavProps {
  role: string;
  toggleMenuState: boolean;
  close: (value: boolean) => void;
}

export default function SideNav({
  role,
  toggleMenuState,
  close,
}: SideNavProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const pathname = usePathname();
  const loader = useTopLoader();
  const rules = useMemo(() => RulesByUsers({ role }), [role]);

  const { user, signOut } = useContext(AuthContext);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const activeSection = rules.find((section) =>
      section.items.some((item) => pathname === item.href)
    );
    if (activeSection) {
      setOpenSections((prev) => ({
        ...prev,
        [activeSection.title]: true,
      }));
    }
  }, [pathname, rules]);

  let routeColor = "bg-gradient-to-b from-orange-400 to-orange-600";
  const activeSection = rules.find((section) =>
    section.items.some((item) => pathname === item.href)
  );
  if (activeSection) {
    const matchingItem = activeSection.items.find(
      (item) => pathname === item.href
    );

    if (matchingItem && matchingItem.color) {
      routeColor = `bg-gradient-to-b ${matchingItem.color}`;
    }
  }

  return (
    <nav
      className={`fixed inset-0 z-50 my-2 ml-2 h-[calc(100vh-22px)] w-[266px] rounded-xl ${routeColor} shadow-lg transform transition-transform duration-300 ${toggleMenuState ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 lg:shadow-none px-6 flex flex-col`}
      aria-label="Barra lateral"
    >
      <div className="w-full py-2 flex justify-end">
        <button
          onClick={() => close(false)}
          className="rounded-md hover:bg-white lg:hidden"
          aria-label="Fechar menu"
        >
          <IoClose className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex items-center justify-center py-4 border-b border-gray-200">
        <Link href="/davs">
          <div className="w-full">
            <Image
              src={slogan}
              alt="Logo PlayCell"
              className="w-32"
              priority={true}
              loading="eager"
            />
          </div>
        </Link>
      </div>

      <div className="pt-4 overflow-y-auto flex-grow">
        {rules.map((section) => {
          const isOpen = openSections[section.title] ?? false;
          const isSectionActive = section.items.some(
            (item) => pathname === item.href
          );

          return (
            <div key={section.title} className="mb-4">
              <button
                onClick={() => toggleSection(section.title)}
                className={`flex items-center justify-between w-full px-6 py-2 mb-2 font-medium rounded-lg transition
                ${isSectionActive ? "bg-white text-gray-800" : "bg-white text-gray-700"}  
              `}
              >
                <span className="flex items-center space-x-2">
                  {section.icon}
                  <span className="text-base flex">{section.title}</span>
                </span>
                <IoChevronDownOutline
                  className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <ul
                className={`pl-3 space-y-1 overflow-auto transition-[max-height] duration-300 ${isOpen ? "max-h-60" : "max-h-0"}`}
              >
                {section.items.map(({ id, href, label, icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={id} className="p-2">
                      <Link href={href}>
                        <div
                          className={`flex items-center px-4 py-2 rounded-lg transition
                          ${active ? "bg-white text-gray-800" : "text-white hover:bg-gray-500/50"}
                        `}
                        >
                          {icon && <span className="mr-4">{icon}</span>}
                          <span>{label}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 py-4 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-h-8 h-8 mr-3">
              <FaRegUserCircle className="w-full h-full text-white" />
            </div>
            <div>
              <p className="text-white font-medium capitalize text-base">
                {user}
              </p>
              <p className="text-blue-200 text-[0.85rem] text-sm capitalize font-medium">
                {role}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              loader.start();
            }}
            className="flex items-center justify-center text-white hover:text-blue-300"
            aria-label="Sair"
          >
            <IoExitOutline className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
