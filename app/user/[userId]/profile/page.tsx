"use client"

import { Button } from '@/app/_components/ui/button'
import { useAuth } from '@/app/_context/authentication'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { buttonClass } from '@/lib/tailwindClasses'
import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

const Page = () => {
  const { user } = useAuth()
  const supabase = createSupabaseBrowserClient()

  const deleteUser = () => {
    supabase.auth.admin.deleteUser(user.id, false)
    supabase.auth.signOut()
    toast.success("User deleted successfully!")
    window.location.href="/"
  }

  return (
    <div className='mt-6 ml-4 text-[14px]'>
      <div className='flex gap-10'>
        <Image
          src={user?.user_metadata.picture ?? "/avatar-default.png"}
          alt="Avatar"
          height={200}
          width={200}
          className='rounded-full'
        />
        <div className='flex flex-col gap-2 mt-4'>
          <span className='text-2xl font-medium'>
            {user?.user_metadata.full_name ?? "N/A"}
          </span>
          <span className='flex gap-2'>
            {user?.email}
            {
              user?.user_metadata.email_verified && 
              <span className='flex gap-1 text-[13px] items-center text-green-600'>
                <ShieldCheck size={14}/>
                Email verified
              </span>
            }
          </span>
          <div className='flex gap-2 mt-3'>
            <Button className={`${buttonClass} bg-gray-50`}>
              Edit profile
            </Button>
            <Button className={`${buttonClass} bg-red-600 text-white`} onClick={deleteUser}>
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page