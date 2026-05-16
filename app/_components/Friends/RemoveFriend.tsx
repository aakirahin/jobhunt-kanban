import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { buttonClass } from '@/lib/tailwindClasses'
import { Field } from '../ui/field'

type Props = {
    onRemove: () => void
    isRemoving: boolean
}

const RemoveFriend = ({
    onRemove,
    isRemoving
}: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={`bg-red-500 text-white w-1/2 ${buttonClass}`}>
                    Remove friend
                </Button>
            </DialogTrigger>
            <DialogContent className="w-1/4 p-5 border">
                <DialogHeader>
                    <DialogTitle className='text-lg'>Remove friend</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to remove this friend? You will be removed from their friend list too.</p>
                <Field orientation="horizontal" className='justify-end'>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className={buttonClass}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={onRemove}
                        disabled={isRemoving}
                        className={`${buttonClass} bg-red-500 text-white`}
                    >
                        Remove friend
                    </Button>
                </Field>
            </DialogContent>
        </Dialog>
    )
}

export default RemoveFriend