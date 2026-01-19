import { useContext, useState } from 'react'
import { Info } from '../Main'

function FoodStar({ id, close }) {
    let { allProduct, curentUser } = useContext(Info)
    
    let product = allProduct?.find(pr => pr.Id === id)
    let star = product?.vote.find(e => e.email === curentUser?.email)
    
    let [rating, setRating] = useState(star || 0)

    return (
        <div className="w-full h-full absolute z-90 bg-[rgba(0,0,0,0.77)] flex items-center justify-center max-md:p-3 rounded">
            <div className='bg-white text-center flex flex-col items-center px-6 py-4 gap-4 relative rounded'>
                <i className="fa-solid fa-x absolute top-3 right-3 text-gray-400 hover:text-[#f67f20] cursor-pointer" onClick={()=> {
                    close(false)
                }}></i>
                <img src={product?.product_image} alt="" className='w-40 h-40 rounded-[50%]' />
                <h1 className='font-bold text-2xl text-[#f67f20]'>{product?.product_name}</h1>
                <div>
                    <p className='font-semibold'>Rate our <span className='text-[#f67f20]'>{product?.product_name}</span> with a 5-point system!</p>
                    <p className='text-gray-400'> Your opinion is very important to us!</p>
                </div>
                <div className='flex items-center gap-3 text-3xl text-gray-300'>
                    <div className='flex items-center gap-3 text-3xl'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa-solid fa-star cursor-pointer duration-200 
                ${star <= rating ? 'text-[#F67F20]' : 'text-gray-300'} 
                hover:scale-110`}
                                onClick={() => setRating(star)}
                            ></i>
                        ))}
                    </div>
                </div>
                <div className='text-7xl'>
                    {
                        rating == 1 ? '😭':
                        rating == 2 ? '🥺':
                        rating == 3 ? '🙂':
                        rating == 4 ? '😊':
                        rating == 5 ? '😁':
                        '🤔'
                    }
                </div>
                <button disabled={rating === 0} className='disabled:bg-gray-300 disabled:text-gray-700 disabled:opacity-50 font-bold px-10 py-2 rounded cursor-pointer bg-[#f67f20] text-white'>Save</button>
            </div>
        </div>
    )
}

export default FoodStar
