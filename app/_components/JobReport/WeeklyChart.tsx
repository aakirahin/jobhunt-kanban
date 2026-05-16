import { WeeklyCount } from "@/lib/reportUtils"

const formatWeek = (iso: string): string => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()}`
}

const WeeklyChart = ({ data }: { data: WeeklyCount[] }) => {
    const max = Math.max(...data.map((d) => d.count), 1)
    const BAR_MAX_PX = 96

    return (
        <div className="flex items-end gap-2" style={{ height: `${BAR_MAX_PX + 40}px` }}>
            {data.map(({ week, count }) => (
                <div key={week} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <span className="text-xs text-gray-600 font-medium">{count}</span>
                    <div
                        className="w-full rounded-t-sm"
                        style={{
                            height: `${Math.max((count / max) * BAR_MAX_PX, 4)}px`,
                            background: "linear-gradient(to top, #78C3FB, #C68CFF)",
                        }}
                    />
                    <span className="text-[10px] text-gray-400 truncate w-full text-center">
                        {formatWeek(week)}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default WeeklyChart
