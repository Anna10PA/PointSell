function DiscountNitification({close}) {
    return (
        <div className='w-full h-full bg-[rgba(0,0,0,0.77)] flex items-center justify-center z-50 absolute top-0 right-0 px-10 max-sm:px-2'>
            <div className='bg-white rounded-2xl overflow-hidden flex justify-center items-center px-10 py-3 relative max-lg:flex-col-reverse max-lg:px-2'>
                <video autoPlay muted loop className='min-w-[200px] max-lg:max-h-[300px]'>
                    <source src='/promo code.mp4' type='video/mp4' />
                </video>
                <div className='flex items-start h-[370px] justify-between w-[50%] flex-col gap-3 mt-5 max-lg:max-h-max max-lg:w-full'>
                    <i className="fa-solid fa-xmark absolute top-8 right-8 text-2xl duration-100 hover:text-[#f67f20] cursor-pointer max-md:top-5 max-md:right-5" onClick={close}></i>
                    <div className='text-center flex flex-col gap-2 items-center w-full'>
                        <h1 className='font-bold text-3xl max-sm:text-2xl'>Congrats!</h1>
                        <h2 className='text-[16px] text-gray-400 max-sm:text-sm'>you got</h2>
                        <h3 className='font-bold text-[#f67f20] text-4xl max-sm:text-3xl'>-95% Discount</h3>
                        <p className='text-gray-400 max-md:text-sm'>If you want to get a discount, use this promo code. <br />
                            Only VIP users know about it! Excellent job! </p>
                    </div>
                    <div className='flex items-center font-bold'>
                        <img src="/icon.png" alt="" className='w-15' />
                        <h1>Point<span className='text-[#f67f20]'>Sell</span></h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiscountNitification
