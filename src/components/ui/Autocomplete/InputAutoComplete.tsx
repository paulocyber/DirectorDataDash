// Biblioteca
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/autocomplete";

export default function InputAutoComplete() {
    return (
        <Autocomplete
            variant="bordered"
            placeholder="Selecione centro de custo"
            className="w-full"
            scrollShadowProps={{
                isEnabled: false,
            }}
            aria-label="Centro de Custo"
            
        >
            <AutocompleteSection
                title="Centro de Custo"
                classNames={{
                    heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",
                }}
            >
                <AutocompleteItem key={1}>teste</AutocompleteItem>
            </AutocompleteSection>
        </Autocomplete>
    )
}