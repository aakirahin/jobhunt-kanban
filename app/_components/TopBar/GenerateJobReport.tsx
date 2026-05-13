import { Button } from '../ui/button'
import { Sparkles } from 'lucide-react'
import { buttonClass } from '@/lib/tailwindClasses'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

type Props = {}

const GenerateJobReport = (props: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={`bg-linear-to-r from-blue-400 to-purple-400 text-white rounded-full flex gap-1 items-center ${buttonClass}`}>
                    <Sparkles size={20}/>
                    Generate job report
                </Button>
            </DialogTrigger>
            <DialogContent className="w-1/4 p-5 border">
                <DialogHeader>
                    <DialogTitle className='text-lg'>Generate job report</DialogTitle>
                </DialogHeader>
                <div>
                    {/* TODO SHOW PROGRESS BAR OF HOW MANY MORE JOBS TO ADD */}
                    {/* TODO SHOW EXAMPLE OF REPORT */}
                    {/* TODO IF USER HAS MORE THAN 10 JOBS, SHOW LOADING SPINNER WHILST REPORT IS BEING GENERATED THEN AUTOMATICALLY DOWNLOAD REPORT */}
                </div>
                <DialogClose asChild>
                    <Button type="button" className={buttonClass}>
                        OK
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateJobReport