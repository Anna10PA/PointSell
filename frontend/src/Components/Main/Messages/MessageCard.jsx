import { Info } from "../Main"
import { useContext, useEffect } from "react"

function MessageCard({ sender, time, message, delete_message }) {
    let msgDate = new Date(time)
    let { curentUser } = useContext(Info)
    let today = new Date()

    let isToday = msgDate.getDate() === today.getDate() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getFullYear() === today.getFullYear()

    return (
        <div className={`w-full flex flex-col gap-1 ${curentUser?.email == sender ? 'items-end ' : 'items-start'} `}>
            <div className={`flex items-center gap-2`}>
                <div className={`${curentUser?.email == sender ? 'text-gray-400 duration-200 hover:text-red-600' : 'hidden'}`} >
                    <i className={`fa-solid fa-trash cursor-pointer`} onClick={() => {
                        delete_message(message, time)
                    }}></i>
                </div>
                <div className={`flex flex-col gap-1 ${curentUser?.email == sender ? 'items-end' : 'items-start'}`}>
                    <div className={`min-w-max max-w-80 font-semibold relative h-max flex flex-col px-5 py-3 ${curentUser?.email == sender ? 'bg-[#f67f20] items-end rounded-[15px_15px_5px_15px] text-white ' : 'bg-gray-200 rounded-[15px_15px_15px_5px] items-start'}`}>
                        <p className="wrap-break-word leading-tight max-w-80">{message}</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <p className=" text-gray-900 text-[15px] tracking-[1px]">{isToday ? String(msgDate).split(' ')[4].split(':')[0] + ':' + String(msgDate).split(' ')[4].split(':')[1] : String(msgDate).split(' ').slice(1, 3).join(' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageCard
