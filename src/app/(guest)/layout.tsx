// React
import { ReactNode } from "react"

// Next - Framework
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GuestRouter({ children }: { children: ReactNode }) {
    const cookieStore = cookies();

    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (token) {
        if (!['vendedor', 'vendedora'].includes(role)) {
            redirect('/davs');
        } else {
            redirect('/sales')
        }
    }

    return <>{children}</>
}