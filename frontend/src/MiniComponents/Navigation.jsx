import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function Navigation() {
    let location = useLocation()
    let locationName = location.pathname
    let currentMonth = new Date().getMonth()

    let [curentUser, setCurentUser] = useState('')

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


    return (
        <nav className='border-r border-[#ececec] w-min flex items-center flex-col h-screen justify-start text-[#BBBBBB] gap-5 relative'>
            <div className='w-full border-b border-[#ececec]  object-cover flex items-center justify-center'>
                <img src={currentMonth === 11 ? "/icon_2.jpg" : 'icon.png'} alt="icon" className='w-[80%] m-1' />
            </div>
            <div className="flex items-center flex-col h-[80%] justify-between text-[30px] px-8 max-md:px-4 max-md:text-2xl">
                <Link to='/home'>
                    <i className={`fa-solid fa-house hover:text-[#F67F20] duration-100 ${locationName === '/home' || locationName === '/order_type' || locationName === '/order/deliver' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/posts'>
                    <i className={`fa-solid fa-clone hover:text-[#F67F20] ${locationName === '/posts' || locationName === '/add_post' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/orders'>
                    <i className={`fa-solid fa-book hover:text-[#F67F20] ${locationName === '/orders' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                {
                    curentUser.position === "Manager" ?
                        <Link to='/products'>
                            <i className={`fa-solid fa-burger hover:text-[#F67F20] ${locationName === '/products' || locationName === '/add_product' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                        </Link>
                    : null
                }
                <Link to='/notification'>
                    <i className={`fa-solid fa-bell hover:text-[#F67F20] ${locationName === '/notification' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                {
                    curentUser.position === "Manager" ?
                        <Link to='/costumers'>
                            <i className={`fa-solid fa-user hover:text-[#F67F20] ${locationName === '/costumers' ? 'text-[#F67F20]' : 'text-[#BBBBBB]'}`}></i>
                        </Link>
                        : null
                }
                <Link to='/messages'>
                    <i className={`fa-solid fa-paper-plane hover:text-[#F67F20] ${locationName === '/messages' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/settings'>
                    <i className={`fa-solid fa-gear hover:text-[#F67F20] ${locationName === '/settings' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
            </div>
        </nav>
    )
}

export default Navigation
