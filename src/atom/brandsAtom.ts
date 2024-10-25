// Bibliotecas
import { atom } from "recoil";

export const brandsAtom = atom<string[]>({
  key: "brandsAtom",
  default: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'],
});
