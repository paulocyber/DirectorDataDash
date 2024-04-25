// Biblioteca
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Tipagem
import { infoCardsProps } from '../models/types'

// Utils
import ColorSchemeController from '../utils/ColorSchemeController'

const InfoCards = ({ infoData }: infoCardsProps) => {
    const { setThemeColor } = ColorSchemeController()
    
    return (
        <div className="mt-5">
            <div className={`mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 ${infoData.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                {infoData.map((info, index) => (
                    <div key={index} className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md md:z-10">
                        <div className={`${setThemeColor()} mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center`}>
                            <FontAwesomeIcon icon={info.icon} className="w-5 h-5" />
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
                                {info.title}
                            </p>
                            <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">
                                {info.value}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoCards