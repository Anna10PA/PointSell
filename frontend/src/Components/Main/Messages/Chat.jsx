import { useEffect, useState } from "react"
import MessageCard from "./MessageCard"


function Chat({ user }) {
    let [message, setMessages] = useState([])
    useEffect(() => {

        let readMessages = async () => {
            let res = await fetch('http://localhost:5000/read_user_messages', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                })

            })
            if (res.ok) {
                let data = await res.json()
                setMessages(data)
            }

        }
        readMessages()
    }, [user?.email])
    console.log(message)
    return (
        <section className="w-[47%] h-[73vh]">
            <header className="w-full flex items-center justify-between py-5 border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 relative">
                        <img src={user?.profileUrl} alt="" className="w-14 object-cover h-14 rounded-[50%]" />
                        <div className={`${user?.active ? 'bg-[#007400]' : 'bg-gray-400'} w-5 h-5 rounded-[50%] absolute bottom-0 right-0 border-2 border-white`}></div>
                    </div>
                    <div className="leading-5">
                        <h1 className="font-bold text-xl">{user?.name}</h1>
                        <p className="text-md text-gray-400 font-semibold">{user?.position}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[50%] bg-[#039803] flex items-center justify-center text-white">
                        <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="w-10 h-10 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white">
                        <i className="fa-solid fa-video"></i>
                    </div>
                </div>
            </header>
            <section className="h-[72vh] overflow-y-auto py-5 w-full flex flex-col gap-3 px-4">

                {
                    message.length > 0 ? message?.map((item, index) => {
                        return <MessageCard
                            key={index}
                            sender={item.sender}
                            message={item.message}
                            time={item.date}
                        />
                    }) :
                        <video autoPlay muted loop>
                            <source src='/dog_2.mp4' type="video/mp4" />
                        </video>
                }
            </section>
            <div className="w-full relative">
                <input type="text" placeholder="Write Message..." className="w-full rounded-3xl px-5 py-3 outline-[#f67f20] border border-gray-300 pr-14" />
                <div className="w-10 h-10 bg-[#f67f20] rounded-[50%] text-white flex items-center justify-center absolute top-1 right-1">
                    <i className="fa-solid fa-paper-plane"></i>
                </div>
            </div>
        </section>
    )
}

export default Chat
