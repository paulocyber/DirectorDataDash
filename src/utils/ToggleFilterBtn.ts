// React
import { useRecoilState } from "recoil";

// Atom
import { FilterStateBtnAtom } from "../atoms/FilterStateAtom";

// Tipagem
interface FilterState {
  ProfitFilter: boolean;
  ClientsFilter: boolean;
  SalesFilter: boolean;
  ShowCurrentInventoryColumn: boolean;
  ShowDayOfRempurchaseColumn: boolean;
  ShowQuantitySoldColumn: boolean;
  ShowItemsBelowColumn: boolean;
  StockLow: boolean;
  ShowProductsColumn: boolean;
  ShowInventoryColumn: boolean;
}

export const ToggleFilterBtn = () => {
  const [filterState, setFilterState] = useRecoilState(FilterStateBtnAtom);

  const HandfilterState = (filter: keyof FilterState) => {
    setFilterState((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
  };

  return { filterState, HandfilterState };
};
