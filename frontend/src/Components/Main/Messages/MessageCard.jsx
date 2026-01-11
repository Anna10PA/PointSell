import { Info } from "../Main"
import { useContext } from "react"

function MessageCard({ sender, time, message }) {
    let { curentUser } = useContext(Info)
    return (
        <div className={`w-full flex flex-col gap-1 ${curentUser?.email == sender ? 'items-end ' : 'items-start'} `}>
            <div className={`min-w-max max-w-80 font-semibold relative h-max flex flex-col px-5 py-3 ${curentUser?.email == sender  ? 'bg-[#f67f20] items-end rounded-[15px_15px_5px_15px] text-white ' : 'bg-gray-200 rounded-[15px_15px_15px_5px] items-start'}`}>
                <p className="wrap-break-word leading-tight max-w-80">{message}</p>
            </div>
            <p className=" text-gray-900 text-[10px] tracking-[1px]">{time}</p>
        </div>
    )
}

export default MessageCard
