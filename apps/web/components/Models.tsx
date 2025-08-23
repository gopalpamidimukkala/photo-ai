"use client"
import { BACKEND_URL } from "@/app/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface TModel {
    id: string;
    thumbnail: string;
    name: string;
    trainingStatus: "Generated" | "Pending";
}

export function SelectModel({selectedModel, setSelectedModel}: {
    selectedModel?: string;
    setSelectedModel: (model: string) => void;
}) {
    const { getToken } = useAuth()
    const [models, setModels] = useState<TModel[]>([])
    const [modelLoading, setModelLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const token = await getToken()
            const response = await axios.get(`${BACKEND_URL}/models`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setModels(response.data.models)
            setSelectedModel(response.data.models[0]?.id)
            setModelLoading(false)
        })()
    },[])

    return ( 
        <>
            <div className="text-2xl max-w-4xl">
                Select Model
            </div>

            <div className="max-w-2xl">
                <div className="grid grid-cols-3 gap-2 p-2">
                {models.filter(model => model.trainingStatus === "Generated").map(model => <div className={`${selectedModel === model.id ? "border-red-300" : ""} cursor-pointer rounded border p-2 w-full`} onClick={() => {
                setSelectedModel(model.id);
                }}>
                    <div className="flex justify-between flex-col h-full">
                        <div>
                            <img src={model.thumbnail} className="rounded"/>
                        </div> 
                        <div className="p-8">
                            {model.name}    
                        </div>
                    </div>
                </div>)}
            </div>

            {models.find(x => x.trainingStatus !== "Generated") && "More models are being trained..."}
            
            {modelLoading && <div className="flex gap-2 p-4">
                <Skeleton className="h-40 w-full rounded" />    
                <Skeleton className="h-40 w-full rounded" />    
                <Skeleton className="h-40 w-full rounded" />    
                <Skeleton className="h-40 w-full rounded" />    
            </div>}
        </div>
    </>
    )
}