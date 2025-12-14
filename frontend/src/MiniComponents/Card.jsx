function Card({ img, title, price, desc, star, allInfo }) {
    return (
        <div className='w-full p-5 border-gray-300 border rounded-2xl flex flex-col gap-3 justify-between' >
            <div className="w-full overflow-hidden rounded-xl " onClick={allInfo}>
                <img src={img} alt="" className='h-50 object-cover w-full hover:scale-[1.1] overflow-hidden duration-200' />
            </div>
            <div className='flex items-center justify-between w-full'>
                <h1 className='font-bold text-lg'>{title}</h1>
                <h2 className='font-bold text-lg text-[#F67F20]'>
                    ${price.toFixed(2)}
                </h2>
            </div>
            <p className="text-gray-400">{desc}</p>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-lg">
                    <i className="fa-solid fa-star text-[#F67F20]"></i>
                    <span className="font-bold">
                        {star.toFixed(1)}
                    </span>
                </div>
                <button className="bg-[#F67F20] text-white font-bold px-4 flex items-center gap-2 justify-center py-2 rounded-xl cursor-pointer duration-100 hover:bg-amber-500" >
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
