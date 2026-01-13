import FoodCard from "./FoodCard"
import OrderCard from "./OrderCard"
import { useState, useEffect, useContext } from "react"
import { Info } from "../Main"

function Order() {
    let [orders, setOrders] = useState([])
    let [curentOrd, setCurentOrd] = useState(null)
    let [chosenOrd, setChosenOrd] = useState(null)
    let { allProduct, curentUser } = useContext(Info)


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


    // არჩეული შეკვეთის ინფორმაცია
    useEffect(() => {
        if (!curentOrd || orders.length === 0) return
        let found = orders.find((e) => e.order === curentOrd)
        setChosenOrd(found)
    }, [curentOrd, orders])


    return (
        <>
            <main className="w-full h-full flex items-start px-10 py-5 gap-10 ">
                <section className="w-[50%]">
                    <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                        <h1 className="text-3xl font-bold">
                            Pending Orders
                        </h1>
                    </header>
                    <section className="w-full flex items-start">
                        <div className="border rounded-xl border-gray-400 w-full">
                            <h1 className="font-bold text-2xl pb-5 border-b border-gray-400 p-5">
                                All Orders
                            </h1>
                            <div className="p-5 h-[70vh] overflow-auto flex flex-col items-start gap-3">
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
                                        : <h1 className="text-center font-semibold text-gray-400">No order yet</h1>
                                }
                            </div>
                        </div>
                    </section>
                </section>
                <section className="w-[50%]">
                    <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] border-b border-gray-400">
                        <h2 className="text-3xl font-bold">
                            {curentOrd ? `Order #${curentOrd}` : ''}
                        </h2>
                        <i className={` ${curentOrd ? 'fa-solid fa-xmark text-2xl cursor-pointer' : 'hidden'}`} onClick={()=> {
                        setCurentOrd()
                        }}></i>
                    </header>
                    <div className={`w-full py-5 ${!curentOrd ? 'flex items-center justify-center' : ''}`}>
                        {
                            curentOrd ?
                                <div className="h-full flex flex-col items-start w-full gap-4 mt-2">
                                    <h1 className="font-bold text-xl">Details</h1>
                                    <div className="flex items-start justify-between w-full mt-3">
                                        <div className="flex items-center flex-col gap-1">
                                            <h1 className="font-semibold text-gray-400 text-lg">Order</h1>
                                            <h2 className="font-bold text-[16px]">{chosenOrd?.type}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1">
                                            <h1 className="font-semibold text-gray-400 text-lg">Costumer</h1>
                                            <h2 className="font-bold">{chosenOrd?.name}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1">
                                            <h1 className="font-semibold text-gray-400 text-lg">{chosenOrd?.address ? 'Address' : 'Table №'}</h1>
                                            <h2 className="font-bold">{chosenOrd?.address ? chosenOrd?.address : chosenOrd?.table}</h2>
                                        </div>
                                        <div className="flex items-center flex-col gap-1">
                                            <h1 className="font-semibold text-gray-400 text-lg">Time</h1>
                                            <h2 className="font-bold">{chosenOrd?.ready_time}m</h2>
                                        </div>
                                    </div>
                                    <h1 className="font-bold text-xl mt-5">Orders</h1>
                                    <div className="flex flex-col gap-3 items-start w-full overflow-auto h-[50vh]">
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
