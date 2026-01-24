import { useEffect, useState, useContext } from "react"
import NotificationCard from "./NotificationCard"
import { Info } from "../Main"

function Notification() {
    let { curentUser, postReadNotification } = useContext(Info)
    let [messages, setMessages] = useState([])

    useEffect(()=> {
        setMessages(curentUser?.notification)
    }, [curentUser])

    let readAllNotification = (e) => {
        e.preventDefault()
        postReadNotification('all')
    }

    return (
        <>
            <main className="w-full px-10 py-5 h-full max-sm:px-3 max-sm:py-2 ">
                <header className="flex items-center justify-between w-full gap-5 max-sm:gap-2 min-h-[10vh] ">
                    <h1 className="text-3xl font-bold max-sm:text-[25px]">Notification</h1>
                    <button className="text-lg text-[#F67F20] font-semibold cursor-pointer px-5 duration-100 hover:bg-[#F67F20] hover:text-white hover:py-2 rounded max-sm:px-2 max-sm:text-sm" onClick={readAllNotification}>Mark All As Read</button>
                </header>
                <section className="border-gray-300 rounded-2xl border  overflow-auto mt-3 h-[82vh]" >
                    {
                        messages?.length > 0 ?
                            messages?.map((item, index) => {
                                return <NotificationCard
                                    key={index}
                                    date={item.date}
                                    time={item.time}
                                    message={item.message}
                                    read={item.read}
                                />
                            })
                            : <h1 className="px-10 py-5 text-center w-full font-bold text-3xl">Loading . . . </h1>
                    }
                </section>
            </main>
        </>
    )
}

export default Notification
