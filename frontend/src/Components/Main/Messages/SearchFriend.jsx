import { useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useContext, useState, useEffect } from "react"
import { Info } from "../Main"
import User from "../../../MiniComponents/User"

function SearchFriend() {
    let navigate = useNavigate()

    let location = useLocation()
    let location_name = location.pathname

    let { register, watch } = useForm()
    let { allUser, curentUser, getAllUser } = useContext(Info)
    let [foundUsers, setFoundUsers] = useState([])

    let searchEmail = watch('search')

    useEffect(() => {
        if (location_name === '/main/requests') {
            if (searchEmail && searchEmail.trim() !== '') {
                let requests = allUser.filter(user =>
                    curentUser.friend_request.includes(user.email)
                )
                setFoundUsers(requests)
            } else {
                setFoundUsers([])
            }
        } else {
            if (curentUser?.friend_request.length > 0) {
                let found = allUser?.filter(item => item?.email?.toLowerCase().includes(searchEmail?.toLowerCase()) && curentUser?.email !== item.email)
                setFoundUsers(found)
            } else {
                setFoundUsers([])
            }
        }
    }, [searchEmail, allUser, curentUser, location_name])

    useEffect(() => {
        getAllUser()

        let interval = setInterval(() => {
            getAllUser()
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <main className="w-full flex items-start gap-5">
            <section className="w-full h-[95vh] flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] ">
                    <h1 className="text-3xl font-bold">{location_name === '/main/requests' ? 'Requests' : 'Search Friend'}</h1>
                    <div className={`w-[40%] max-[500px] min-[100px] relative ${location_name === '/main/requests' ? 'hidden' : 'w-[40%] max-[500px] min-[100px] relative'}`}>
                        <input type="text" className='w-full h-full outline-[#f67f20] border border-gray-400 rounded-4xl px-5 py-2.5' placeholder='Search friend . . .' {...register('search')} />
                        <i className="fa-solid fa-magnifying-glass absolute right-5 top-1.5 text-[#bbb] h-7 flex items-center justify-center bg-white pl-3 pt-2"></i>
                    </div>
                    <div className='w-12 h-12 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white cursor-pointer duration-100 hover:bg-orange-400' onClick={() => {
                        navigate('/main/messages')
                    }}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </div>
                </header>
                <section className="w-full h-full">


                    {foundUsers?.length > 0 ? (
                        <table className="w-full">
                            <tbody>
                                {foundUsers?.map((item, index) => (
                                    <User
                                        key={index}
                                        name={item.name}
                                        image={item.profileUrl}
                                        email={item.email}
                                        myEmail={curentUser?.email}
                                        sender={[...item.friends, ...item.friend_request]}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) :
                        (<div className="w-full h-full flex items-center justify-center flex-col gap-3">
                            <video loop autoPlay muted >
                                <source src='/find friend.mp4' type="video/mp4" />
                            </video>
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="font-bold text-3xl">{location_name !== '/main/requests' ? "Find a Friend" : "No Request Yet"}</h1>
                                <p className="text-gray-400">{location_name !== '/main/requests' ? "Enter your friend's email and start chatting!" : 'When someone send you friend request Check!'}</p>
                            </div>
                        </div>)
                    }
                </section>

            </section>
        </main >
    )
}

export default SearchFriend
