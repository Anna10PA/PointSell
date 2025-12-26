import React from 'react'

function Warning({open, title, message, deleteFunction}) {
    return (
        <div className='bg-white rounded-2xl flex items-center gap-5 p-7 flex-col justify-center max-w-[500px] w-[80%]'>
            <img src="/warning.jpg" alt="/warning.jpg" className='w-30' />
            <div className='text-center leading-10'>
                <h1 className='font-bold text-xl'>{title}</h1>
                <p className='text-gray-400'>{message}</p>
            </div>
            <div className='flex items-center gap-5'>
                <button className='h-10 bg-[#f67f20] rounded text-white font-bold px-10 duration-100 hover:bg-orange-400 cursor-pointer' onClick={deleteFunction}>
                    Yes
                </button>
                <button className='h-10 bg-black rounded text-white font-bold px-10 duration-100 hover:bg-gray-950 cursor-pointer' onClick={open}>
                    No
                </button>
            </div>
        </div>
    )
}

export default Warning
