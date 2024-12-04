import { useState } from "react";
import { logger } from "../pages/api/logger";
import type { Record } from "../lib/models/types/types";
import { OrbButtonTsx } from "./OrbButtonTsx";

interface RecordCardProps {
    record: Record;
    records: Record[];
    user_id: string;
}

export default function RecordCard({
    record,
    records,
    user_id,
}: RecordCardProps) {
    const [isInCollection, setIsInCollection] = useState(() => {
        return records.some((r) => r.discogs_id === record.discogs_id);
    });

    const handleToggleCollection = async () => {
        try {
            if (isInCollection) {
                await fetch(`/api/records/${record.discogs_id}`, { method: "DELETE" });
            } else {
                await fetch(`/api/records/${record.discogs_id}`, {
                    method: "POST",
                    body: JSON.stringify(record),
                });
            }
            setIsInCollection(!isInCollection);
        } catch (error) {
            logger.error("Failed to update collection:", error);
        }
    };

    return (
        <div className="w-3/4 flex flex-col max-w-md m-10 relative overflow-hidden z-10 bg-black/40 backdrop-blur-md p-4 rounded-xl shadow-black shadow-2xl  duration-300 hover:shadow-none hover:translate-y-1 transition-all will-change-transform record-card">
            {isInCollection ? (
                <div className="absolute w-36 h-36 bg-yellow-500 bg-opacity-50 rounded-full -z-10 blur-2xl top-20 right-0 transition-all duration-1000 ease-out" />
            ) : (
                <div className="absolute w-36 h-36 bg-transparent bg-opacity-50 rounded-full -z-10 blur-2xl top-20 right-0 transition-all duration-1000 ease-out" />
            )}

            <div className="flex flex-row">
                <img
                    src={record.image_url ? record.image_url : "../assets/logo.png"}
                    alt={record.title}
                    className="w-32 h-32 object-cover mb-4 rounded-lg"
                />
                <div className="flex flex-col justify-center text-gray-300 text-base m-4">
                    <p>
                        {record.year}, {record.country}
                    </p>
                    <p>
                        {record.label ? record.label : "Label desconocida"} - {record.catno}
                    </p>
                </div>
            </div>

            <div className="p-4">
                <p className="font-bold text-2xl text-yellow-500 mb-2 artist">
                    {record.artist}
                </p>
                <p className="text-gray-300 mb-2 title">{record.title}</p>
            </div>

            <div className="transition-transform duration-1000 ease-in-out">
                {isInCollection ? (
                    <OrbButtonTsx
                        text="Eliminar"
                        primaryColor="#facc15"
                        secondaryColor="#ef4444"
                        onClick={handleToggleCollection}
                    />
                ) : (
                    <OrbButtonTsx
                        text="Añadir"
                        primaryColor="#ef4444"
                        secondaryColor="#22c55e"
                        onClick={handleToggleCollection}
                    />
                )}
            </div>
        </div>
    );
}
