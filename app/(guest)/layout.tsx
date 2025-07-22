// Next
import { Metadata } from "next";
import clsx from "clsx";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Configuração
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function GuestRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (token) {
    return redirect(redirectMap[role]);
  }

  return (
    <div
      className={clsx(
        "relative bg-[#edf3fb] flex flex-col h-screen",
        fontSans.variable
      )}
    >
      <main className="w-full">{children}</main>
    </div>
  );
}
