// Componentes
import NotFoundUI from '@/components/ui/notfound';

// data
import { redirectMap } from '@/data/rulesByUsers';

// Next
import { Metadata } from 'next';

// Next
import { cookies } from 'next/headers';

export const metadata: Metadata = {
    title: "Página não encontrada",
    description: "Página não encontrada - Error 404",
};

export default async function NotFound() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    let redirect;

    if (token) {
        redirect = redirectMap[role]
    } else {
        redirect = "/"
    }

    return (
        <NotFoundUI hrfe={redirect} />
    )
}