import { useLocation } from "react-router-dom"
import { Info } from "../Components/Main/Main"
import { useContext } from "react"

function Item({ image, name, info2, info3, info4, price, func, hasBlock }) {
    let location = useLocation()
    let curentPage = location.pathname
    let { blockUser } = useContext(Info)

    return (
        <tr>
            <td className='flex items-center gap-3 px-5 py-3 border border-gray-100'>
                <img src={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} alt={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} className='h-15 max-w-15 w-full object-cover rounded-xl' />
                <h1 className='font-bold'>{name ? name : 'Unknown'}</h1>
            </td>
            <td className='border border-gray-200 px-5 text-center text-green-500 font-bold'>
                {info2 ? info2 : '0'}
                {curentPage === '/main/products' ? 's' : null}
            </td>
            <td className='pl-4 text-gray-800 font-medium border-gray-200 border wrap-break-word'>
                {info3 ? info3 : 'Unknown'}
            </td>
            <td className='text-red-500 font-bold text-start border-gray-200 border px-5'>
                {info4 ? info4 : 'Unknown'}
            </td>
            <td className='border-gray-200 border px-5 text-[#F67F20] font-bold text-center'>
                ${price ? Number(price || 0).toFixed(2) : 0}
            </td>
            <td className=' border-gray-200 border h-full'>
                <div className='flex items-start justify-center w-full gap-4 '>
                    <div className={`flex items-center gap-2  duration-150  px-3 py-2 rounded cursor-pointer  hover:text-white  ${curentPage === '/main/costumers' && !hasBlock ? 'text-red-600 hover:bg-red-600' :
                        curentPage === '/main/costumers' && hasBlock ? 'text-gray-600 hover:bg-gray-600 hover:text-white' : 'text-green-500 hover:bg-green-500'}`} onClick={() => {
                            if (curentPage === '/main/costumers') {
                                blockUser(info4 !== 'puturidzeana0210@gmail.com' ? info4 : null)
                            }
                        }}>
                        {curentPage === '/main/costumers' && !hasBlock ?
                            <>
                                <i className="fa-solid fa-user-slash"></i>
                                <span className='font-bold'>
                                    Block
                                </span>
                            </> :
                            curentPage === '/main/costumers' && hasBlock ?
                                <>
                                    <i className="fa-solid fa-user"></i>
                                    <span className='font-bold'>
                                        Unblock
                                    </span>
                                </>
                                :
                                <>
                                    <i className="fa-solid fa-pen"></i>
                                    <span className='font-bold'>
                                        Edit
                                    </span>
                                </>
                        }
                    </div>
                    <div className={`flex items-center gap-2 text-[#F67F20] duration-150 hover:bg-orange-400 hover:text-white px-3 py-2 rounded cursor-pointer ${curentPage === '/main/costumers' ? 'hidden' : 'black'}`} onClick={() => {
                        func(!info4.includes('@') ? 'delete_product' : '')
                    }}>
                        <i className="fa-solid fa-trash"></i>
                        <span className='font-bold' >
                            Delete
                        </span>
                    </div>
                </div>
            </td>
        </tr >
    )
}

export default Item
