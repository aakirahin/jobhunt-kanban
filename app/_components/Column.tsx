type Props = {
    column: {
        id: string
        label: string
        colour: string
    }
}

const Column = ({
    column
}: Props) => {
    const { label, colour } = column

    return (
        <div className="w-full shadow-[0px_6px_0px_#3A3A3A] rounded-xl border border-[#3A3A3A] py-3 px-4" style={{ backgroundColor: colour }}>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{label}</h3>
                <strong>0</strong>
            </div>
        </div>
    )
}

export default Column