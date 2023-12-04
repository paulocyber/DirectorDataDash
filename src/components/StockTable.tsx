import { useState } from 'react';

// Utils
import { FilterLowStocks } from './../utils/FunctionStock';
import { ToggleFilterBtn } from '../utils/ToggleFilterBtn';
import { formatDate } from './../utils/ApplyMask';

// Atom
import { useRecoilState } from 'recoil';
import { TypeFilter } from '../atoms/FilterStateAtom';

const StockTable = () => {
    const [btnShowColumns, setBtnShowColumns] = useState(false)
    const [filterType, setFilterType] = useRecoilState(TypeFilter)

    // Stock Minimo
    const { productsFilters } = FilterLowStocks();

    // Desativa e ativa Dropwdown do filter
    const { filterState, HandfilterState } = ToggleFilterBtn()

    return (
        <div className="bg-white shadow-lg rounded-xl lg:col-span-2">

            <div className='flex items-center justify-between w-full'>
                <div className="py-5 px-5">
                    <h1 className="font-bold text-lg">Itens com Estoque Mínimo</h1>
                </div>

                <div className="relative mr-5">
                    <button onClick={() => { HandfilterState("StockLow"); setBtnShowColumns(false) }} id="dropdown-button" className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                        <span className="mr-2 text-sm">Produtos</span>
                        {filterState.StockLow ? (
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 13.0303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L11.25 14.1893V8C11.25 7.58579 11.5858 7.25 12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V14.1893L14.9697 11.9697C15.2626 11.6768 15.7374 11.6768 16.0303 11.9697C16.3232 12.2626 16.3232 12.7374 16.0303 13.0303Z" fill="#000000"></path>
                            </svg>
                        ) : (
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                <path d="M4.0001 3H20.0002C20.5525 3 21.0002 3.44764 21.0002 3.99987L21.0004 5.58569C21.0005 5.85097 20.8951 6.10538 20.7075 6.29295L14.293 12.7071C14.1055 12.8946 14.0001 13.149 14.0001 13.4142L14.0001 19.7192C14.0001 20.3698 13.3887 20.8472 12.7576 20.6894L10.7576 20.1894C10.3124 20.0781 10.0001 19.6781 10.0001 19.2192L10.0001 13.4142C10.0001 13.149 9.89474 12.8946 9.7072 12.7071L3.29299 6.29289C3.10545 6.10536 3.0001 5.851 3.0001 5.58579V4C3.0001 3.44772 3.44781 3 4.0001 3Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        )
                        }
                    </button>
                    <div id="dropdown-menu" className={
                        filterState.StockLow ?
                            " absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 md:text-sm text-xs" :
                            "hidden "
                    }>
                        <button /*onClick={() => SetFilterStock('Filter')}*/ className="w-full px-2 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Filtro</button>
                        <button onClick={() => { HandfilterState("ProfitFilter"); setBtnShowColumns(true) }} className="px-2 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Mostrar Colunas</button>
                    </div>
                    <div className={btnShowColumns ?
                        'absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 w-[280px] flex' :
                        'hidden absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1'
                    }>
                        <div className='w-full flex items-center p-3 flex-col '>

                            <label className="relative inline-flex items-center cursor-pointer pb-5">
                                <input type="checkbox" checked={filterState.ShowProductsColumn} className="sr-only peer" onClick={() => HandfilterState("ShowProductsColumn")} /*onChange={() => HandfilterState("Products")}*/ />
                                <div className="w-9 h-5 bg-gray-50 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 md:text-sm text-xs font-medium text-gray-800 dark:text-gray-500 uppercase">Produtos</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer pb-5">
                                <input type="checkbox" checked={filterState.ShowInventoryColumn} onChange={() => HandfilterState("ShowInventoryColumn")} className="sr-only peer " />
                                <div className="w-9 h-5 bg-gray-50 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-2 md:text-sm text-xs font-medium text-gray-800 dark:text-gray-500 uppercase">Estoque Atual</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer pb-5">
                                <input type="checkbox" checked={filterState.ShowDayOfRempurchaseColumn} onChange={() => HandfilterState("ShowDayOfRempurchaseColumn")} className="sr-only peer " />
                                <div className="w-9 h-5 bg-gray-50 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-2 md:text-sm text-xs font-medium text-gray-800 dark:text-gray-500 uppercase">Dia de Recompra</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer pb-5">
                                <input type="checkbox" checked={filterState.ShowQuantitySoldColumn} onChange={() => HandfilterState("ShowQuantitySoldColumn")} className="sr-only peer " />
                                <div className="w-9 h-5 bg-gray-50 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-2 md:text-sm text-xs font-medium text-gray-800 dark:text-gray-500 uppercase">Quantidade Recompra</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer pb-5">
                                <input type="checkbox" checked={filterState.ShowItemsBelowColumn} onChange={() => HandfilterState("ShowItemsBelowColumn")} className="sr-only peer " />
                                <div className="w-9 h-5 bg-gray-50 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-2 md:text-sm text-xs font-medium text-gray-800 dark:text-gray-500 uppercase">Itens Abaixo</span>
                            </label>

                        </div>
                    </div>
                </div>
            </div>
            <section className="container  mx-auto px-3 font-mono h-[420px]">
                <div className="w-full mb-8  overflow-auto rounded-lg shadow-lg">
                    <div className="w-full h-[400px]">
                        <table className="w-full ">
                            <thead className=''>
                                <tr className="text-md font-semibold tracking-wide text-left text-white bg-red-500 uppercase border-b">

                                    {filterState.ShowProductsColumn &&
                                        <th className="px-4 py-3 ">

                                            <div className='flex'>
                                                <span className='flex items-center w-full'>Produtos</span>
                                                <button onClick={() => setFilterType('ShortByAscProducts')} className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2">
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => setFilterType('ShortByDescProducts')}
                                                    className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2 rotate-180 transform"
                                                >
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                            </div>
                                        </th>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <th className="px-4 py-3"></th>
                                    }

                                    {filterState.ShowInventoryColumn &&
                                        < th className="px-4 py-3">


                                            <div className='flex'>
                                                <span className='flex items-center w-full'>Estoque Atual</span>

                                                <button onClick={() => setFilterType('ShortByAscStock')} className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2">
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => setFilterType('ShortByDescStock')}
                                                    className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2 rotate-180 transform"
                                                >
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                            </div>

                                        </th>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        < th className="px-4 py-3"></th>
                                    }

                                    {filterState.ShowDayOfRempurchaseColumn &&
                                        <th className="px-4 py-3">

                                            <div className='flex'>
                                                <span className='flex items-center w-full'>Dia de Recompra</span>

                                                <button onClick={() => setFilterType('ShortByAscDayOfRempurchase')} className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2">
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => setFilterType('ShortByDescDayOfRempurchase')}
                                                    className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2 rotate-180 transform"
                                                >
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <th className="px-4 py-3"></th>
                                    }

                                    {filterState.ShowQuantitySoldColumn &&
                                        < th className="px-4 py-3">

                                            <div className='flex'>
                                                <span className='flex items-center w-full'>Quantidade Recompra</span>

                                                <button onClick={() => setFilterType('ShortByAscQuantitySold')} className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2">
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => setFilterType('ShortByDescQuantitySold')}
                                                    className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2 rotate-180 transform"
                                                >
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        < th className="px-4 py-3"></th>
                                    }

                                    {filterState.ShowItemsBelowColumn &&
                                        < th className="px-4 py-3">

                                            <div className='flex'>
                                                <span className='flex items-center w-full'>Itens abaixo</span>

                                                <button onClick={() => setFilterType('ShortByAscItemsBelow')} className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2">
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => setFilterType('ShortByDescItemsBelow')}
                                                    className="hover:bg-black hover:bg-opacity-25 flex items-center rounded-full duration-300 transition-colors py-2 px-2 rotate-180 transform"
                                                >
                                                    <svg width="13px" height="13px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                                                        <path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        < th className="px-4 py-3"></th>
                                    }
                                </tr>
                            </thead>

                            <tbody className=''>

                                {productsFilters.map((product) => (
                                    <tr className="text-gray-700" key={product.id}>
                                        {filterState.ShowProductsColumn &&
                                            <td className="px-8 py-6 text-sm border">
                                                {product.produto}
                                            </td>
                                        }
                                        {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                            <td className="px-8 py-6 text-sm border">

                                            </td>
                                        }

                                        {filterState.ShowInventoryColumn &&
                                            <td className="px-4 py-3 text-ms font-semibold border">
                                                {product.quantidade}
                                            </td>
                                        }
                                        {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                            <td className="px-4 py-3 text-ms font-semibold border">

                                            </td>
                                        }

                                        {filterState.ShowDayOfRempurchaseColumn &&
                                            <td className="px-4 py-3 text-xs border">
                                                {formatDate(product.dia_recompra)}
                                            </td>
                                        }
                                        {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                            <td className="px-4 py-3 text-xs border">

                                            </td>
                                        }

                                        {filterState.ShowQuantitySoldColumn &&
                                            < td className="px-4 py-3 text-sm border">
                                                {product.quantidade_recompra}
                                            </td>
                                        }
                                        {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                            < td className="px-4 py-3 text-sm border">

                                            </td>
                                        }

                                        {filterState.ShowItemsBelowColumn &&
                                            < td className="px-4 py-3 text-sm border">
                                                <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm">
                                                    {product.itens_abaixo_minimo}
                                                </span>
                                            </td>
                                        }
                                        {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                            < td className="px-4 py-3 text-sm border">

                                            </td>
                                        }

                                    </tr>
                                ))}
                            </tbody>
                            {/* <tfoot>

                                <tr className="text-md font-semibold tracking-wide text-left text-white bg-red-500 uppercase border-t">
                                    {filterState.ShowProductsColumn &&
                                        <td className="px-4 py-3">Total</td>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3"></td>
                                    }

                                    {filterState.ShowInventoryColumn &&
                                        <td className="px-4 py-3">70</td>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3"></td>
                                    }

                                    {filterState.ShowDayOfRempurchaseColumn &&
                                        <td className="px-4 py-3">122</td>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3"></td>
                                    }

                                    {filterState.ShowQuantitySoldColumn &&
                                        <td className="px-4 py-3">235</td>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3"></td>
                                    }

                                    {filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3">2</td>
                                    }
                                    {!filterState.ShowProductsColumn && !filterState.ShowInventoryColumn && !filterState.ShowDayOfRempurchaseColumn && !filterState.ShowItemsBelowColumn &&
                                        <td className="px-4 py-3"></td>
                                    }
                                </tr>

                            </tfoot> */}
                        </table>
                    </div>
                </div>
            </section >

        </div >
    )
}

export default StockTable