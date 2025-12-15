import React from 'react'

function CartCard({ img, price, name }) {
    return (
        <div className='flex items-center justify-between gap-5 w-full '>
            <div className='flex items-center gap-4'>
                <img src={img} alt={img} className='w-18 h-18 object-cover rounded-2xl' />
                <div className='flex items-start flex-col font-bold leading-5.5'>
                    <h1 className='text-xl'>{name}</h1>
                    <h2 className='text-[#F67F20] '>${price.toFixed(2)}</h2>
                </div>
            </div>
            <div className='flex font-bold gap-3 items-center'>
                <button className='w-7 cursor-pointer rounded bg-[#F6F6F6] h-6'>-</button>
                <h2 className='font-medium'>1</h2>
                <button className='w-7 rounded cursor-pointer bg-[#F67F20] text-white h-6'>+</button>
            </div>
        </div>
    )
}

export default CartCard
