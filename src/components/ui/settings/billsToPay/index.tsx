'use client'

// React
import { useState } from 'react'

// HeroUI Checkbox
import { Checkbox, Tooltip } from '@heroui/react'

// State management
import { useAtom } from 'jotai'
import { statusAtom } from '@/atom/status'
import { costCenterAtom } from '@/atom/costCenter'

// Utils
import { searchFilter } from '@/utils/filters/searchFilter'
import { InfiniteScroll } from '@/utils/infiniteScroll'

// Props
type SettingsBillsToPayProps = {
    costCenter?: { ID_CNT: string; DESCRICAO_CNT: string }[]
}

export function SettingsBillsToPay({ costCenter }: SettingsBillsToPayProps) {
    const [status, setStatus] = useAtom(statusAtom)
    const [selectedCenters, setSelectedCenters] = useAtom(costCenterAtom)
    const [search, setSearch] = useState<string>('')
    const [limit, setLimit] = useState<number>(0)

    const filteredCenters = searchFilter({ data: costCenter || [], search }).slice(0, limit)

    const fetchMore = () => {
        if (limit < Number(costCenter?.length)) {
            setLimit(limit + 10);
        }
    };

    const toggleStatus = (value: string) => {
        setStatus(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        )
    }

    const toggleCenter = (id: string) => {
        setSelectedCenters(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Status</h3>
                <div className="flex flex-wrap gap-4">
                    {['Em aberto', 'Pago'].map(st => (
                        <Checkbox
                            key={st}
                            isSelected={status.includes(st)}
                            onValueChange={() => toggleStatus(st)}
                            className="text-base text-gray-700"
                        >
                            {st}
                        </Checkbox>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Centro de Custo</h3>
                    <input
                        type="text"
                        placeholder="Buscar centro..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-[220px] h-full overflow-auto">
                    {filteredCenters.length > 0 ? (
                        filteredCenters.map(cc => (
                            <Tooltip key={cc.ID_CNT} content={`${cc.ID_CNT} - ${cc.DESCRICAO_CNT}`} closeDelay={50}>
                                <Checkbox
                                    key={cc.ID_CNT}
                                    isSelected={selectedCenters.includes(cc.ID_CNT)}
                                    onChange={() => toggleCenter(cc.ID_CNT)}
                                >
                                    <p className="w-32 truncate text-gray-700">{cc.DESCRICAO_CNT}</p>
                                </Checkbox>
                            </Tooltip>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center w-full">
                            Nenhum centro encontrado.
                        </p>
                    )}
                    <InfiniteScroll fetchMore={fetchMore} />
                </div>

            </div>
        </div>
    )
}
