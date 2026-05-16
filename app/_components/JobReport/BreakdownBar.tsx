type Props = {
    data: Record<string, number>
    total: number
    labelMap?: Record<string, string>
    colorMap?: Record<string, string>
    defaultColors?: string[]
}

const DEFAULT_COLOURS = ["#A6BBFB", "#4FE7CD", "#95EC3F", "#FEAAC2", "#FFF987", "#99D1FB"]

const BreakdownBar = ({ 
    data, 
    total, 
    labelMap, 
    colorMap, 
    defaultColors = DEFAULT_COLOURS 
}: Props) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1])

    if (!entries.length) return <p className="text-sm text-gray-600">No data</p>

    return (
        <div className="flex flex-col gap-3">
            {
                entries.map(([key, count], i) => {
                    const label = labelMap?.[key] ?? key
                    const color = colorMap?.[key] ?? defaultColors[i % defaultColors.length]
                    const pct = total ? Math.round((count / total) * 100) : 0

                    return (
                        <div key={key} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
                            <div className="flex-1 bg-gray-100 rounded-md h-6 overflow-hidden">
                                <div
                                    className="h-full rounded-l-md"
                                    style={{ width: `${pct}%`, backgroundColor: color }}
                                />
                            </div>
                            <span className="text-sm font-medium w-14 text-right">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BreakdownBar
