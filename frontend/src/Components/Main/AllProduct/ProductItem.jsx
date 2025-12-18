import React from 'react'

function ProductItem({ info }) {
    return (
        <tr>
            <td className='flex items-center gap-3 px-5 py-3 border border-gray-100'>
                <img src={info.product_image} alt={info.product_image} className='h-15 w-15 object-cover rounded-xl' />
                <h1 className='font-bold'>{info.product_name}</h1>
            </td>
            <td className='border border-gray-200 px-5 text-center text-green-500 font-bold'>
                {info.time}m
            </td>
            <td className='pl-4 text-gray-800 font-medium border-gray-200 border wrap-break-word'>
                {info.info}
            </td>
            <td className='text-red-500 font-bold text-center border-gray-200 border px-5'>
                #{info.Id}
            </td>
            <td className='border-gray-200 border px-5 text-[#F67F20] font-bold text-center'>
                ${info.price.toFixed(2)}
            </td>
            <td className=' border-gray-200 border h-full'>
                <div className='flex items-start justify-center gap-7'>
                    <div className='flex items-center gap-2 text-green-500 duration-150 hover:text-white px-3 py-2 rounded cursor-pointer hover:bg-green-500'>
                        <i className="fa-solid fa-pen"></i>
                        <span className='font-bold'>
                            Edit
                        </span>
                    </div>
                    <div className='flex items-center gap-2 text-[#F67F20] duration-150 hover:bg-orange-400 hover:text-white px-3 py-2 rounded cursor-pointer'>
                        <i className="fa-solid fa-trash"></i>
                        <span className='font-bold'>

                            Delete
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default ProductItem
