import FriendsClient from "@/app/_components/Friends/FriendsClient"

type Props = {
  params: Promise<{ 
    userId: string 
  }>
}

const Page = async ({ params }: Props) => {
  await params // ensure params resolve before render
  return <FriendsClient />
}

export default Page