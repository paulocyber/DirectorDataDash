// Dados
import vibrantPalette from '@/data/palettes/vibrant.json';

// Tipagem
interface DescriptionGraphicProps<T> {
    data: T[];
    dataKey: keyof T;
    handleSelection?: (description: string, index: number, color: string) => void;
}

export default function DescriptionGraphic<T>({ data, dataKey, handleSelection }: DescriptionGraphicProps<T>) {
    return (
        <>
            {data.map((item, index) => (
                <div key={index} className={`w-full ${handleSelection && 'cursor-pointer'}`}>
                    <div onClick={() => handleSelection && handleSelection(item[dataKey] as unknown as string, index, vibrantPalette[index % vibrantPalette.length])} className="flex w-28 px-2 items-center">
                        <p style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }} className="rounded-full p-[0.4em] "></p>
                        <p className="pl-2 py-1 truncate text-[10.5px] font-bold text-gray-700 text-xs ">{(item as any)[dataKey]}</p>
                    </div>
                </div>
            ))}
         </>
    );
}
