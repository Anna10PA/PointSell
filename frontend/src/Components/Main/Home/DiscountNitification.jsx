import React from 'react'

function DiscountNitification({close}) {
    return (
        <div className='w-full h-full bg-[rgba(0,0,0,0.77)] flex items-center justify-center z-50 absolute top-0 right-0'>
            <div className='bg-white rounded-2xl overflow-hidden flex justify-center items-center px-10 py-3 relative'>
                <video autoPlay muted loop>
                    <source src='/promo code.mp4' type='video/mp4' />
                </video>
                <div className='flex items-start h-[370px] justify-between w-[50%] flex-col gap-3 mt-5'>
                    <i className="fa-solid fa-xmark absolute top-8 right-8 text-2xl duration-100 hover:text-[#f67f20] cursor-pointer" onClick={close}></i>
                    <div className='text-center flex flex-col gap-2 items-center w-full'>
                        <h1 className='font-bold text-3xl'>Congrats!</h1>
                        <h2 className='text-[16px] text-gray-400'>you got</h2>
                        <h3 className='font-bold text-[#f67f20] text-4xl'>-95% Discount</h3>
                        <p className='text-gray-400'>If you want to get a discount, use this promo code. <br />
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
