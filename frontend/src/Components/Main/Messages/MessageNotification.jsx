function MessageNotification({ user, email, image, name, active, current, setCurrent }) {
    return (
        <div className={`w-full flex items-center justify-between border-b py-4  ${current ? 'border-[#f67f20]' : 'border-gray-300'}`} onClick={() => {
            user(email)
            setCurrent(true)
        }}>
            <div className='flex items-center gap-3 max-sm:gap-2'>
                <div className='relative w-15 h-15 max-sm:w-12 max-sm:h-12'>
                    <img src={image} alt="" className='w-15 h-15 rounded-[50%] max-sm:w-12 max-sm:h-12' />
                    <div className={`absolute bottom-0 right-0 border-2 border-white max-sm:w-4 max-sm:h-4 w-5 h-5 rounded-[50%] ${active ? 'bg-[#007400]' : 'bg-gray-400'}`}></div>
                </div>
                <div>
                    <h1 className='font-bold tracking-[0.5px] text-xl max-sm:text-[15px]'>{name}</h1>
                    {/* <p className='text-gray-400 font-semibold max-sm:text-sm'>
                        start text
                    </p> */}
                </div>
            </div>
            {/* <div className='w-8 h-8 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white font-bold'> */}
                {/* {unread > 9? '9+' :  unread} */}
            {/* </div> */}
        </div>
    )
}

export default MessageNotification
