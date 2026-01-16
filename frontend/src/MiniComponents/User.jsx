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
            alert('work')
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
        if (res.ok) {
            alert('WORK')
        }
    }

    useEffect(() => {
        if (locationName === '/main/search_friend') {
            setFriendList(sender)
        }
    }, [sender, locationName])

    return (
        <tr className="flex w-full justify-between">
            <td className={`flex items-center gap-3 border-b border-gray-300 p-2 ${locationName == '/main/search_friend'  ? ' w-2/5' : 'w-1/2'} `}>
                <img src={image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <h1 className="font-bold text-md wrap-break-word whitespace-normal">{name}</h1>
            </td>
            <td className={` border-b font-bold text-md  p-2 border-gray-300 border- px-4 py-2 w-1/2 flex items-center ${locationName == '/main/search_friend' ? 'w-2/5' : 'w-1/2'}`}>
                <h1 className="wrap-break-word whitespace-normal w-full">
                    {email}
                </h1>
            </td>
            <td className={`${locationName === '/main/search_friend' ? 'flex items-center gap-3 border-b border-gray-300  p-2 w-1/5 text-[#f67f20] font-bold ' : 'hidden'}`}>
                {
                    !friendList?.includes(myEmail) ?
                        <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer flex items-center gap-4 rounded" onClick={senRequest}>
                            <i className="fa-solid fa-user-plus"></i>
                            Add Friend
                        </button> :
                        <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer flex items-center gap-4 rounded" onClick={senRequest}>
                            <i className="fa-solid fa-user-minus"></i>
                            Remove Friend
                        </button>
                }

            </td>
            <td className={`${locationName === '/main/requests' ? 'flex items-center gap-3 border-b border-gray-300  p-2 w-1/5  font-bold ' : 'hidden'}`} >
                <button className="bg-[#f67f20] h-9 w-9 flex items-center justify-center rounded-[50%] text-white duration-200 hover:bg-orange-400 cursor-pointer" onClick={() => {
                    confirmOrDelete('delete')
                }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <button className="bg-[#f67f20] h-9 w-9 flex items-center justify-center rounded-[50%] text-white duration-200 hover:bg-orange-400 cursor-pointer" onClick={() => {
                    confirmOrDelete('add')
                }}>
                    <i className="fa-solid fa-check"></i>
                </button>
            </td>
        </tr >
    )
}

export default User
