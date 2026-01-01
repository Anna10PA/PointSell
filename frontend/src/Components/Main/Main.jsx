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

import Notification from './Notification/Notification.jsx'
import Navigation from "../../MiniComponents/Navigation"
import Costumers from "./Costumers/Costumers"
import Order from "./OrderPage/Order"

export let Info = createContext()

function Main() {
    const [isLoading, setIsLoading] = useState(true)

    let [curentUser, setCurentUser] = useState(null)
    let [allProduct, setAllProduct] = useState(null)
    let [allPost, setAllPost] = useState(null)
    let [allUser, setAllUser] = useState(null)
    let [managerInfo, setManagerInfo] = useState(null)
    let [viewRes, setView] = useState(null)
    let [likesCount, setLikesCount] = useState(null)


    // ამჟამინდელი მომხმარებლის ინფორმაცია
    let getCurentUser = async () => {
        let result = await fetch('http://localhost:5000/get_current_user', {
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
        let result = await fetch('http://localhost:5000/product20list', {
            method: 'GET',
            credentials: 'include'
        })
        let final = await result.json()
        if (result.ok) {
            setAllProduct(final)
        }
        await getCurentUser()
    }


    // ყველა პოსტი
    async function getAllPost() {
        try {
            const result = await fetch('http://localhost:5000/check_posts', {
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
            const result = await fetch('http://localhost:5000/get_all_user', {
                credentials: 'include',
                method: 'GET'
            })

            if (result.ok) setAllUser(await result.json())

        } catch (e) {
            console.error(e)
        }
    }


    // ჩემი / მენეჯერის ინფორმაცია
    async function getManagerInfo() {
        try {
            const result = await fetch('http://localhost:5000/menegers_info', {
                credentials: 'include',
                method: 'GET'
            })

            if (result.ok) setManagerInfo(await result.json())

        } catch (e) {
            console.error(e)
        }
    }


    useEffect(() => {
        async function loadAllFunc() {
            setIsLoading(true)
            await getCurentUser()

            await Promise.all([
                getAllProduct(),
                getAllPost(),
                getAllUser(),
                getManagerInfo()
            ])
            setIsLoading(false)
        }
        loadAllFunc()
    }, [])

    return (
        <div className="w-full flex items-start">
            <Info.Provider value={{ curentUser, getCurentUser, allProduct, getAllProduct, allPost, allUser, managerInfo }}>
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
                    <Route path='/order/deliver/payment' element={<PaymentResult />} />
                    <Route path='/orders' element={<Order />} />
                </Routes>
            </Info.Provider>
        </div >
    )
}

export default Main
