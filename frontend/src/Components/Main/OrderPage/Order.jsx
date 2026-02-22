import FoodCard from "./FoodCard"
import OrderCard from "./OrderCard"
import { useState, useEffect, useContext } from "react"
import { Info } from "../Main"

function Order() {
    let [orders, setOrders] = useState([])
    let [curentOrd, setCurentOrd] = useState(null)
    let [chosenOrd, setChosenOrd] = useState(null)
    let { allProduct, curentUser, cooking, startCooking, finishCooking } = useContext(Info)
    let [time, setTime] = useState(0)
    let [start_tm, setStart] = useState(false)

    // შეკვეთების წამოღება
    useEffect(() => {
        let getOrders = async () => {
            try {
                let res = await fetch('https://pointsell-4.onrender.com/orders', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (res.ok) {
                    let result = await res.json()
                    setOrders(result.filter((item) => !item.isReady))
                }
            } catch (e) {
                console.error(e)
            }
        }
        getOrders()
    }, [])


    // ღილაკით არჩეული შეკვეთა
    let curentOrder = (e) => {
        setCurentOrd(e)
    }


    // დასრულება
    let finish = async () => {
        if (!chosenOrd) return
        await finishCooking(chosenOrd.order)
        setOrders(prevOrders => prevOrders.filter(ord => ord.order !== chosenOrd.order))
        setCurentOrd(null)
        setChosenOrd(null)
    }


    // არჩეული შეკვეთის ინფორმაცია
    useEffect(() => {
        if (!curentOrd || orders.length === 0) return
        let found = orders.find((e) => e.order === curentOrd)
        setChosenOrd(found)
    }, [curentOrd, orders])


    // დროის ფორმატირება
    let formatTime = (totalSeconds) => {
        if (totalSeconds <= 0) return "00:00"
        let mins = Math.floor(totalSeconds / 60)
        let secs = Math.floor(totalSeconds % 60)
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
    }


    // ლოკალური განახლება
    useEffect(() => {
        let interval

        if (chosenOrd?.start && chosenOrd?.start_at) {
            let runTimer = () => {
                let now = Date.now() / 1000
                let secondsPassed = now - chosenOrd.start_at
                let remaining = chosenOrd.ready_time - secondsPassed

                if (remaining <= 0) {
                    setTime(0)
                    clearInterval(interval)
                    setStart(false)
                } else {
                    setTime(Math.max(0, remaining))
                    setStart(true)
                }
            }

            runTimer()
            interval = setInterval(runTimer, 1000)
        } else if (chosenOrd) {
            setTime(chosenOrd.ready_time)
        }

        return () => clearInterval(interval)
    }, [chosenOrd?.order, chosenOrd?.start])


    // დაწყება
    let start = async () => {
        if (!chosenOrd) return

        await startCooking(chosenOrd.order)
        await cooking(chosenOrd.order, chosenOrd.ready_time)

        setOrders(prevOrders =>
            prevOrders.map(ord =>
                ord.order === chosenOrd.order
                    ? { ...ord, start: true, start_at: Date.now() / 1000 }
                    : ord
            )
        )
    }

    return (
        <>
            <main className="w-full h-full flex items-start px-10 py-5 gap-10 relative max-sm:px-3 max-sm:py-2">
                <section className={`w-[50%] max-lg:w-[90%] max-lg:absolute max-lg:z-60 bg-white max-lg:${curentOrd ? 'hidden' : 'block'}`}>
                    <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                        <h1 className="text-3xl font-bold max-sm:text-[25px]">
                            Pending Orders
                        </h1>
                    </header>
                    <section className="w-full flex items-start">
                        <div className="border rounded-xl border-gray-400 w-full">
                            <h1 className="font-bold text-2xl border-b border-gray-400 p-5 max-md:p-4 max-md:text-[17px]">
                                All Orders
                            </h1>
                            <div className="p-5 h-[70vh] overflow-auto flex flex-col items-start gap-3 max-md:p-2 max-sm:h-[80vh]">
                                {
                                    orders.length > 0 ?
                                        orders.map((item, index) => {
                                            return <OrderCard
                                                key={index}
                                                order={item.order}
                                                type={item.type}
                                                pay={item.pay}
                                                userOrders={curentUser?.orders}
                                                user={curentUser?.email}
                                                onClick={curentOrder}
                                                show={curentOrd || false}
                                            />
                                        })
                                        : <h1 className="text-center font-semibold text-gray-400 max-sm:text-sm">No order yet</h1>
                                }
                            </div>
                        </div>
                    </section>
                </section>
                <section className={`w-[50%] max-lg:${curentOrd ? 'block max-lg:w-full max-lg:z-100' : 'hidden'} bg-white`}>
                    <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] border-b border-gray-400">
                        <h2 className="text-3xl font-bold max-md:text-[25px]">
                            {curentOrd ? `Order #${curentOrd}` : ''}
                        </h2>
                        <i className={` ${curentOrd ? 'fa-solid fa-xmark text-2xl cursor-pointer' : 'hidden'}`} onClick={() => {
                            setCurentOrd()
                        }}></i>
                    </header>
                    <div className={`w-full py-5 ${!curentOrd ? 'flex items-center justify-center' : ''}`}>
                        {
                            curentOrd ?
                                <div className="h-full min-h-[78vh] flex flex-col items-start w-full gap-4 mt-2">
                                    <h1 className="font-bold text-xl">Details</h1>
                                    <div className="flex flex-wrap justify-between items-start w-full gap-5 mt-3 max-md:mt-0">
                                        <div className="flex items-center flex-col gap-1 min-w-max">
                                            <h1 className="font-semibold text-gray-400 text-lg max-md:text-[15px]">Order</h1>
                                            <h2 className="font-bold text-[16px]">{chosenOrd?.type}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1 min-w-max">
                                            <h1 className="font-semibold text-gray-400 text-lg max-md:text-[15px]">Costumer</h1>
                                            <h2 className="font-bold max-w-50">{chosenOrd?.name}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1 min-w-max">
                                            <h1 className="font-semibold text-gray-400 text-lg max-md:text-[15px]">{chosenOrd?.address ? 'Address' : 'Table №'}</h1>
                                            <h2 className="font-bold max-w-45">{chosenOrd?.address ? chosenOrd?.address : chosenOrd?.table}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1 min-w-max">
                                            <h1 className="font-semibold text-gray-400 text-lg max-md:text-[15px]">Time</h1>
                                            <h2 className="font-bold">{chosenOrd?.ready_time} m</h2>
                                        </div>
                                    </div>
                                    <h1 className="font-bold text-xl mt-5">Orders</h1>
                                    <div className={`flex flex-col gap-3 items-start w-full overflow-auto h-[32vh]`}>
                                        {
                                            (chosenOrd?.cart || []).map((item, index) => {
                                                let product = allProduct.find(elem => elem.Id === item.Id)
                                                if (!product) return null

                                                return <FoodCard
                                                    key={index}
                                                    image={product.product_image}
                                                    name={product.product_name}
                                                    price={product.price}
                                                    count={item.count}
                                                />
                                            })
                                        }
                                    </div>
                                    <div className={`${curentUser?.position === 'Customer' ? 'hidden' : 'flex items-center justify-between w-full min-h-[10vh]'}`}>
                                        <button className={`${!chosenOrd?.start ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} px-5 py-2 rounded text-white cursor-pointer duration-100 font-semibold disabled:bg-gray-400`} disabled={start_tm} onClick={() => {
                                            if (!chosenOrd?.start) {
                                                startCooking(chosenOrd?.order)
                                                start()
                                            } else {
                                                finish()
                                            }

                                        }}> {!chosenOrd?.start ? 'Start' : 'Finish'}</button>
                                        <h1 className="font-semibold text-xl text-gray-600">Time: {chosenOrd?.start ? formatTime(time) : chosenOrd?.ready_time}</h1>
                                    </div>
                                </div>
                                : <h1 className="text-center text-gray-400 font-semibold text-lg">No Order Details</h1>
                        }
                    </div>
                </section>
            </main >
        </>
    )
}

export default Order
