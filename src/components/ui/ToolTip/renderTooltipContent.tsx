const renderTooltipContent = (props: any) => {
    const { payload } = props;

    if (!payload || payload.length === 0) {
        return null;
    }

    const suppliers = payload[0].payload.suppliers

    return (
        <div className="z-50 text-sm px-5 py-3 text-center text-gray-600 truncate bg-blue-700 rounded-lg shadow-lg  dark:shadow-none shadow-gray-200 dark:text-white">
            {suppliers.map((supplier: string, index: number) => (
                <li key={index}>{supplier}</li>
            ))}
        </div >
    );
};

export default renderTooltipContent