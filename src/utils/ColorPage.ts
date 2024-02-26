// Biblioteca
import { useLocation } from 'react-router-dom';

export const ColorPage = () => {
    const location = useLocation();

    const getColorForRoute = () => {
        if (location.pathname === '/') {
            return 'bg-[#fa6602]'; // Cor para a rota home
        }
        return 'bg-blue-700 '; // Cor padrão
    };

    return { getColorForRoute }
}
