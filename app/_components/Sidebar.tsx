import Image from 'next/image'

const Sidebar = () => {
    return (
        <div className='bg-[#FFF987] rounded-[20px] min-h-[calc(100vh-2rem)] w-1/6 m-4 p-6 flex flex-col justify-between'>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={150}
                height={50}
            />
        </div>
    )
}

export default Sidebar