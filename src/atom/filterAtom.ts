// Biblioteca
import { atom } from "recoil";

// Tipagem
import { FilterItem } from "../models/types";

export const filterDescription = atom<FilterItem[]>({
  key: "filterDescription",
  default: [],
});
