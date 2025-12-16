import { useEffect, useState } from 'react'

function PostCard({ info, sendInfo }) {
    const [client, setClient] = useState([])
    const [curentUser, setCurentUser] = useState([])

    useEffect(() => {
        async function getCurentUser() {
            try {
                let res = await fetch('http://localhost:5000/get_current_user', {
                    method: "GET",
                    credentials: 'include'
                })
                let result = await res.json()
                if (!res.ok) {
                    return "something went wrong"
                } else {
                    setCurentUser(result)
                }
            } catch (e) {
                console.error(e)
            }
        }
        getCurentUser()
    }, [])
    console.log(curentUser)


    useEffect(() => {
        async function getAllProduct() {
            let result = await fetch('http://localhost:5000/menegers_info', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (!result.ok) {
                console.error("Not found")
            } else {
                setClient(final)
            }
        }
        getAllProduct()
    }, [])


    console.log(client)

    return (
        <div className='rounded-2xl border-gray-300 border px-5 py-4 flex flex-col items-start gap-4' onClick={()=>{sendInfo(true)}}>
            <div className='flex items-center gap-5 justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <img src={client.profileUrl} alt={client.profileUrl} className='w-12.5 h-12.5 object-cover rounded-[50%]' />
                    <div className='leading-4.5'>
                        <h1 className='font-bold'>{client.name !== null ? client.name : client.email.split('@')[0]}</h1>
                        <p className='text-sm text-gray-600 font-bold'>
                            {client.position}
                        </p>
                    </div>
                </div>
                <i className={` ${curentUser.position === "Manager" ? 'fa-solid fa-ellipsis-vertical ' : 'hidden'} text-2xl cursor-pointer`}></i>
            </div>
            <div>
                <h1 className='font-medium'>
                    {info.title}
                </h1>
            </div>
            {info.post ?
                <div className='w-full rounded overflow-hidden max-h-[380px] h-full'>
                    <img src={info.post} alt="" className='duration-200 hover:scale-[1.05] h-full w-full object-cover' />
                </div>
                : null
            }
            <div className='flex items-center justify-between w-full text-gray-600 text-3xl px-3 mt-1'>
                <i className={`fa-regular fa-heart cursor-pointer`}></i>
                <i className="fa-regular fa-comment cursor-pointer"></i>
                <h1 className='text-lg font-medium cursor-pointer'>
                    {info.time}
                </h1>
            </div>
        </div>
    )
}

export default PostCard
