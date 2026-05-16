import { ReactNode } from "react"

type Props = {
    title: string
    children: ReactNode
}

const ReportCard = ({ title, children }: Props) => (
    <div className="bg-white rounded-xl border shadow-[0px_4px_0px_#3A3A3A] p-5">
        <h2 className="font-semibold mb-4">{title}</h2>
        {children}
    </div>
)

export default ReportCard
