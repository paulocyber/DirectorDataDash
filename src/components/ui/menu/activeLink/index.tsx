// Framework 
import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation";

// React
import { ReactNode } from "react"

// Tipagem
type ActiveLinkProps = LinkProps & {
    children: ReactNode;
    nameLink: string;
    role: string;
}

// Função de roles
function canAccess(role: string, pathName: string) {
    const routesRestrictedBySellers = [
        "/davs",
        "/salesbygroup",
        "/salesbybrand",
        "/billstopay",
        "/billstopay/table",
    ];

    // Permitir acesso apenas a "/sales" para vendedores
    return role !== "vendedor" || pathName === "/sales";
}

export default function ActiveLink({ children, href, nameLink, role }: ActiveLinkProps) {
    const pathName = usePathname();
    const isActive = pathName === href.toString() ||
        (href === "/davs" && pathName.startsWith('/detaildavs')) || (href === "/billstopay" && pathName.startsWith('/billstopay'));

    // Verifique se o link pode ser acessado
    if (!canAccess(role, href.toString())) {
        return null; // Não renderiza nada se não puder acessar
    }

    return (
        <Link
            href={href}
            className={`transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all flex w-full items-center gap-4 px-4 capitalize transform hover:scale-105 py-3 rounded-lg ${isActive ? "bg-white" : "disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs text-white hover:bg-black/50 "} `}
        >
            {children}
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                {nameLink}
            </p>
        </Link>
    );
}