import { useState, useEffect, useContext } from 'react'
import { Info } from '../Main'

function OrderCard({ count, id }) {
    let [product, setProduct] = useState(null)
    let {allProduct, getAllProduct} = useContext(Info)

    getAllProduct()
    
    useEffect(() => {
        if (allProduct?.length > 0) {
            for (let item of allProduct) {
                if (item.Id == id) {
                    setProduct(item)
                    break
                }
            }
        }
    }, [allProduct, id])

    return (
        <div className='border border-gray-400 rounded-2xl p-3 flex items-center justify-between gap-5 pr-10 w-full'>
            <div className='flex items-center gap-3 w-65'>
                <img src={product ? product.product_image : 'idk.png'} alt={product ? product.product_image : 'idk.png'} className='w-20 h-20 object-cover rounded-xl' />
                <h1 className='font-bold text-wrap'>{product ? product.product_name : 'Loading . . . '}</h1>
            </div>
            <h2 className='font-bold text-lg'>Quantity: {count}</h2>
            <h2 className='font-bold text-lg'>time: {product? product.time * count : '0'}s</h2>
            <h2 className='text-[#f67f20] font-bold text-lg'>${product ? product.price.toFixed(2) : 'Loading . . .'}</h2>
        </div>
    )
}

export default OrderCard
