import Navigation from "../../../MiniComponents/Navigation"
import OrderCard from "./OrderCard"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Deliver() {
    let [curentUser, setCurentUser] = useState(null)

    useEffect(() => {
        let getUserInfo = async () => {
            let result = await fetch('http://localhost:5000/get_current_user', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (result.ok) {
                setCurentUser(final)
            }
        }

        getUserInfo()
    }, [])
    return (
        <>
            <Navigation />
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] relative">
                    <h1 className="text-3xl font-bold">
                        Order #{curentUser ?
                            curentUser.curent_cart.order.toUpperCase() : 'Loading . . . '}
                    </h1>
                    <Link to='/order_type'>
                        <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] cursor-pointer hover:bg-orange-400 duratuion-100'>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                </header>
                <form className="flex flex-col gap-5">
                    <div action="" className='grid grid-cols-3 gap-5'>
                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="fullname" className='font-bold text-lg'>
                                Recipent:
                            </label>
                            <input type="text" placeholder='Enter Fullname' name='fullname' id='fullname' className='border-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20]' />
                            <span className='text-[red] font-semibold'></span>
                        </div>
                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="PhoneNumber" className='font-bold text-lg'>
                                Phone Number:
                            </label>
                            <input type="text" placeholder='Enter Phone Number' name='PhoneNumber' id='PhoneNumber' className='border-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20]' />
                            <span className='text-[red] font-semibold'></span>
                        </div>
                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="Code" className='font-bold text-lg'>
                                Code:
                            </label>
                            <div className='w-full flex items-center gap-3'>
                                <input type="text" placeholder='Enter Code' name='Code' id='Code' className='border-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20]' />
                                <button className='bg-[#f67f20] text-white font-bold px-3 py-2.5 rounded duration-100 hover:bg-orange-400 cursor-pointer' type='button'>Check</button>
                            </div>
                            <span className='text-[red] font-semibold'></span>
                        </div>
                        <div className='flex items-start gap-3 flex-col col-start-1 col-end-4'>
                            <label htmlFor="Address" className='font-bold text-lg' >
                                Address:
                            </label>
                            <textarea name="Address" id="Address" placeholder='Enter Address' className='border-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] min-h-25 max-h-25' ></textarea>
                            <span className='text-[red] font-semibold'></span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 ">
                        <div className="h-[42vh] overflow-auto flex flex-col items-start gap-3 w-full">
                            {
                                curentUser ?
                                    curentUser.curent_cart.cart.map((item, index) => {
                                        return <OrderCard
                                            key={index}
                                            count={item.count}
                                            id={item.Id}
                                        />
                                    }) : <h1>Loading . . . </h1>
                            }
                        </div>
                        <div className="w-100 h-[43vh] border border-gray-400 rounded-xl p-5 flex flex-col items-start justify-between">
                            <div className="w-full flex flex-col items-start gap-3 border-b border-gray-300 pb-5">
                                <div className="w-full flex items-center justify-between font-bold">
                                    <h1>Subtotal: </h1>
                                    <h1>$100</h1>
                                </div>
                                <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                                    <h1>Tax: </h1>
                                    <h1>$100</h1>
                                </div>
                                <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                                    <h1>Changes: </h1>
                                    <h1>$100</h1>
                                </div>
                                <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                                    <h1>Discaunt: </h1>
                                    <h1>$100</h1>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-between font-bold">
                                <h1>Total: </h1>
                                <h1>$100</h1>
                            </div>
                            <div className="w-full flex items-center gap-1 justify-between">
                                <button onClick={print} className="bg-[#f67f20] text-white rounded h-10 font-semibold px-7 cursor-pointer duration-100 hover:bg-orange-400">Print</button>
                                <button className="h-10 bg-black text-white rounded font-semibold cursor-pointer px-8 duration-100 hover:bg-gray-950" type="submit">Pleace Order</button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default Deliver
