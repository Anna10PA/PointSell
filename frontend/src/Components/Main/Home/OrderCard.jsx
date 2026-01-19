import { useState, useEffect, useContext } from 'react'
import { Info } from '../Main'

function OrderCard({ count, id }) {
    let [product, setProduct] = useState(null)
    let { allProduct } = useContext(Info)
    let [currentInfo, setCurrentInfo] = useState(1)

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
        <div className='border border-gray-400 rounded-2xl p-3 flex items-center justify-between gap-5 pr-10 w-full max-md:pr-5' onClick={() => {
            if (window.innerWidth < 760) {
                setCurrentInfo(value => value == 3 ? 1 : value + 1)
            }
        }}>
            <div className='flex items-center gap-3 w-65 max-md:w-max max-sm:gap-2'>
                <img src={product ? product.product_image : 'idk.png'} alt={product ? product.product_image : 'idk.png'} className='w-20 h-20  min-w-19 min-h-19 object-cover rounded-xl' />
                <h1 className='font-bold text-wrap max-md:text-sm'>{product ? product.product_name : 'Loading . . . '}</h1>
            </div>
            <h2 className={`font-bold text-lg max-lg:text-[15px] ${currentInfo === 1 ? 'max-md:block max-md:text-center' : 'max-md:hidden'}`}>
                Quantity: {count}
            </h2>

            {/* Time */}
            <h2 className={`font-bold text-lg max-lg:text-[15px] ${currentInfo === 2 ? 'max-md:block max-md:text-center' : 'max-md:hidden'}`}>
                time: {product ? product.time * count : '0'}s
            </h2>

            {/* Price */}
            <h2 className={`text-[#f67f20] font-bold text-lg max-lg:text-[15px] ${currentInfo === 3 ? 'max-md:block max-md:text-center' : 'max-md:hidden'}`}>
                ${product ? Number(product.price || 0).toFixed(2) : '0.00'}
            </h2>
        </div>
    )
}

export default OrderCard
