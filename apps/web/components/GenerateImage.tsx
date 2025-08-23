"use client"
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea"
import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { SelectModel } from "./Models";
import toast from "react-hot-toast";


export function GenerateImage() {    
    const [prompt, setPrompt] = useState("")
    const [selectedModel, setSelectedModel] = useState<string>()

    const { getToken } = useAuth()

    return (
        <div className="flex justify-center items-center pt-4">
            <div>
                <SelectModel selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                <div className="flex justify-center pt-4">
                        <Textarea onChange={(e) => {
                            setPrompt(e.target.value);
                        }} placeholder="Describe how you want to Generate your image." className="w-2xl"/>
                </div> 
                <div className="flex justify-center pt-4">
                    <Button onClick={async () => {
                        const token = await getToken()
                        await axios.post(`${BACKEND_URL}/ai/generate`, {
                            prompt,
                            modelId: selectedModel,
                            num: 1
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        toast("Image Generation is in Progress")
                        setPrompt("");
                    }} variant={"secondary"} className="hover: cursor-pointer hover:bg-white hover:text-black">Create Image</Button>
                </div>        
            </div>
        </div>
    )
}