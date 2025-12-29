import { useEffect, useState } from "react"
import {useNavigate } from "react-router-dom"
import Navigation from "../../../MiniComponents/Navigation"
import NotificationCard from "./NotificationCard"

function Notification() {
    let [messages, setMessages] = useState([])
    let navigation = useNavigate()

    useEffect(() => {
        async function getInfos() {
            try {
                let response = await fetch('http://localhost:5000/get_current_user', {
                    credentials: 'include'
                })

                if (response.status === 401) {
                    navigation('/')
                }

                if (!response.ok) {
                    console.error(response.status)
                    return 
                }

                let final = await response.json()

                if (final.notification) {
                    setMessages(final.notification)
                }

            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        }
        getInfos()
    }, [])
    // console.log(messages)

    return (
        <>
            <Navigation />
            <main className="w-full px-10 py-5 h-full">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Notification</h1>
                    <button className="text-lg text-[#F67F20] font-semibold cursor-pointer px-5 duration-100 hover:bg-[#F67F20] hover:text-white hover:py-2 rounded">Mark All As Read</button>
                </header>
                <section className="border-gray-300 rounded-2xl border  overflow-auto mt-3 h-[82vh]" >
                    {
                        messages.length > 0 ? 
                        messages.map((item, index) => {
                            return <NotificationCard 
                            key={index}
                            date={item.date}
                            time={item.time}
                            message={item.message}
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
