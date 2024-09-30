export const ToolTip = (props: any) => {
    const { payload } = props;

    if (!payload || payload.length === 0) {
        return null;
    }

    const suppliers = payload[0].payload.suppliers;

    return (
        <div className="z-50 relative sm:text-xs text-[11px] px-5 py-3 text-center bg-white rounded-lg shadow-md border border-gray-300 dark:text-gray-900 font-bold overflow-auto lg:w-full w-[220px]">
            <ul className="list-none">
                {suppliers.map((supplier: string, index: number) => (
                    <li key={index} className="truncate hover:text-blue-600 transition duration-200">
                        {supplier}
                    </li>
                ))}
            </ul>
        </div>
    )
}