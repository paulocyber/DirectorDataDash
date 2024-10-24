// Bibliotecas
import { atom } from "recoil";

export const brandsAtom = atom<string[]>({
  key: "brandsAtom",
  default: ['36'],
});
