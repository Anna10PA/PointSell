import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import NotificationCard from "../../MiniComponents/NotificationCard"

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
    console.log(messages)

    return (
        <>
            <nav className='border-r border-[#ececec] w-min flex items-center flex-col h-screen justify-start text-[#BBBBBB] gap-5'>
                <div className='w-full border-b border-[#ececec]  object-cover flex items-center justify-center'>
                    <img src="/icon.png" alt="icon" className='w-[90%] m-3.5' />
                </div>
                <div className="flex items-center flex-col h-[80%] justify-between text-[28px] px-8 max-md:px-4 max-md:text-2xl">
                    <Link to='/home'>
                        <i className="fa-solid fa-house hover:text-[#F67F20] duration-100"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-bars-staggered hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-book hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-burger hover:text-[#F67F20]"></i>
                    </Link>
                    <Link to='/notification'>
                        <i className="fa-solid fa-bell hover:text-[#F67F20] text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-user hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-paper-plane hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-gear hover:text-[#F67F20]"></i>
                    </Link>
                </div>
            </nav>
            <main className="w-full px-6 h-full">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]  py-8">
                    <h1 className="text-3xl font-bold">Notification</h1>
                    <h3 className="text-lg text-[#F67F20] font-semibold cursor-pointer">Mark All As Read</h3>
                </header>
                <section className="border-gray-300 rounded-2xl border h-full overflow-hidden" >
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
