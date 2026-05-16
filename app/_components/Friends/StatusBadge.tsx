import React from 'react'

type Props = {
    status: string
}

const StatusBadge = ({
    status
}: Props) => {
  return status === "EMPLOYED" ?
    <span className="text-[12px] px-1.5 py-0.5 rounded-sm w-fit font-medium bg-green-100 text-green-500">
        EMPLOYED
    </span> :
    <span className="text-[12px] px-1.5 py-0.5 rounded-sm w-fit font-medium bg-blue-100 text-blue-400">
        JOB HUNTING
    </span>
}

export default StatusBadge