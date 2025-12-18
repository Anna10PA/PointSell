import { useEffect, useState } from 'react'

function PostCard({ info, sendInfo }) {
    const [client, setClient] = useState([])
    const [curentUser, setCurentUser] = useState([])

    const curentTime = new Date()

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


    return (
        <div className='rounded-2xl border-gray-300 border px-5 py-4 flex flex-col items-start gap-4 max-w-[600px] max-lg:max-w-full'>
            <div className='flex items-center gap-5 justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <img src={client.profileUrl} alt={client.profileUrl} className='w-12.5 h-12.5 object-cover rounded-[50%]' />
                    <div className='leading-4.5'>
                        <h1 className='font-bold'>{client.name !== null ? client.name : client.email.split('@')[0]}</h1>
                        <p className='text-sm text-gray-600 font-bold '>
                            {client.position}
                        </p>
                    </div>
                </div>
                <i className={` ${curentUser.position === "Manager" ? 'fa-solid fa-ellipsis-vertical ' : 'hidden'} text-2xl cursor-pointer`}></i>
            </div>
            <div>
                <h1 className={`font-medium ${info.post ? 'line-clamp-1' : ''}`}>
                    {info.title}
                </h1>
            </div>
            {info.post ?
                <div className='w-full rounded overflow-hidden max-h-[380px] h-full' onClick={()=>{sendInfo(info)}}>
                    <img src={info.post} alt="" className='duration-200 hover:scale-[1.05] h-full w-full object-cover' />
                </div>
                : <div className='h-full'></div>
            }
            <div className='flex items-center justify-between w-full text-gray-600 text-2xl px-3 mt-1'>
                <i className={`fa-regular fa-heart cursor-pointer`}></i>
                <i className="fa-regular fa-comment cursor-pointer" onClick={()=>{sendInfo(info)}}></i>
                <h1 className='text-lg font-medium cursor-pointer'>
                    {info.date === `${curentTime.getFullYear()}-${curentTime.getMonth() + 1}-${curentTime.getDate()}` ? 
                        `${info.time.split(':')[0]}:${info.time.split(':')[1]}` : 
                    curentTime.getFullYear() == info.date.split('-')[2] ? 
                        `${String(new Date(info.date)).split(' ')[2]} ${String(new Date(info.date)).split(' ')[1]}` :  
                    `${String(new Date(info.date)).split(' ')[2]} ${String(new Date(info.date)).split(' ')[1]} ${String(new Date(info.date)).split(' ')[3]} `}
                </h1>

            </div>
        </div>
    )
}

export default PostCard
