// Componentes
import InfoCards from '../components/InfoCards'
import MainComponent from '../components/MainComponent'
import AccountsPayableChart from './../components/BillysToPay/AccountsPayableChart'

// Dados
import { BillysToPayCard } from '../data/BillysToPayCard'

// Bibliotecas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSync, faTable } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { useState } from 'react'

const BillsToPay = () => {
    const [animation, setAnimation] = useState(false)

    const { infoBillyToPay } = BillysToPayCard()

    return (
        <div className='h-screen'>
            <InfoCards infoData={infoBillyToPay} />
            <MainComponent>
                <div className="md:flex items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Contas a pagar</h1>
                        <div className="flex w-[30%]">
                            <button
                                onMouseEnter={() => setAnimation(true)}
                                onMouseLeave={() => setAnimation(false)}
                                className="hover:scale-[1.03] mx-4 justify-center items-center w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                            >
                                <span className="px-2 md:text-sm text-xs">Atualizar</span>
                                <FontAwesomeIcon
                                    icon={faSync}
                                    className={animation ? "animate-spin" : ""}
                                />
                            </button>

                            <button
                                className="hover:scale-[1.03] mx-4 justify-center items-center w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                            >
                                <span className="px-2 md:text-sm text-xs">Filtro</span>
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className=""
                                />
                            </button>

                            <Link
                                to="/billstopay/table"
                                className="hover:scale-[1.03] mx-4 justify-center items-center w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                            >
                                <span className="px-2 md:text-sm text-xs">Tabela</span>
                                <FontAwesomeIcon
                                    icon={faTable}
                                    className=""
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <AccountsPayableChart />
            </MainComponent>
        </div>
    )
}

export default BillsToPay