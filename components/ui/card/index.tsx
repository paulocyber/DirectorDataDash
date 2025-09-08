// Componentes
import Container from '../container';

// Bibliotecas
import { IoIosArrowDown } from "react-icons/io";
import { FaFlag } from "react-icons/fa";
import { Button } from '@heroui/button';

// Utils
import { getMonthName } from "@/utils/mask/date";

// Tipagem
interface CardProps {
    title: string;
    month: number;
    lastDay: number;
    dataInformation: {
        icon: React.ReactNode;
        label: string;
        highlight: boolean;
    }[];
}

export default function Card({ title, month, lastDay, dataInformation }: CardProps) {
    return (
        <Container>
            <div className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <Button
                        startContent={<IoIosArrowDown className="text-white" />}
                        className="bg-transparent p-1 hover:bg-white/20"
                        size="sm"
                    />
                </div>

                <div className="flex items-center px-6 py-4 border-b">
                    <div className="flex items-center text-gray-600">
                        <FaFlag className="text-lg" />
                        <span className="ml-3 text-sm">
                            01 de {getMonthName(month)} – {lastDay} de {getMonthName(month)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-6">
                    {dataInformation.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center space-x-3 ${item.highlight ? 'font-semibold text-indigo-600' : 'text-gray-700'
                                }`}
                        >
                            <div className="p-2 bg-indigo-50 rounded-full">
                                {item.icon}
                            </div>
                            <span className="text-sm truncate">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
