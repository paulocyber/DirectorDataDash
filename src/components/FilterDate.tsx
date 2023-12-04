import { useState } from "react";

// Bibliotecas
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MaskedInput from 'react-text-mask';
import ptBR from 'date-fns/locale/pt-BR';

const FilterDate = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="md:ml-auto md:mx-0 md:mx-2 px-10 xl:w-[82%] w-full pb-5">
            <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none z-50">
                    <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </div>
                <DatePicker
                    customInput={
                        <MaskedInput
                            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                            placeholder="DD/MM/AAAA"
                            showMask
                            className="bg-gradient-to-br from-gray-600 to-black border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }: any) => (
                        <div className="w-full flex items-center p-2 bg-white rounded-t-lg  border-b-2 border-gray-300">
                            <button onClick={decreaseMonth} className="hover:bg-gray-300 transition duration-300 ease-in-out hover:bg-opacity-80 p-[0.2em] rounded-lg"><NavigateBeforeIcon /></button>
                            <div className="w-full text-sm font-semibold font-sans">
                                <span>{date.toLocaleDateString('pt-br', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <button onClick={increaseMonth} className="hover:bg-gray-300 transition duration-300 ease-in-out hover:bg-opacity-80 p-[0.2em] rounded-lg"><NavigateNextIcon /></button>

                        </div>
                    )}
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale={ptBR}
                />
            </div>
        </div>
    );
};

export default FilterDate;
