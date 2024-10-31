// Bibliotecas
import { atom } from "recoil";

export const brandsAtom = atom<string[]>({
  key: "brandsAtom",
  default: ['BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA', 'KIMASTER', 'PEINING', 'DEVIA', 'B-MAX', 'INOVA', 'HREBOS'],
});
