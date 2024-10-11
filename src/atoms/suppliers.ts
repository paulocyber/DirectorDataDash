// Bibliotecas
import { atom } from "recoil";

export const suppliersSelection = atom<string[]>({
    key: 'supplierSelection',
    default: [],
});
