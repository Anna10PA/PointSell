import { useState, useContext, useEffect } from "react"
import MessageNotification from "./MessageNotification"
import { useNavigate } from "react-router-dom"
import Chat from "./Chat"
import { Info } from "../Main"

function Messages() {
    let [user2Info, set2UserInfo] = useState(null)
    let [user2Email, set2Email] = useState(null)
    let { curentUser, allUser, friend } = useContext(Info)
    let navigate = useNavigate()

    useEffect(() => {
        set2UserInfo(allUser?.find((u) => u?.email == user2Email))
    }, [user2Email])


    return (
        <main className="w-full flex items-start gap-5">
            <section className={`w-[48%] h-[95vh] flex flex-col px-10 py-5 gap-5 max-lg:w-full max-sm:px-3 max-sm:py-2 max-sm:gap-0 ${user2Email ? 'max-lg:hidden max-lg:-z-20' : 'z-20'}`}>
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] ">
                    <h1 className="text-3xl font-bold max-sm:text-[25px]">Messsages</h1>
                    <div className="flex items-center gap-5">
                        <button className="px-5 py-3 rounded text-[#f67f20] bg-white hover:text-white hover:bg-[#f67f20] font-bold cursor-pointer duration-200 max-sm:px-2" onClick={() => {
                            navigate('/main/search_friend')
                        }}>
                            <i className="fa-solid fa-user-plus"></i>
                        </button>
                        <button className="px-5 py-3 rounded text-[#f67f20] bg-white hover:text-white hover:bg-[#f67f20] font-bold cursor-pointer duration-200 max-sm:px-2" onClick={() => {
                            navigate('/main/requests')
                        }}><i className="fa-solid fa-user-group"></i></button>
                    </div>
                </header>
                <section className='border relative border-gray-300 rounded-xl h-full'>
                    <h2 className='font-bold text-gray-400 tracking-[0.5px] sticky top-0 right-0 bg-white px-5 py-4 pb-2 max-sm:px-3 max-sm:py-3'>Personal</h2>
                    <div className='w-full px-5 py-4 pt-0 overflow-auto max-sm:px-2 max-sm:py-0'>
                        {
                            friend?.map((item, index) => {
                                return <MessageNotification
                                    user={set2Email}
                                    image={item.profileUrl}
                                    name={item.name || item.email.split('@')[0]}
                                    email={item.email}
                                    myEmail={curentUser?.email}
                                    active={item.active}
                                    key={index}
                                />
                            })
                        }
                    </div>
                </section>
            </section>
            {
                user2Email ?
                    <Chat user={user2Info} set2UserInfo={set2Email} /> :
                    <section className="h-[80vh] w-[48%] flex items-center text-xl justify-center text-gray-400 max-lg:hidden">
                        <h1>No Chat History Available</h1>
                    </section>
            }
        </main>
    )
}

export default Messages
