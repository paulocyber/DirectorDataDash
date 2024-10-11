// Bibliotecas
import { atom } from "recoil";

export const enterpriseSelection = atom<string[]>({
    key: 'enterpriseSelection',
    default: [],
});
