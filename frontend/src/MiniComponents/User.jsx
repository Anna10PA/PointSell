import { useLocation } from "react-router-dom"

function User({ name, email, image, addFriend, sender=[] }) {
    let location = useLocation()
    let locationName = location.pathname
    
    return (
        <tr className="flex w-full justify-between">
            <td className={`flex items-center gap-3 border-b border-gray-300 p-2 ${locationName == '/main/search_friend' ? ' w-2/5' : 'w-1/2'} `}>
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
                    !sender.includes(email) ? <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer flex items-center gap-4 rounded">
                        <i className="fa-solid fa-user-plus"></i>
                        Add Friend
                    </button> :
                        <button className="px-5 py-3 duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer flex items-center gap-4 rounded">
                            <i className="fa-solid fa-user-minus"></i>
                            Remove Friend
                        </button>
                }

            </td>
        </tr>
    )
}

export default User
