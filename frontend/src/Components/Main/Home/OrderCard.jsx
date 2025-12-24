import { useState, useEffect } from 'react'

function OrderCard({ count, id }) {
    let [allProductList, setAllProduct] = useState([])
    let [product, setProduct] = useState(null)

    useEffect(() => {
        async function allProduct() {
            let result = await fetch('http://localhost:5000/product20list', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (result.ok) {
                setAllProduct(final)
            }
        }
        allProduct()
    }, [])


    useEffect(() => {
        if (allProductList.length > 0) {
            for (let item of allProductList) {
                if (item.Id == id) {
                    setProduct(item)
                    break
                }
            }
        }
    }, [allProductList, id])

    console.log(product)
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
