// Bibliotecas
import { Spinner } from "@heroui/spinner";

export default function Loading() {
    return (
        <div className="flex flex-col items-center">
            <Spinner classNames={{ label: "text-foreground mt-4" }} variant="spinner" className="scale-150" size="lg" />
        </div>
    )
}