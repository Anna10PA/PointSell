import React from 'react'

function CartCard({ img, price, name, count, id, update }) {

    let action = async (type) => {
        let newCount = type === 'add' ? count + 1 : count - 1
        let url = newCount === 0 ? 'https://pointsell-4.onrender.com/delete_from_cart' : 'https://pointsell-4.onrender.com/update_cart'

        let result = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                count: newCount
            })
        })

        if (result.ok) {
            update()
        }
    }


    return (
        <div className='flex items-center justify-between gap-5 w-full'>
            <div className='flex items-center gap-4'>
                <img src={img} alt={img} className='w-18 shrink-0 h-18 object-cover rounded-2xl' />
                <div className='flex items-start flex-col font-bold leading-5.5'>
                    <h1 className='text-lg leading-5'>{name}</h1>
                    <h2 className='text-[#F67F20] mt-2'>${Number(price || 0).toFixed(2)}</h2>
                </div>
            </div>
            <div className='flex font-bold gap-3 items-center'>
                <button className='w-7 cursor-pointer rounded bg-[#F6F6F6] h-6'
                onClick={()=> {action('minus')}}>-</button>
                <h2 className='font-medium'>{count}</h2>
                <button className='w-7 rounded cursor-pointer bg-[#F67F20] text-white h-6 duration-100 hover:bg-orange-400'
                    onClick={() => { action('add') }}>+</button>
            </div>
        </div>
    )
}

export default CartCard
