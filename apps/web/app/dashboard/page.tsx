import { Camera } from "@/components/Camera"
import { GenerateImage } from "@/components/GenerateImage"
import { Packs } from "@/components/Packs"
import { Train } from "@/components/Train"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
    return (
        <div className=" flex justify-center pt-2">
            <div className="m-w-6xl">
                <div className="flex justify-center">
                    <Tabs defaultValue="camera">
                        <div className="flex justify-center">
                            <TabsList className="m-4 p-4">
                                <TabsTrigger value="camera">Camera</TabsTrigger>
                                <TabsTrigger value="generate">Generate Image</TabsTrigger>
                                <TabsTrigger value="packs">Packs</TabsTrigger>
                                <TabsTrigger value="train">Train Model</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="camera"><Camera/></TabsContent>
                        <TabsContent value="generate"><GenerateImage/></TabsContent>                        
                        <TabsContent value="packs"><Packs/></TabsContent>
                        <TabsContent value="train"><Train/></TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}