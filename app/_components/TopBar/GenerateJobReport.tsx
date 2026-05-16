"use client"

import { Button } from '../ui/button'
import { Info, Sparkles } from 'lucide-react'
import { buttonClass } from '@/lib/tailwindClasses'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Field } from '../ui/field'
import { useAuth } from '@/app/_context/authentication'
import { useRouter } from 'next/navigation'

const THRESHOLD = 10

type Props = {
    jobCount: number
}

const GenerateJobReport = ({ jobCount }: Props) => {
    const { user } = useAuth()
    const router = useRouter()
    const count = Math.min(jobCount, THRESHOLD)
    const percentage = (count / THRESHOLD) * 100
    const remaining = THRESHOLD - count
    const unlocked = jobCount >= THRESHOLD
    const features = [
        "Response, interview & offer rates",
        "Avg. time from applied → interview → offer",
        "Breakdown by role, location & work arrangement",
        "Applications per week & consistency trends",
        "AI-generated summary of your job search",
    ]

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
                    <DialogTitle className='text-lg'>
                        Generate job report
                        <span className='text-xs font-light uppercase bg-green-100 border border-green-200 text-green-500 py-1 px-2 rounded-full ml-2 tracking-wide'>Beta</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {
                        !unlocked && (
                            <div className='space-y-2'>
                                <p className="text-gray-600">
                                    Add <span className="text-[#3A3A3A] font-semibold">{remaining} more {remaining === 1 ? "job" : "jobs"}</span> to unlock your report.
                                </p>
                                <div className="w-full bg-gray-50 rounded-md h-8 overflow-hidden border">
                                    <div
                                        className="h-full rounded-l-md transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                            background: "linear-gradient(to right, #FF8EAE, #FFF987, #73E600, #16E0BD, #78C3FB, #89A6FB)"
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-[#3A3A3A] font-medium text-right">{count} / {THRESHOLD}</p>
                            </div>
                        )
                    }
                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-xs font-semibold text-[#3A3A3A] uppercase tracking-wide mb-2">Your report will include:</p>
                        {
                            features.map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Sparkles size={14} color='#C68CFF'/>
                                    {item}
                                </div>
                            ))
                        }
                    </div>
                    <span className={`text-[13px] text-blue-500 bg-blue-50 border border-blue-200 w-full p-2 justify-center items-center rounded-lg flex gap-1.5 my-2`}>
                        <Info size={16}/>
                        More applications = more accurate insights
                    </span>
                </div>
                <Field orientation="horizontal" className='justify-end'>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className={buttonClass}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        className={buttonClass}
                        disabled={!unlocked}
                        onClick={() => { if (user) router.push(`/user/${user.id}/report`) }}
                    >
                        Generate
                    </Button>
                </Field>
            </DialogContent>
        </Dialog>
    )
}

export default GenerateJobReport