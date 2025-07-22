"use client";

// Componentes
import { Input } from "../input";

// Bibliotecas
import { CiSearch } from "react-icons/ci";
import { Checkbox, Tooltip } from "@heroui/react";

// React
import { useState } from "react";

// Utils
import { searchFilter } from "@/utils/filters/searchFilter";
import { InfiniteScroll } from "@/utils/InfiniteScroll";

interface FiltersProps<T extends Record<string, any>> {
  data: T[];
  title: string;
  idKey: keyof T;
  labelKey: keyof T;
  valueKey?: keyof T;
  value: string[];
  setValue: (value: string[]) => void;
}

export default function Filters<T extends Record<string, any>>({
  data,
  title,
  idKey,
  labelKey,
  valueKey,
  value,
  setValue,
}: FiltersProps<T>) {
  const [searchParams, setSearchParams] = useState<string>("");
  const [limit, setLimit] = useState(0);

  const filter = searchFilter({ data, search: searchParams });

  const keyForValue = valueKey ?? idKey;

  const toggle = (id: string) => {
    const exists = value.includes(id);
    const updated = exists ? value.filter((v) => v !== id) : [...value, id];
    setValue(updated);
  };

  const fetchMore = () => {
    if (limit < data.length) {
      setLimit(limit + 10);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="font-bold text-xl text-gray-800">{title}</h2>
        <Input
          id="search-filter"
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
          size="sm"
          placeholder="Pesquisar..."
          startContent={<CiSearch className="text-gray-400 w-5 h-5" />}
          className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <main className="max-h-screen h-full overflow-y-auto">
        <div className="py-2 px-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filter.slice(0, limit).map((item) => {
            const idValue = String(item[keyForValue]);

            return (
              <Tooltip key={String(item[idKey])} content={item[labelKey]}>
                <Checkbox
                  key={String(item[idKey])}
                  classNames={{ label: "text-gray-700 text-sm" }}
                  className="w-full rounded-lg hover:bg-gray-50 transition"
                  onChange={() => toggle(idValue)}
                  isSelected={value.includes(idValue)}
                >
                  <p className="truncate md:w-[13em]">
                    {String(item[labelKey])}
                  </p>
                </Checkbox>
              </Tooltip>
            );
          })}
        </div>
        <InfiniteScroll fetchMore={fetchMore} />
      </main>
    </>
  );
}
