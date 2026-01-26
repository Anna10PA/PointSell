import { useEffect, useState, useRef, useContext, useCallback } from "react"
import MessageCard from "./MessageCard"
import { useForm } from "react-hook-form"
import { Info } from "../Main"

function Chat({ user, set2UserInfo }) {
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


    // მესიჯების ავტომატური განახლება
    const readMessage = useCallback(async () => {
        if (!user?.email) return

        try {
            let res = await fetch('https://pointsell-4.onrender.com/read_user_messages', {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email })
            })

            if (res.ok) {
                let data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error("Fetch error:", error)
        }
    }, [user?.email])

    useEffect(() => {
        readMessage()

        let interval = setInterval(() => {
            readMessage()
        }, 3000)

        return () => clearInterval(interval)
    }, [user?.email, readMessage])


    return (
        <section className={`w-[47%] h-[73vh] ${user?.email ? 'max-lg:w-full max-lg:px-10 max-sm:px-3' : 'hidden -z-20'}`}>
            <header className="w-full flex items-center justify-between py-5 border-b border-gray-300">
                <div className="flex items-center gap-3 max-sm:gap-2">
                    <div className="lg:hidden">
                        <i className="fa-solid fa-chevron-left text-2xl cursor-pointer duration-100 hover:text-[#f67f20] max-sm:text-[20px]" onClick={()=> {
                            set2UserInfo(null)
                        }}></i>
                    </div>
                    <div className="w-14 h-14 relative max-sm:h-12 max-sm:w-12">
                        <img src={user?.profileUrl} alt="" className="w-14 object-cover h-14 max-sm:w-12 max-sm:h-12 rounded-[50%]" />
                        <div className={`${user?.active ? 'bg-[#007400]' : 'bg-gray-400'} w-5 h-5 rounded-[50%] absolute bottom-0 right-0 border-2 max-sm:w-4 max-sm:h-4 border-white`}></div>
                    </div>
                    <div className="leading-5 max-sm:leading-1 min-w-0">
                        <h1 className="font-bold text-xl max-sm:text-lg truncate max-[430px]:max-w-[130px]! max-[430px]:text-sm">{user?.name}</h1>
                        <p className="text-md text-gray-400 font-semibold max-sm:text-sm">{user?.position}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[50%] bg-[#039803] flex items-center justify-center text-white max-sm:w-8 max-sm:h-8 max-sm:text-[12px]">
                        <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="w-10 h-10 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white max-sm:w-8 max-sm:h-8 max-sm:text-[12px]">
                        <i className="fa-solid fa-video"></i>
                    </div>
                </div>
            </header>
            <section className="h-[72vh] overflow-y-auto py-5 w-full flex flex-col gap-3 max-sm:h-[78vh]" ref={chat}>
                {
                    message.length > 0 ? message?.map((item, index) => {
                        return <MessageCard
                            key={index}
                            sender={item.sender}
                            message={item.message}
                            time={item.date}
                            image={user?.profileUrl}
                            active={user?.active}
                            delete_message={delete_message}
                        />
                    }) :
                        <div className="w-full h-full flex items-center justify-center">
                            <video autoPlay muted loop className="w-[50%]">
                                <source src='/dog_3.mp4' type="video/mp4" />
                            </video>
                        </div>
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
