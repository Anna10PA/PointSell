import { Route, Routes } from "react-router-dom"
import { useState, useEffect, createContext } from "react"

import Home from "./Home/Home"
import OrderType from "./Home/OrderType"
import Table from './Home/Table.jsx'
import Deliver from "./Home/Deliver"
import PaymentResult from "./Home/PaymentResult"

import AddProductPage from "./AllProduct/AddProductPage"
import AllProduct from "./AllProduct/AllProduct"

import Post from "./Post/Post"
import AddPost from "./Post/AddPost"

import Messages from "./Messages/Messages.jsx"
import SearchFriend from "./Messages/SearchFriend.jsx"

import Notification from './Notification/Notification.jsx'
import Navigation from "../../MiniComponents/Navigation"

import Order from "./OrderPage/Order"
import Costumers from "./Costumers/Costumers"
import Setting from "./Settings/Setting.jsx"


export let Info = createContext()

function Main() {
    const [_, setIsLoading] = useState(true)

    let [curentUser, setCurentUser] = useState(null)
    let [allProduct, setAllProduct] = useState(null)
    let [allPost, setAllPost] = useState(null)
    let [allUser, setAllUser] = useState(null)
    let [managerInfo, setManagerInfo] = useState(null)
    let [friend, setFriends] = useState([])


    // ამჟამინდელი მომხმარებლის ინფორმაცია
    async function getCurentUser() {
        let result = await fetch('https://pointsell-4.onrender.com/get_current_user', {
            method: 'GET',
            credentials: 'include'
        })
        let final = await result.json()
        if (result.ok) {
            setCurentUser(final)
        }
    }


    // ყველა პროდუქტის ინფორმაციის წამოღება
    async function getAllProduct() {
        let result = await fetch('https://pointsell-4.onrender.com/product20list', {
            method: 'GET',
            credentials: 'include'
        })
        let final = await result.json()
        if (result.ok) {
            setAllProduct(final)
        }
    }


    // ყველა პოსტი
    async function getAllPost() {
        try {
            const result = await fetch('https://pointsell-4.onrender.com/check_posts', {
                method: 'GET',
                credentials: 'include'
            })

            if (result.ok) setAllPost(await result.json())

        } catch (e) {
            console.error(e)
        }
    }


    // ყველა მომხმარებლის ინფორმაცია
    async function getAllUser() {
        try {
            const result = await fetch('https://pointsell-4.onrender.com/get_all_user', {
                credentials: 'include',
                method: 'GET'
            })

            if (result.ok) {
                let data = await result.json()
                setAllUser(data)

                if (curentUser) {
                    let newMe = data.find(user => user.email === curentUser.email)
                    if (newMe) {
                        setCurentUser(newMe)
                    }
                }
            }

        } catch (e) {
            console.error(e)
        }
    }


    // ჩემი / მენეჯერის ინფორმაცია
    async function getManagerInfo() {
        try {
            const result = await fetch('https://pointsell-4.onrender.com/managers_info', {
                credentials: 'include',
                method: 'GET'
            })

            if (result.ok) setManagerInfo(await result.json())

        } catch (e) {
            console.error(e)
        }
    }


    // შეტყობინების წაკითხვა
    async function postReadNotification(readType) {
        let url = readType == '1' ? 'last_notification' : 'all_notification'
        if (!curentUser) return

        try {
            let result = await fetch(`https://pointsell-4.onrender.com/${url}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curentUser)
            })

            if (result.ok) {
                await getCurentUser()
            }
        } catch (e) {
            console.error(e)
        }
    }


    // მომხმარების დაბლოკვა
    async function blockUser(email) {
        if (!email) return

        let res = await fetch('https://pointsell-4.onrender.com/block_user', {
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
            setAllUser(prevUsers => {
                return prevUsers.map(user => {
                    if (user.email === email) {
                        return { ...user, block: !user.block }
                    }
                    return user
                })
            })
        } else {
            const errorData = await res.json()
            console.error("Error blocking user:", errorData.error)

        }
    }


    // პაროლის აღდგენა
    async function resetPassword(email, password) {
        let res = await fetch('https://pointsell-4.onrender.com/change_password', {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        let result = await res.json()
        if (res.ok) {
            alert(result.message)
        } else {
            alert(result.error)
        }
    }


    // ჩატვირთვა
    useEffect(() => {
        async function loadAllFunc() {
            setIsLoading(true)
            await getCurentUser()

            await Promise.all([
                getAllProduct(),
                getAllPost(),
                getAllUser(),
                getManagerInfo(),
            ])
            setIsLoading(false)
        }
        loadAllFunc()
    }, [])


    // მეგობრების ინფორმაცია
    useEffect(() => {
        if (curentUser?.friends && allUser?.length > 0) {
            let foundFriends = allUser.filter(user =>
                curentUser.friends.map(e => e.toLowerCase()).includes(user?.email?.toLowerCase())
            )
            setFriends(foundFriends)
        }
    }, [curentUser, allUser])


    return (
        <div className="w-full flex items-start">
            <Info.Provider value={{ curentUser, getCurentUser, allProduct, getAllProduct, allPost, allUser, managerInfo, postReadNotification, blockUser, resetPassword, friend, getAllUser }}>
                <Navigation />
                <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path="/notification" element={<Notification />} />
                    <Route path="/products" element={<AllProduct />} />
                    <Route path="/posts" element={<Post />} />
                    <Route path='/add_post' element={<AddPost />} />
                    <Route path='/order' element={<OrderType />} />
                    <Route path='/order/deliver' element={<Deliver />} />
                    <Route path='/order/table' element={< Table />} />
                    <Route path="/add_product" element={<AddProductPage />} />
                    <Route path="/costumers" element={<Costumers />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/search_friend" element={<SearchFriend />} />
                    <Route path="/requests" element={<SearchFriend />} />
                    <Route path='/order/deliver/payment' element={<PaymentResult />} />
                    <Route path='/order/table/payment' element={<PaymentResult />} />
                    <Route path='/orders' element={<Order />} />
                    <Route path='/setting/*' element={<Setting />} />
                </Routes>
            </Info.Provider>
        </div >
    )
}

export default Main
