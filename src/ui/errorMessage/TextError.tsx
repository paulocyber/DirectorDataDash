// Tipagem
interface messagemErrorProps {
    error: string;
}

export function TextError({ error }: messagemErrorProps) {
    return (
        <span className="text-[12px] text-red-500">{error}</span>
    )
}