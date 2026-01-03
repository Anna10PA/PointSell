import { useEffect, useState, useContext } from 'react'
import { Info } from '../Main'

function PostCard({ info, sendInfo }) {
    const [likesCount, setLikesCount] = useState(info.like ? info.like.length : 0)
    const [isLiked, setIsLiked] = useState(false)
    const [View, setView] = useState(info.view ? info.view.length : 0)
    const curentTime = new Date()

    const { managerInfo, curentUser } = useContext(Info)


    useEffect(() => {
        if (curentUser) {
            if (info.like && curentUser.email) {
                setIsLiked(info.like.includes(curentUser.email))
            }
        }
    }, [curentUser])


    // ნახვები
    const view = async () => {
        if (!curentUser) return
        try {
            const result = await fetch('http://127.0.0.1:5000/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: info.id,
                    email: curentUser.email,
                }),
            })
            let data = await result.json()
            if (result.ok) {
                setView(data.view)
            }
        } catch (error) {
            console.error(error)
        }
    }


    // ლაიქები
    const Like = async () => {
        if (!curentUser) return

        try {
            const result = await fetch('http://127.0.0.1:5000/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: info.id,
                    email: curentUser.email,
                }),
                credentials: 'include'
            })

            let data = await result.json()

            if (result.ok) {
                setLikesCount(data.likes_count)
                setIsLiked(!data.status)
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div className='rounded-2xl border-gray-300 border px-5 py-4 flex flex-col justify-between items-start gap-4 max-w-[600px] max-lg:max-w-full pb-5'>
            <div className='flex items-center gap-5 justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <img src={managerInfo?.profileUrl} alt={managerInfo?.profileUrl} className='w-12.5 h-12.5 object-cover rounded-[50%]' />
                    <div className='leading-4.5'>
                        <h1 className='font-bold'>{managerInfo?.name !== null ? managerInfo?.name : managerInfo?.email.split('@')[0]}</h1>
                        <p className='text-sm text-gray-600 font-bold '>
                            {managerInfo?.position}
                        </p>
                    </div>
                </div>
                <i className={` ${curentUser?.position === "Manager" ? 'fa-solid fa-ellipsis-vertical ' : 'hidden'} text-2xl cursor-pointer`} onClick={() => {
                    sendInfo("delete")
                }}></i>
            </div>
            <div className='h-full w-full flex flex-col items-start gap-5'>
                <div>
                    <h1 className={`font-medium ${info.post ? 'line-clamp-1' : ''}`}>
                        {info.title}
                    </h1>
                </div>
                {info.post ?
                    <div className='w-full rounded overflow-hidden max-h-[380px] h-full' onClick={() => {
                        sendInfo("view")
                        view()
                    }}>
                        <img src={info.post} alt="" className='duration-200 hover:scale-[1.05] h-full w-full object-cover' />
                    </div>
                    : <div className='h-full'></div>
                }
            </div>
            <div className='flex items-center justify-between w-full text-gray-600 text-[27px] px-3 mt-1'>
                <i className={
                    `fa-heart cursor-pointer ${isLiked ? 'text-red-600 fa-solid' : 'text-gray-600 fa-regular'}
                    active:scale-[0.8] duration-100`}
                    onClick={Like}></i>
                <i className="fa-regular fa-comment cursor-pointer" onClick={() => {
                    sendInfo("view")
                    view()
                }}></i>
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
