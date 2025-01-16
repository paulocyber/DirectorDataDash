import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

// Biblioteca
import { AiOutlineDashboard } from "react-icons/ai";
import { HiMiniTableCells } from "react-icons/hi2";

// Tipagem
type ActiveLinkProps = LinkProps & {
    content: string;
    icon: string;
};

export function ActiveLink({ content, href, icon }: ActiveLinkProps) {
    const pathName = usePathname();

    const isActive = pathName === href || pathName.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={`group flex items-center space-x-4 p-3 rounded-lg ${isActive
                ? "bg-white text-gray-900 shadow-md"
                : "text-white hover:bg-white hover:text-gray-900 hover:shadow-md"
                } transition-all cursor-pointer`}
        >
            {icon === "dash" ? (
                <AiOutlineDashboard
                    className={`h-6 w-6 ${isActive ? "text-bluegray-900" : "group-hover:scale-110"
                        } transition-transform`}
                />
            ) : (
                <HiMiniTableCells
                    className={`h-6 w-6 ${isActive ? "text-bluegray-900" : "group-hover:scale-110"
                        } transition-transform`}
                />
            )}
            <span
                className={`text-sm font-medium ${isActive ? "text-bluegray-900" : ""
                    }`}
            >
                {content}
            </span>
        </Link>
    );
}
