import { useEffect, useState, useRef } from "react"
import MessageCard from "./MessageCard"
import { useForm } from "react-hook-form"

function Chat({ user }) {
    let [message, setMessages] = useState([])
    let { register, handleSubmit, watch, reset } = useForm()
    let value = watch('message')
    let chat = useRef(null)

    // მესიჯების წამოღება
    useEffect(() => {
        let readMessages = async () => {
            let res = await fetch('https://pointsell-4.onrender.com/read_user_messages', {
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


    // მესიჯების დამატება
    async function sendNewMessage(data) {
        let res = await fetch('https://pointsell-4.onrender.com/send_new_message', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: data?.message,
                email: user?.email
            })
        })
        if (res.ok) {
            let createdMessage = await res.json()
            setMessages(prev => [...prev, createdMessage])
            reset()
        }
    }


    // მესიჯების წაშლა
    let delete_message = async (msg, time) => {
        let res = await fetch('https://pointsell-4.onrender.com/delete_message', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user?.email,
                message: msg,
                date: time
            })
        })
        if (res.ok) {
            setMessages(prev => prev.filter(messg => !(messg.date === time && messg.message === msg)))
        } else {
            alert('ver waishala')
        }
    }


    // ავტომატური ჩასქროლვა
    useEffect(() => {
        chat.current.scrollTop = chat.current.scrollHeight
    }, [message])

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
            <section className="h-[72vh] overflow-y-auto py-5 w-full flex flex-col gap-3 " ref={chat}>
                {
                    message.length > 0 ? message?.map((item, index) => {
                        return <MessageCard
                            key={index}
                            sender={item.sender}
                            message={item.message}
                            time={item.date}
                            image={user?.profileUrl}
                            delete_message={delete_message}
                        />
                    }) :
                        <video autoPlay muted loop>
                            <source src='/dog_3.mp4' type="video/mp4" />
                        </video>
                }
            </section>
            <form className="w-full relative" onSubmit={handleSubmit(sendNewMessage)}>
                <div className="w-10 h-10 hover:bg-[#f67f20] rounded-[50%] text-[#f67f20] cursor-pointer hover:text-white duration-200 flex items-center justify-center absolute top-1 left-1">
                    <i className="fa-solid fa-dice"></i>
                </div>
                <input type="text" placeholder="Write Message..." className="w-full rounded-3xl px-12 py-3 outline-[#f67f20] border border-gray-300" {...register('message')} />
                <button className="w-10 h-10 bg-[#f67f20] rounded-[50%] text-white flex items-center justify-center absolute top-1 right-1 cursor-pointer disabled:opacity-50 disabled:cursor-text" disabled={!value || value.trim() === ''}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </section>
    )
}

export default Chat
