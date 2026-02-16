import { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import { Info } from "../Components/Main/Main"

function User({ name, email, image, sender = [], myEmail = '' }) {
    let location = useLocation()
    let locationName = location.pathname
    let [friendList, setFriendList] = useState([])
    let { getAllUser } = useContext(Info)


    // მეგობრობის გაგზავნა / წაშლა
    let senRequest = async () => {
        let res = await fetch('https://pointsell-4.onrender.com/friends_delete_or_add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
        if (res.ok) {
            getAllUser()
        }

    }

    // რექვესთებიდან წაშლა / დამატება
    let confirmOrDelete = async (type) => {
        let res = await fetch('https://pointsell-4.onrender.com/delete_or_confirm', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                type: type
            })
        })
    }

    useEffect(() => {
        if (locationName === '/main/search_friend') {
            setFriendList(sender)
        }
    }, [sender, locationName])

    return (
        <tr className="flex w-full justify-between">
            <td className={`flex items-center gap-3 border-b border-gray-300 p-2 ${locationName == '/main/search_friend' || locationName == '/main/requests' ? ' w-2/5  max-md:items-start max-md:w-4/5' : 'w-1/2'} max-lg:gap-2`}>
                <img src={image} alt="" className="w-16 h-16 rounded-lg object-cover max-lg:w-12 max-lg:h-12" />
                <div className="w-full flex items-start flex-col gap-3 max-lg:gap-2 max-md:gap-1">
                    <h1 className="font-bold text-md wrap-break-word whitespace-normal max-lg:text-[14px]">{name}</h1>
                    <h1 className="wrap-break-word whitespace-normal w-full max-lg:text-[14px] md:hidden font-semibold text-gray-400 max-[500px]:text-[12px]! max-[500px]:w-[150px]! max-[500px]:truncate">
                        {email}
                    </h1>
                </div>
            </td>
            <td className={` border-b font-bold text-md p-2 border-gray-300 border- px-4 py-2 w-1/2 flex items-center max-md:hidden ${locationName == '/main/search_friend' ? 'w-2/5 max-md:hidden' : 'w-1/2'}`}>
                <h1 className="wrap-break-word whitespace-normal w-full max-lg:text-[14px]">
                    {email}
                </h1>
            </td>
            <td className={`${locationName === '/main/search_friend' ? 'flex items-center gap-3 border-b border-gray-300 p-2 w-1/5 text-[#f67f20] font-bold ' : 'hidden'}`}>
                {
                    !friendList?.includes(myEmail) ?
                        <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] max-lg:text-[14px] max-lg:px-2 max-lg:py-1 hover:text-white cursor-pointer flex items-center gap-4 rounded" onClick={senRequest}>
                            <i className="fa-solid fa-user-plus"></i>
                            <span className="max-lg:hidden">
                                Add Friend
                            </span>
                        </button> :
                        <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer flex items-center gap-4 rounded" onClick={senRequest}>
                            <i className="fa-solid fa-user-minus"></i>
                            <span className="max-lg:hidden">
                                Remove Friend
                            </span>
                        </button>
                }

            </td>
            <td className={`${locationName === '/main/requests' ? 'flex items-center gap-3 border-b border-gray-300  p-2 w-1/5 pr-2  font-bold max-[500px]:gap-1' : 'hidden'}`} >
                <button className="bg-[#f67f20] max-h-9 max-w-9 max-[500px]:min-w-7! max-[500px]:min-h-7!  w-full h-full flex items-center justify-center rounded-[50%] text-white duration-200 hover:bg-orange-400 cursor-pointer" onClick={() => {
                    confirmOrDelete('delete')
                }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <button className="bg-[#f67f20] max-h-9 max-w-9 max-[500px]:min-w-7! max-[500px]:min-h-7!  w-full h-full flex items-center justify-center rounded-[50%] text-white duration-200 hover:bg-orange-400 cursor-pointer" onClick={() => {
                    confirmOrDelete('add')
                }}>
                    <i className="fa-solid fa-check"></i>
                </button>
            </td>
        </tr >
    )
}

export default User
