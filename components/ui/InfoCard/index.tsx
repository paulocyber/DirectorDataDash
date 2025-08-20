"use client";

// Next
import { usePathname } from "next/navigation";

// React
import { ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "@/providers/auth";

// Componentes
import NumberAnimation from "./../animation/numberAnimation/index";

// Dados
import RulesByUsers from "@/data/rulesByUsers";

interface Info {
  icon: ReactNode;
  title: string;
  value: string;
  trend?: string; // opcional, ex: '+55%'
}

export default function InfoCard({ data }: { data: Info[] }) {
  const pathname = usePathname();

  const { role } = useContext(AuthContext);

  const rules = useMemo(() => RulesByUsers({ role }), [role]);
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
    <div className="w-full mx-auto">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${data.length === 3 ? "2xl:grid-cols-3" : data.length === 2 ? "2xl:grid-cols-2" : "2xl:grid-cols-4"} gap-6`}
      >
        {data.map((info, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl bg-white/40 backdrop-blur shadow-lg dark:shadow-black/20 hover:shadow-xl hover:-translate-y-1 transform transition duration-300 p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300`}
                >
                  {info.title}
                </p>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span
                    className={`text-2xl font-bold truncate max-w-[13rem] ${info.title.toLowerCase() === "valores vencidos" || info.title.toLowerCase() === "notas vencidas" ? "text-red-600 dark:text-red-300" : "text-gray-900 dark:text-white"} `}
                  >
                    <NumberAnimation value={info.value} />
                  </span>
                  {info.trend && (
                    <span className="text-sm font-medium text-green-500">
                      {info.trend}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-tr ${routeColor} shadow-md text-white flex items-center justify-center`}
              >
                {info.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
