'use client'

// Biblioteca
import { Checkbox } from "@nextui-org/react";
import { useAtom } from "jotai";

// Atoms
import { statusAtom } from "@/atom/status";

export function SettingsBillsToPay() {
    const [status, setStatus] = useAtom(statusAtom)

    return (
        <main className="w-full ">
            <section className="pb-4">
                <h3 className="text-gray-700 font-medium text-base mb-2">Status</h3>
                <div className="grid grid-cols-3 gap-2">
                    <Checkbox
                        isSelected={status.includes("Em aberto")}
                        onValueChange={() =>
                            setStatus((prev) =>
                                prev.includes("Em aberto")
                                    ? prev.filter((currentStatus) => currentStatus !== "Em aberto")
                                    : [...prev, "Em aberto"]
                            )
                        }
                    >
                        Em aberto
                    </Checkbox>
                    <Checkbox
                        isSelected={status.includes("Pago")}
                        onValueChange={() =>
                            setStatus((prev) =>
                                prev.includes("Pago")
                                    ? prev.filter((currentStatus) => currentStatus !== "Pago")
                                    : [...prev, "Pago"]
                            )
                        }
                    >
                        Pago
                    </Checkbox>
                </div>
            </section>
        </main>
    )
}