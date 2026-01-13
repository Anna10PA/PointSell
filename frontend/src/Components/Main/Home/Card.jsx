function Card({ img, title, price, desc, star, allInfo, discount, id, update }) {

    let addInCart = async () => {
        try {

            let res = await fetch('https://pointsell-4.onrender.com/user_cart', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: id,
                    product_count: 1
                }),
            })

            if (res.ok) {
                if (typeof update === 'function') {
                    await update()
                }
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div className='w-full p-5 border-gray-300 border rounded-2xl flex flex-col gap-3 justify-between' >
            <div className="w-full overflow-hidden rounded-xl relative" onClick={allInfo}>
                <div className={`${discount ? ' absolute top-1 right-1 bg-orange-400 text-white font-bold rounded px-5 py-1.5 z-2 w-max' : 'hidden'}`}>
                    - {discount}
                </div>
                <img src={img} alt="" className='h-50 object-cover w-full hover:scale-[1.1] overflow-hidden duration-200' />
            </div>
            <div className='flex items-center justify-between w-full gap-3'>
                <h1 className='font-bold text-lg'>{title}</h1>
                <div className="flex items-center gap-4 ">
                    <h2 className={`${discount ? 'text-gray-400 line-through decoration-1' : 'hidden'}`}>
                        ${discount ? Number(price || 0).toFixed(2) : null}
                    </h2>
                    <h2 className='font-bold text-lg text-[#F67F20]'>
                        ${discount ? (price - price * Number(discount.split('%')[0]) / 100).toFixed(2) : price.toFixed(2)}
                    </h2>
                </div>
            </div>
            <p className="text-gray-400">{desc}</p>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-lg">
                    <i className="fa-solid fa-star text-[#F67F20]"></i>
                    <span className="font-bold">
                        {star.toFixed(1)}
                    </span>
                </div>
                <button className="bg-[#F67F20] text-white font-bold px-4 flex items-center gap-2 justify-center py-2 rounded-xl cursor-pointer duration-100 hover:bg-amber-500" onClick={addInCart}>
                    <i className="fa-solid fa-plus"></i>
                    <span>
                        Add Product
                    </span>
                </button>
            </div>
        </div>
    )
}

export default Card
