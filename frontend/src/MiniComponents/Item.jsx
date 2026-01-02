import { useLocation } from "react-router-dom"

function Item({image, name, info2, info3, info4, price, func}) {
    let location = useLocation()
    let curentPage = location.pathname

    return (
        <tr>
            <td className='flex items-center gap-3 px-5 py-3 border border-gray-100'>
                <img src={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} alt={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} className='h-15 w-15 object-cover rounded-xl' />
                <h1 className='font-bold'>{name ? name : 'Unknown'}</h1>
            </td>
            <td className='border border-gray-200 px-5 text-center text-green-500 font-bold'>
                {info2 ? info2 : 'Unknown'}
                {curentPage === '/main/products' ? 's' : null}
            </td>
            <td className='pl-4 text-gray-800 font-medium border-gray-200 border wrap-break-word'>
                {info3 ? info3 : 'Unknown'}
            </td>
            <td className='text-red-500 font-bold text-start border-gray-200 border px-5'>
                {info4 ? info4 : 'Unknown'}
            </td>
            <td className='border-gray-200 border px-5 text-[#F67F20] font-bold text-center'>
                ${price ? price.toFixed(2): 0}
            </td>
            <td className=' border-gray-200 border h-full'>
                <div className='flex items-start justify-center gap-4'>
                    <div className='flex items-center gap-2 text-green-500 duration-150 hover:text-white px-3 py-2 rounded cursor-pointer hover:bg-green-500'>
                        <i className="fa-solid fa-pen"></i>
                        <span className='font-bold'>
                            Edit
                        </span>
                    </div>
                    <div className='flex items-center gap-2 text-[#F67F20] duration-150 hover:bg-orange-400 hover:text-white px-3 py-2 rounded cursor-pointer' onClick={()=> {
                        func(info4, 'delete_product')
                    }}>
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

export default Item
