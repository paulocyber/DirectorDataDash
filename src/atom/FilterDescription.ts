// Biblioteca
import { atom } from "recoil";

// Tipagem
export interface itemDescription {
  description: string;
  color: string;
  id: number;
}

export const filterDescription = atom<itemDescription[]>({
  key: "filterDescription", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
