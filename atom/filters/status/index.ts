// Biblioteca
import { atom } from "jotai";

export const statusAtom = atom<string[]>(["Em aberto", "Pago"]);
