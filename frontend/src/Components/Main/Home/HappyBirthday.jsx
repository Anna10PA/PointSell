import { useState } from "react"

function HappyBirthday({ close, user, year }) {
    let [start, setStart] = useState(false)

    return (
        <div className='w-full h-full absolute top-0 right-0 z-90 bg-[rgba(0,0,0,0.77)] flex items-center justify-center p-5' >
            <div className="bg-white rounded relative overflow-hidden min-w-[340px] min-h-[60vh] max-sm:min-h-max border-4 border-[#f67f20]" >
                <i className={`fa-solid fa-xmark z-50 absolute top-6 right-6 text-2xl text-gray-400 cursor-pointer duration-100 hover:text-[#f67f20] ${!start ? 'opacity-0' : ''}`} onClick={() => {
                    close(false)
                }}></i>
                <div className="w-full h-full relative">
                    {
                        !start ?
                            <div className={`w-full py-15  absolute bg-white flex items-center justify-center flex-col gap-4 ${start ? 'hidden' : ''}`}>
                                <div className=" z-40 flex items-center flex-col gap-1 text-gray-400">
                                    <h1 className="text-[#f67f20] font-bold text-2xl">HAPPY BIRTHDAY</h1>
                                    <h2 className="text-xl text-[#FEBF91] font-semibold">{user ? user : ''}!</h2>
                                    <h3 className="font-bold text-3xl text-[#f67f20]">{(new Date().getFullYear()) - year} </h3>
                                </div>
                                <img src="/gift.jpg" alt="" className="w-60 cursor-pointer z-30" id='gift' onClick={() => {
                                    setStart(true)
                                }} />
                            </div>
                            :
                                <video autoPlay={start} loop muted={!start} className="">
                                    <source src='/happy_birthday.mp4' type='video/mp4' />
                                </video>
                    }
                </div>
            </div>
        </div>
    )
}

export default HappyBirthday
