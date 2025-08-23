"use client"
import { BACKEND_URL } from "@/app/config"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import { ImageCard, ImageCardSkeleton, TImage } from "./ImageCard"

type BulkResponse = {
    images?: TImage[]
}

export function Camera() {
    const [images, setImages] = useState<TImage[]>([]);
    const [imagesLoading, setImagesLoading] = useState(true)
    const { getToken } = useAuth()

    useEffect(() => {
        (async() => {
            const token = await getToken()
            const response = await axios.get<BulkResponse>(`${BACKEND_URL}/image/bulk`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
            setImages(response.data.images || [])
            setImagesLoading(false)
        })()
    },[])

    useEffect(() => {
        const interval = setInterval(async () => {
          if (images.find(x => x.status !== "Generated")) {
            const token = await getToken();
            const response = await axios.get<BulkResponse>(`${BACKEND_URL}/image/bulk`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            setImages(response.data.images || []);
          }
        }, 5000);
        return () => clearInterval(interval);
      }, [images]);      

    return (
        <div className="grid md:grid-cols-4 grid-cols-1 gap-2 pt-4">
            { images.map(image => <ImageCard key={image.id} {...image} />) }
            {imagesLoading && <> <ImageCardSkeleton></ImageCardSkeleton><ImageCardSkeleton></ImageCardSkeleton><ImageCardSkeleton></ImageCardSkeleton> <ImageCardSkeleton></ImageCardSkeleton> <ImageCardSkeleton></ImageCardSkeleton></> }
        </div>
    )
}