// Biblioteca
import { atom } from "recoil";

// Tipagem
import { SelectionDescription } from "@/utils/types/selectionDescription";

export const filterDescription = atom<SelectionDescription[]>({
  key: "filterDescription", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
