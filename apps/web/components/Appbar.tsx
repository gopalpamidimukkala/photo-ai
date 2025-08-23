import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Button } from './ui/button'
export function Appbar() {
    return (
        <div className='flex justify-between items-center px-8 py-4 border-b '> 
            <div className='text-2xl font-bold'>
               PhotoAI 
            </div>
            <div className='flex gap-4'>
                <SignedOut>
                    <Button variant={"ghost"} className="bg-black text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        <SignInButton />
                    </Button>
                    <SignUpButton>
                        <button className="bg-black text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer ">
                        Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>         
        </div>
    )
}