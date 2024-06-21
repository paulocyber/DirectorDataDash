// Biblioteca
import { Tooltip } from "@nextui-org/tooltip";

const renderTooltipContent = (props: any) => {
    const { payload } = props;

    if (!payload || payload.length === 0) {
        return null;
    }

    const suppliers = payload[0].payload.suppliers;

    return (
        <div className="z-50 relative text-xs px-5 py-3 text-center bg-white dark:text-gray-900 font-bold">
            <ul className="">
                {suppliers.map((supplier: string, index: number) => (
                    <li key={index}>{supplier}</li>
                ))}
            </ul>
        </div>
    );
};

export default renderTooltipContent;
