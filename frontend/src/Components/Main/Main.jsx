import { Route, Routes, useNavigate } from "react-router-dom"
import { useState, useEffect, createContext, useCallback, useMemo } from "react"
import { io } from "socket.io-client"

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
import Calling from "./Messages/Calling.jsx"
import Permision from "./Messages/Permision.jsx"

import Work from "./Work/Work.jsx"
import SendAnswer from "./Work/SendAnswer.jsx"

import Notification from './Notification/Notification.jsx'
import Navigation from "../../MiniComponents/Navigation"

import Order from "./OrderPage/Order"
import Costumers from "./Costumers/Costumers"
import Setting from "./Settings/Setting.jsx"


export let Info = createContext()

let socket = io("https://pointsell-4.onrender.com", {
    withCredentials: true,
    transports: ['websocket']
})

function Main() {
    let navigate = useNavigate()
    let [_, setIsLoading] = useState(true)

    let [curentUser, setCurentUser] = useState(null)
    let [allProduct, setAllProduct] = useState(null)
    let [allPost, setAllPost] = useState(null)
    let [allUser, setAllUser] = useState(null)
    let [managerInfo, setManagerInfo] = useState(null)
    let [friend, setFriends] = useState([])
    let [question, setQuestion] = useState(null)
    let [allAnswers, setAllAnswers] = useState([])
    let [incomingCall, setIncomingCall] = useState(null)
    let [cands, setCands] = useState([])


    let ringtone = useMemo(() => {
        const audio = new Audio("/iphone-11-pro.mp3")
        audio.loop = true
        return audio
    }, [])


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


    // ვარსკვლავების დაწერა
    async function sendStar(star, email, product) {
        try {
            let res = await fetch('https://pointsell-4.onrender.com/vote', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    star: star,
                    email: email,
                    product: product
                })
            })
            if (res.ok) {
                location.reload()
            }
        } catch (e) {
            console.error(e)
        }
    }

    // თამაში პაროლის აღსადგენად
    let Game = useCallback(async () => {

        setQuestion(null)
        setAllAnswers([])

        let mainQuestion = {
            question: "What is the capital of Georgia",
            correctAnswer: "Tbilisi",
            difficulty: 'Easy',
            category: 'Georgaphy',
            incorrectAnswers: ["Kutaisi", "Borjomi", "Batumi"]
        }

        let quest
        try {
            let res = await fetch('https://the-trivia-api.com/v2/questions')
            let data = await res.json()
            console.log(data)
            if (data && data.length > 0) {
                quest = data[0]
            } else {
                quest = mainQuestion
            }
        } catch (err) {
            console.error(err)
            quest = mainQuestion
        }

        let answers = [...quest?.incorrectAnswers, quest?.correctAnswer]
        let ress = []

        while (ress.length < answers.length) {
            let index = Math.floor(Math.random() * answers.length)
            if (!ress.includes(answers[index])) {
                ress.push(answers[index])
            }
        }
        setQuestion(quest)
        setAllAnswers(ress)
    }, [])


    // ვერიფიკაცია თამაშის შედეგად
    async function getVerification(email, isTrue) {
        try {
            let res = await fetch('https://pointsell-4.onrender.com/verification', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    isCorrect: isTrue
                })
            })
            if (!res.ok) {
                let data = await res.json()
                setCurentUser(valu => {
                    let newCount = (data.count !== undefined) ? data.count : (valu.count + 1)
                    return { ...valu, count: newCount }
                }
                )
                await Game()
                return false
            } else {
                return true
            }

        } catch (e) {
            console.error(e)
            return false
        }
    }


    // კანდიდატების ნახვა
    let candidats = async () => {
        let res = await fetch('https://pointsell-4.onrender.com/candidats', {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            let result = await res.json()
            setCands(result)
        }
    }


    // დარეკვა
    useEffect(() => {
        if (!socket) return

        const handleOffer = (data) => {
            if (data.callerData?.email === curentUser?.email) return

            setIncomingCall(data)
            ringtone.play().catch(e => console.error(e))
        }

        const handleCallEnd = () => {
            setIncomingCall(null)
            ringtone.pause()
            ringtone.currentTime = 0
        }

        socket.on('video-offer', handleOffer)
        socket.on('call-ended', handleCallEnd)

        return () => {
            socket.off('video-offer', handleOffer)
            socket.off('call-ended', handleCallEnd)
            ringtone.pause()
        }
    }, [curentUser, ringtone])


    // პასუცის გაცემა დარეკვაზე
    let answerCall = (incomingCall) => {
        ringtone.pause()
        ringtone.currentTime = 0
        navigate('/main/calling', {
            state: {
                secondUser: incomingCall.callerData,
                isCaller: false,
                incomingOffer: incomingCall.offer,
                camera: true
            }
        })
        setIncomingCall(null)
    }


    // სამუშაო მოთხოვნის პასუხი
    let answer = async (ans, email) => {
        let res = await fetch('https://pointsell-4.onrender.com/answer', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                answer: ans
            })
        })
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
            if (curentUser?.position !== "Costomer") {
                candidats()
            }
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
        <div className="w-full flex items-start h-screen">
            <Info.Provider value={{ curentUser, getCurentUser, allProduct, getAllProduct, allPost, allUser, managerInfo, postReadNotification, blockUser, resetPassword, friend, getAllUser, sendStar, allAnswers, question, Game, getVerification, cands, candidats, answer }}>
                <Navigation />
                {
                    incomingCall && (
                        <div className="w-full h-full flex items-center justify-center absolute z-90">
                            <div className="bg-black flex flex-col items-center rounded py-7 justify-center text-white p-5 text-center">
                                <div className="w-24 h-24 rounded-full border-4 border-orange-500 overflow-hidden mb-4 animate-pulse">
                                    <img src={incomingCall.callerData?.profileUrl || '/https://i.pinimg.com/736x/f2/bd/7a/f2bd7a85270d86e83238c9d727ceee89.jpg'} className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-bold">{incomingCall.callerData?.name} Calling you</h2>
                                <div className="flex gap-10 mt-12">
                                    <button onClick={() => answerCall(incomingCall)} className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-phone"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            socket.emit('end-call', { to: incomingCall.callerData?.email })
                                            setIncomingCall(null)
                                            ringtone.pause()
                                        }}
                                        className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                                    >
                                        <i className="fa-solid fa-phone-slash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                    <Route path='/calling' element={<Calling />} />
                    <Route path='/conditions' element={<Permision />} />
                    <Route path='/work' element={<Work />} />
                    <Route path='/answer' element={<SendAnswer />} />
                </Routes>
            </Info.Provider>
        </div >
    )
}

export default Main
