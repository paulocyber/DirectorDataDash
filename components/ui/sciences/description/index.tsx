// Dados
import vibrantPalette from "@/data/pallets/vibrant.json"

// Tipagem
interface DescriptionGraphicProps<T> {
    data: T[];
    dataKey: keyof T;
    selectingKey?: keyof T;
    valueKey?: keyof T;
    handleSelection?: (
        description: string,
        index: number,
        color: string,
        value?: number
    ) => void;
}

export default function DescriptionGraphic<T>({
    data,
    dataKey,
    selectingKey,
    valueKey,
    handleSelection,
}: DescriptionGraphicProps<T>) {
    return (
        <>
            {data.map((item, index) => {
                const description = selectingKey
                    ? String(item[selectingKey])
                    : String(item[dataKey]);

                const rawValue = valueKey ? (item as any)[valueKey] : undefined;
                const value = typeof rawValue === 'number' ? rawValue : undefined;

                return (
                    <div
                        key={index}
                        className={`flex items-center justify-center ${handleSelection ? 'cursor-pointer' : ''
                            }`}
                    >
                        <div
                            onClick={() =>
                                handleSelection?.(
                                    description,
                                    index,
                                    vibrantPalette[index % vibrantPalette.length],
                                    value
                                )
                            }
                            className="flex w-full max-w-36 px-2 items-center"
                        >
                            <p
                                style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}
                                className="rounded-full p-[0.4em]"
                            ></p>
                            <p className="pl-2 py-1 truncate text-[11.5px] font-semibold text-gray-700">
                                {(item as any)[dataKey]}
                            </p>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
