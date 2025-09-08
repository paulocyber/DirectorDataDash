"use client";

// Next
import { usePathname } from "next/navigation";

// React
import { useContext, useMemo } from "react";
import { AuthContext } from "@/providers/auth";

// Dados
import RulesByUsers from "@/data/rulesByUsers";

// Bibliotecas
import { FaBell, FaUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiGearSixFill } from "react-icons/pi";

// Tipagem
interface HeaderNavProps {
  role: string;
  open: (value: boolean) => void;
  openSettings?: () => void;
}

export function HeaderNav({ role, open, openSettings }: HeaderNavProps) {
  const router = usePathname();

  const firstPart = router.split("/")[1];
  const secondPart = router.split("/")[2];
  const rules = useMemo(() => RulesByUsers({ role }), [role]);
  const pathname = usePathname();

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

  const { user } = useContext(AuthContext);

  return (
    <div className="p-4 xl:ml-[17em] 2xl:ml-[16.8em]">
      <nav
        className={`w-full ${routeColor} text-white shadow-md rounded-xl px-4 py-3 transition-all`}
      >
        <div className="flex justify-between md:items-center gap-6">
          <div className="capitalize">
            <nav>
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                <li className="text-gray-300 hover:text-white transition">
                  Dashboard
                </li>
                <span>/</span>
                <li className="text-gray-300 hover:text-white transition">
                  {firstPart}
                </li>
                {secondPart && (
                  <>
                    <span>/</span>
                    <li className="text-gray-300 hover:text-white transition">
                      {secondPart}
                    </li>
                  </>
                )}
              </ol>
            </nav>
            <h6 className="text-lg font-semibold">{firstPart}</h6>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex w-full">
              <div className="flex space-x-3 items-center">
                <button
                  className="hidden lg:flex items-center gap-1 text-sm font-bold text-white hover:underline"
                  type="button"
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span className="w-12 truncate">{user}</span>
                </button>

                <button
                  onClick={openSettings}
                  className={`flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 transition ${!openSettings && "cursor-default"}`}
                  type="button"
                >
                  <PiGearSixFill className="h-5 w-5 text-white" />
                </button>

                <button
                  className="flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 transition"
                  type="button"
                >
                  <FaBell className="h-5 w-5 text-white" />
                </button>

                <button
                  className="flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 lg:hidden transition"
                  type="button"
                >
                  <FaUserCircle className="h-5 w-5 text-white" />
                </button>

                <button
                  onClick={() => open(true)}
                  className={`${false ? "bg-blue-700" : "hover:bg-blue-700"} relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-full text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden`}
                >
                  <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <RxHamburgerMenu className="h-6 w-6 text-white" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
