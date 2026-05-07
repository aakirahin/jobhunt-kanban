import Column from "@/app/_components/Column"
import FilterBar from "@/app/_components/FilterBar"

type Props = {}

// TODO THIS SHOULD GO TO BACKEND AND ALLOW CRUD OPTIONS
const columns = [
  {
    id: "saved",
    label: "Saved",
    colour: "#A6BBFB"
  },
  {
    id: "applied",
    label: "Applied",
    colour: "#99D1FB"
  },
  {
    id: "interviewed",
    label: "Interviewed",
    colour: "#4FE7CD"
  },
  {
    id: "accepted",
    label: "Accepted",
    colour: "#95EC3F"
  },
  {
    id: "rejected",
    label: "Rejected",
    colour: "#FEAAC2"
  },
]

const Page = async (props: Props) => {  
  return (
    <div className="flex flex-col gap-4">
      <FilterBar/>
      <div className="flex gap-4">
        {
          columns.map((column) => (
            <Column
              key={column.id}
              column={column}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Page