// Dados
import vibrantPalette from '@/data/pallets/vibrant.json';

// Tipagem
interface DescriptionGraphicProps<T> {
    data: T[];
    dataKey: keyof T;
    selectingKey?: keyof T;
    handleSelection?: (description: string, index: number, color: string) => void;
}

export default function DescriptionGraphic<T>({ data, dataKey, selectingKey, handleSelection }: DescriptionGraphicProps<T>) {
    return (
        <>
            {data.map((item, index) => (
                <div key={index} className={`flex gap-2 max-w-full items-center justify-center ${handleSelection && 'cursor-pointer'}`}>
                    <div onClick={() => handleSelection && handleSelection(selectingKey ? item[selectingKey] as unknown as string : item[dataKey] as unknown as string, index, vibrantPalette[index % vibrantPalette.length])} className="flex w-36 px-2 items-center">
                        <p style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }} className="rounded-full p-[0.4em] "></p>
                        <p className="pl-2 py-1 truncate text-[10.5px] font-bold text-gray-700 text-xs ">{(item as any)[dataKey]}</p>
                    </div>
                </div>
            ))}
        </>
    );
}
