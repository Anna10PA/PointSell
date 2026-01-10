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
                <img src={currentMonth === 11 ? "/icon_2.jpg" : '/icon.png'} alt="icon" className='w-[80%] m-1' />
            </div>
            <div className="flex items-center flex-col h-[80%] justify-between text-[30px] px-8 max-md:px-4 max-md:text-2xl">
                <Link to='/main/home'>
                    <i className={`fa-solid fa-house hover:text-[#F67F20] duration-100 ${locationName === '/main/home' || locationName === '/main/order' || locationName === '/main/order/deliver' || locationName === '/main/order/table/payment' ||  locationName === '/main/order/table' || locationName === '/main/order/deliver/payment' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/main/posts'>
                    <i className={`fa-solid fa-clone hover:text-[#F67F20] ${locationName === '/main/posts' || locationName === '/main/add_post' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/main/orders'>
                    <i className={`fa-solid fa-book hover:text-[#F67F20] ${locationName === '/main/orders' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                {
                    curentUser.position === "Manager" ?
                        <Link to='/main/products'>
                            <i className={`fa-solid fa-burger hover:text-[#F67F20] ${locationName === '/main/products' || locationName === '/main/add_product' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                        </Link>
                    : null
                }
                <Link to='/main/notification'>
                    <i className={`fa-solid fa-bell hover:text-[#F67F20] ${locationName === '/main/notification' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                {
                    curentUser.position === "Manager" ?
                        <Link to='/main/costumers'>
                            <i className={`fa-solid fa-user hover:text-[#F67F20] ${locationName === '/main/costumers' ? 'text-[#F67F20]' : 'text-[#BBBBBB]'}`}></i>
                        </Link>
                        : null
                }
                <Link to='/main/messages'>
                    <i className={`fa-solid fa-paper-plane hover:text-[#F67F20] ${locationName === '/main/messages' || locationName ===  '/main/search_friend' || locationName == '/main/requests'  ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
                <Link to='/main/setting'>
                    <i className={`fa-solid fa-gear hover:text-[#F67F20] ${locationName === '/main/setting' || locationName === '/main/setting/employers_information' || locationName === '/main/setting/password' || locationName === '/main/setting/password/verify' || locationName === '/main/setting/password/verify/reset_password' ? ' text-[#F67F20] ' : 'text-[#BBBBBB]'}`}></i>
                </Link>
            </div>
        </nav>
    )
}
// /main/setting/password/verify/reset_password
export default Navigation
