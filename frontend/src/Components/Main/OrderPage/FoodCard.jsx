
function FoodCard({ image, name, price, count }) {
  return (
    <div className='border border-gray-400 p-3 rounded-2xl flex items-center w-full justify-between pr-8 max-sm:p-1 max-sm:gap-4 '>
      <div className='flex items-center gap-5 max-sm:gap-2'>
        <img src={image} alt="" className='w-20 h-20 object-cover rounded-2xl' />
        <div className='flex items-center gap-3 font-bold text-xl max-md:text-[15px] max-sm:gap-2'>
          <h1>
            {name}
          </h1>
          <h2>
            X {count}
          </h2>
        </div>
      </div>
      <h1 className='text-xl font-bold text-[#f67f20] max-sm:text-sm'>${(price * count).toFixed(2)}</h1>
    </div>
  )
}

export default FoodCard
