import { atom } from "recoil"

const FilterStateBtnAtom = atom({
    key: "FilterStateBtnAtom",
    default: {
        ProfitFilter: false,
        ClientsFilter: false,
        SalesFilter: false,
        StockLow: false,
        btnShowColumns: false,
        // State para coluna
        ShowProductsColumn: true,
        ShowInventoryColumn: true,
        ShowCurrentInventoryColumn: true,
        ShowDayOfRempurchaseColumn: true,
        ShowQuantitySoldColumn: true,
        ShowItemsBelowColumn: true,
    },
})

export { FilterStateBtnAtom }

const TypeFilter = atom({
    key: "TypeFilter",
    default: ""
})

export { TypeFilter }