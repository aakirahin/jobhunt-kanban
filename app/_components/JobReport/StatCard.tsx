type Props = {
    label: string
    value: string
}

const StatCard = ({ 
    label, 
    value 
}: Props) => (
    <div className="bg-white rounded-xl border shadow-[0px_4px_0px_#3A3A3A] p-6 flex flex-col gap-2">
        <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">{label}</span>
        <span className="text-4xl font-momo text-[#3A3A3A]">{value}</span>
    </div>
)

export default StatCard
