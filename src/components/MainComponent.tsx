// Tipagem
import { childrenProp } from '../models/types'

const MainComponent = ({ children }: childrenProp) => {
    return (
        <div className="pb-5 w-full overflow-auto">
            <div className="">
                <div className="bg-white shadow-lg rounded-xl w-full mx-auto overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainComponent