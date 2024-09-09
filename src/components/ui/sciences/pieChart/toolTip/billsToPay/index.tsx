export const ToolTip = (props: any) => {
    const { payload } = props;

    if (!payload || payload.length === 0) {
        return null;
    }

    const suppliers = payload[0].payload.suppliers;

    return (
        <div className="z-[100] relative sm:text-xs text-[11px] px-5 py-3 text-center bg-white rounded-lg dark:text-gray-900 font-bold  overflow-hidden lg:w-full w-[220px]">
            <ul className="list-none">
                {suppliers.map((supplier: string, index: number) => (
                    <li key={index} className=" truncate">
                        {supplier}
                    </li>
                ))}
            </ul>
        </div>
    )
}