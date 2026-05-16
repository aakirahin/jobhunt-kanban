"use client"

import { buttonClass, divClass } from '@/lib/tailwindClasses'
import { useSearchParams } from 'next/navigation'
import { Button } from '../_components/ui/button'
import { CircleUser } from 'lucide-react'

type Props = {}

const Page = (props: Props) => {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorMessage = {
    setup_failed: "Could not complete setup. Please contact admin.",
    missing_code: "Could not verify session. Please try again later. If error persists, please contact admin.",
    auth_failed: "Could not authenticate user. Please try again later. If error persists, please contact admin.",
  }

  console.log(error)

  return (
    <div className="min-h-[calc(100vh-2rem)] justify-items-center content-center">
      <div className={`${divClass} gap-6`}>
        <h1 className="text-4xl font-momo">
          Failed to authenticate.
        </h1>
        <p>
          {errorMessage[error]}
        </p>
        <div className='space-y-3'>
          <Button 
            type="reset"
            onClick={() => window.location.href = "/guest"}
            className={`bg-gray-50 py-4.5 w-full flex items-middle ${buttonClass}`}
          >
            <CircleUser size={14}/>
            Continue as guest
          </Button>
          <Button 
            type="reset"
            onClick={() => window.location.href = "/"}
            className={`bg-[#FFF987] py-4.5 w-full ${buttonClass}`}
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page