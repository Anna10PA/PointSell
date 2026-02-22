import { useLocation } from "react-router-dom"
import { Info } from "../Components/Main/Main"
import { useContext } from "react"

function Item({ image, name, info2, info3, info4, price, func, hasBlock, mode }) {
    let location = useLocation()
    let curentPage = location.pathname
    let { blockUser } = useContext(Info)

    return (
        <tr>
            <td className='flex items-center gap-3 px-5 py-3 border h-full min-h-max border-gray-100 max-sm:gap-2 max-sm:p-1.5'>
                <img src={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} alt={image ? image : 'https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg'} className='h-15 min-w-15 max-w-15 w-full object-cover rounded-xl max-[500px]:min-w-10 max-[500px]:w-10 max-[500px]:min-h-10 max-[500px]:h-10 max-[500px]:text-[10px]' />
                <h1 className='font-bold max-sm:text-sm max-[500px]:text-[12px]'>{name ? name : 'Unknown'}</h1>
            </td>
            <td className='border border-gray-200 px-5 text-center text-green-500 font-bold  table-cell max-lg:hidden  wrap-break-word'>
                {info2 ? info2 : '0'}
                {curentPage === '/main/products' ? 's' : null}
            </td>
            <td className='pl-4 text-gray-800 font-medium border-gray-200 border wrap-break-word  table-cell max-lg:hidden'>
                {info3 ? info3 : 'Unknown'}
            </td>
            <td className='text-red-500  font-bold text-start border-gray-200 border px-5  wrap-break-word table-cell max-md:hidden'>
                {info4 ? info4 : 'Unknown'}
            </td>
            <td className='border-gray-200 border px-5 text-[#F67F20] font-bold text-center  wrap-break-word table-cell max-lg:hidden'>
                ${price ? Number(price || 0).toFixed(2) : 0}
            </td>
            <td className=' border-gray-200 border h-full px-2'>
                <div className='flex items-start justify-center duration-300 w-full gap-4  max-[500px]:flex-col max-[500px]:gap-1'>
                    {
                        mode == 2 ?
                            <div className={`${mode == 2 ? 'text-green-500  wrap-break-word font-bold' : ''}`}>
                                {info2 || 0}
                            </div>
                            :
                            mode == 3 ?
                                <div className={`${'font-semibold  wrap-break-word text-gray-800'}`}>
                                    {info3 || 'Unknown'}
                                </div> :
                                mode == 4 ?
                                    <div className={`text-red-500 max-[500px]:text-[12px] ${curentPage !== '/main/products' ? 'max-[500px]:w-[120px]' : ''} wrap-break-word w-full font-bold`}>
                                        {info4}
                                    </div> :
                                    mode == 5 ?
                                        <div className="text-[#f67f20] wrap-break-word font-bold">
                                            ${price?.toFixed(2) || 0}
                                        </div>
                                        :
                                        <>
                                            <div className={`flex items-center gap-2  duration-150  px-3 py-2 rounded cursor-pointer  hover:text-white max-sm:px-2 max-sm:py-1 max-sm:text-[14px] max-[500px]:w-full  ${curentPage === '/main/costumers' && !hasBlock ? 'text-red-600 hover:bg-red-600 ' :
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
                                                            {/* <i className="fa-solid fa-pen"></i>
                                                            <span className='font-bold'>
                                                                Edit
                                                            </span> */}
                                                        </>
                                                }
                                            </div>
                                            <div className={`flex items-center gap-2 text-[#F67F20] duration-150 hover:bg-orange-400 hover:text-white px-3 py-2 rounded cursor-pointer max-sm:px-2 max-sm:py-1 max-sm:text-[14px]  ${curentPage === '/main/costumers' ? 'hidden' : 'block'} max-[500px]:w-full`} onClick={() => {
                                                func(info4, 'delete_product')
                                            }}>
                                                <i className="fa-solid fa-trash"></i>
                                                <span className='font-bold' >
                                                    Delete
                                                </span>
                                            </div>
                                        </>
                    }

                </div>
            </td>
        </tr >
    )
}

export default Item
