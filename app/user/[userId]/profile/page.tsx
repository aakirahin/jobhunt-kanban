"use client"

import { Button } from '@/app/_components/ui/button'
import { useAuth } from '@/app/_context/authentication'
import { useDeleteUserMutation } from '@/lib/hooks/users'
import { buttonClass } from '@/lib/tailwindClasses'
import { ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const Page = () => {
  const { user } = useAuth()
  const { deleteUser } = useDeleteUserMutation()
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const handleDelete = async () => {
    deleteUser(user!.id)
  }

  return (
    <div className='text-[14px] space-y-8 p-4'>
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
            <Button className={`${buttonClass} bg-gray-50`} onClick={() => setIsEdit(true)}>
              Edit profile
            </Button>
            <Button className={`${buttonClass} bg-red-500 text-white`} onClick={handleDelete}>
              Delete account
            </Button>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-momo'>Job reports</h3>
        <p className='text-sm text-gray-400'>Nothing here yet.</p>
      </div>
    </div>
  )
}

export default Page