// React
import { ReactNode } from "react"

// Componente
import { DescriptionsGraphic } from "../DescriptionChart/DescriptionsGraphic"

// Tipagem
interface MainScienceProps {
    children: ReactNode
    data: { description: string; value: number }[];
}

export function MainScience({ children, data }: MainScienceProps) {
    return (
        <>
            <div className="flex w-full">
                {children}
            </div>
            <div className="w-full">
                <DescriptionsGraphic data={data} />
            </div>
        </>
    )
}