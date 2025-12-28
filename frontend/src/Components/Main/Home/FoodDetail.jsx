function FoodDetail({ allInfo, open }) {

  let startFunc = (star) => {
    let arr = []
    for (let i = 0; i < Math.floor(star); i++) {
      arr.push(i)
    }
    return arr
  }

  return (
    <div className='bg-white h-min w-max flex items-start rounded-2xl overflow-hidden relative max-w-[600px] mx-10 max-md:flex-col max-md:pb-2.5 max-md:min-w-[200px] max-md:w-full max-sm:mx-1 p-5' >
      <i className="fa-solid fa-xmark absolute top-5 right-5 text-2xl duration-75 cursor-pointer hover:text-[#F67F20] z-50" onClick={() => {
        open(false)
      }}></i>
      <div className='w-[95%] max-w-[300px] h-[350px] overflow-hidden min-w-[200px] max-md:min-w-full rounded'>
        <img src={allInfo.product_image} alt={allInfo.product_image} className='object-cover w-full h-full duration-200 ' />
      </div>
      <div className='p-5 flex items-start flex-col justify-between h-full gap-3 w-max min-w-[280px] min-h-[300px] max-md:min-w-full max-md:w-full'>
        <h1 className='text-3xl font-extrabold'>{allInfo.product_name}</h1>
        <div className="flex items-start flex-col gap-6 h-[80%] ">
          <div className=" h-[50%] flex items-start flex-col justify-between mt-3">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-info  bg-gray-400 text-[10px] rounded-[50%] text-white px-2 py-1.5"></i>
              <p className="text-gray-400 leading-[1.3] w-[80%] text-sm">{allInfo.product_description}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <i className="fa-solid fa-people-group "></i>
              <h1 className="text-sm">{allInfo.info}</h1>
            </div>
            <div className="flex items-center justify-start gap-3 text-gray-400">
              <i className="fa-regular fa-clock text-xl"></i>
              <h3 className="text-sm">
                {allInfo.time}m
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#F67F20] mt-2">
            <i className="fa-solid fa-tag text-2xl"></i>
            <div className="flex items-center gap-4">
              <h3 className='text-2xl font-bold'>
                ${Number(allInfo.price * (100 - Number(allInfo.discount.split('%')[0])) / 100).toFixed(2)}
              </h3>
              <h4 className={` ${allInfo.discount ? 'text-xl font-bold line-through decoration-1 text-gray-400' : 'hidden'}`}>
                ${allInfo.discount ? allInfo.price.toFixed(2) : null}
              </h4>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-3 justify-center'>
          <div className='text-2xl  text-[#f6af20] flex items-center gap-1'>
            {
              startFunc(allInfo.star).map((_, i) => {
                return <i className="fa-solid fa-star" key={i}></i>
              })
            }
            {
              allInfo.star % 1 == 0 ? '' :
                <i className="fa-solid fa-star-half"></i>
            }
          </div>
          <h1 className='font-bold text-xl text-gray-700'>
            / {allInfo.star.toFixed(1)}
          </h1>
        </div>
      </div>
      {/* <h1 className='absolute font-bold right-5 bottom-4 max-md:left-5 max-md:top-5 text-gray-400 max-md:bg-[rgba(255,255,255,0.74)] max-md:h-min max-md:w-max max-md:px-4 rounded py-1.5'>#{allInfo.Id}</h1> */}
    </div>
  )
}

export default FoodDetail
