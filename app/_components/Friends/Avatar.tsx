import Image from 'next/image'
import React from 'react'

type Props = { 
    src: string | null
    name: string | null 
}

const Avatar = ({
    src,
    name
}: Props) => {
    const initials = (name ?? "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    if (src) {
        return (
            <Image
                src={src}
                alt={name ?? "User"}
                width={52}
                height={52}
                className="rounded-full object-cover shrink-0"
            />
        )
    }

    return (
        <div className="w-[52px] h-[52px] rounded-full bg-[#A6BBFB] flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-[#3A3A3A]">{initials}</span>
        </div>
    )
}

export default Avatar