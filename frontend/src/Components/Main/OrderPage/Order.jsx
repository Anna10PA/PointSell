import Navigation from "../../../MiniComponents/Navigation"
import OrderCard from "./OrderCard"
import { useState, useEffect } from "react"

function Order() {
    let [orders, setOrders] = useState([])
    let [client, setClient] = useState([])

    // შეკვეთების წამოღება
    useEffect(() => {
        let getOrders = async () => {
            try {
                let res = await fetch('http://localhost:5000/orders', {
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


    // ამჟამინდელი მომხმარებელი
    useEffect(() => {

        let curentUser = async () => {
            let result = await fetch('http://localhost:5000/get_current_user', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (result.ok) {
                setClient(final)
            }
        }
        curentUser()
    }, [])

    return (
        <>
            <Navigation />
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">
                        Pending Orders
                    </h1>
                    <h2 className="text-3xl font-bold w-[47%]">
                        Order N123456
                    </h2>
                </header>
                <section className="w-full flex items-start">
                    <div className="w-[50%] border rounded-xl border-gray-400 ">
                        <h1 className="font-bold text-2xl pb-5 border-b border-gray-400 p-5">
                            All Orders
                        </h1>
                        <div className="p-5 h-[70vh] overflow-auto flex flex-col items-start gap-3">
                            {
                                orders.length > 0 ?
                                    orders.map((item, index) => {
                                        console.log(item)
                                        return <OrderCard
                                            key={index}
                                            order={item.order}
                                            type={item.type}
                                            pay={item.pay}
                                            userOrders={client.orders}
                                            user={client.email}
                                        />
                                    })
                                    : <h1 className="text-center font-semibold text-gray-400">No order yet</h1>
                            }
                        </div>
                    </div>
                    <div className="w-[50%] px-10">
                        <h1 className="font-bold text-xl">Details</h1>
                    </div>
                </section>
            </main >
        </>
    )
}

export default Order
