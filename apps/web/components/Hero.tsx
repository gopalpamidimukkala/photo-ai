"use client"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Button } from './ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useRouter } from 'next/navigation'

export function Hero() {
    const router = useRouter()
    return (
        <div className="flex justify-center">
            <div className="max-w-6xl">
                <h1 className="text-8xl p-2 text-center pb-2">
                     Generate Images for yourself and your family
                </h1>
                <Carousel>
                <CarouselContent>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1739277231-0b2465581e9551abecd467b163d0d48a-1.png'} />
                    </CarouselItem>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1739273789-920e7410ef180855f9a5718d1e37eb3a-1.png'} />                    
                    </CarouselItem>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1739273783-9effbeb7239423cba9629e7dd06f3565-1.png'} />
                    </CarouselItem>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1738861046-1175c64ebe0ecfe10b857e205b3b4a1e-3.png'} />
                    </CarouselItem>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1738859038-086cec35785b734c68f99cab1f23d5a2-3.png'} />
                    </CarouselItem>
                    <CarouselItem className="basis-1/4">
                        <img className="w-max-[400px]" src={'https://r2-us-west.photoai.com/1738859049-0c3f5f8cbb13210cf7bb1e356fd5a30a-3.png'} />
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

                <div className="flex justify-center">
                    <SignedIn>
                        <Button onClick={ () => {
                            router.push('/dashboard')
                            }} 
                            className='mt-4 py-6 bg-gray-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-16 sm:px-5 cursor-pointer hover:bg-white hover:text-black'> Dashboard </Button>
                    </SignedIn>
                    <SignedOut>
                        <Button className='mt-4 py-6 bg-gray-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-16 sm:px-5 cursor-pointer hover:bg-white hover:text-black'>
                            <SignInButton />
                        </Button>
                    </SignedOut>
                </div>
            </div>
        </div>
    )
}