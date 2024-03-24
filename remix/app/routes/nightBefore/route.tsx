import { ToggleLeftSidebar } from '~/components/leftSidebar'

export default function route() {
    return (
    <div className="flex flex-col p-10 h-screen">
        <div className='flex text-center items-center justify-center '>
            <h1 className="text-4xl text-black font-bold">Night Before</h1>
                <ToggleLeftSidebar />
        </div>
        <div className='flex flex-row'>
            <div className='flex flex-1 text-center items-center justify-center'>
                <h2 className='text-black'>Plan out your trades</h2>
            </div>
            <div className='flex flex-1 text-center items-center justify-center'>
                <h2 className='text-black'>Execute your trade plan</h2>
            </div>
        </div>      
    </div>
    )
}
