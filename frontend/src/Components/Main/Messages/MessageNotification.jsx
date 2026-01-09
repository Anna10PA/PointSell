import {useState} from 'react'

function MessageNotification({ name, image, lastMessage, unread, user, email }) {
    let [current, setCurrent] = useState(false)
    
    return (
        <div className={`w-full flex items-center justify-between border-b py-4  ${current ? 'border-[#f67f20]' : 'border-gray-300' }`} onClick={()=> {
            user(email)
            setCurrent(true)
        }}>
            <div className='flex items-center gap-3'>
                <img src={image} alt=""  className='w-15 h-15 rounded-[50%]'/>
                <div>
                    <h1 className='font-bold tracking-[0.5px] text-xl'>{name}</h1>
                    <p className='text-gray-400 font-semibold'>{lastMessage}</p>
                </div>
            </div>
            <div className='w-8 h-8 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white font-bold'>
                {unread > 9? '9+' :  unread}
            </div>
        </div>
    )
}

export default MessageNotification
