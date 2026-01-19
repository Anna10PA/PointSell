import OrderCard from "./OrderCard"
import { useLocation } from "react-router-dom"

function ProductAndChack({curentUser, tax, discount, hasVIPDiscount, isSubmit}) {
    let location = useLocation()
    let curent_location = location.pathname

    return (
        <div className="flex items-start gap-5 relative max-xl:flex-col ">
            <div className="max-h-[40vh] overflow-auto flex flex-col items-start gap-3 w-full max-xl:max-h-[180px] max-md:max-h-[120px]">
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
            <div className="w-100 h-[40vh] border border-gray-400 rounded-xl p-5 flex flex-col items-start justify-between max-xl:w-full">
                <div className="w-full flex flex-col items-start gap-3 border-b border-gray-300 pb-5">
                    <div className="w-full flex items-center justify-between font-bold">
                        <h1>Subtotal: </h1>
                        <h1>${curentUser ? Number(curentUser.curent_cart.sum.subtotal || 0).toFixed(2) : '0.00'}</h1>
                    </div>
                    <div className={`w-full flex items-center text-gray-400 justify-between font-semibold ${curent_location === '/main/order/table' ? 'hidden' : ''}`}>
                        <h1>Tax: </h1>
                        <h1>${tax.toFixed(2)}</h1>
                    </div>
                    <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                        <h1>Changes: </h1>
                        <h1>${curentUser ? Number(curentUser.curent_cart.sum.change || 0).toFixed(2) : '0.00'}</h1>
                    </div>
                    <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                        <h1>Discaunt: </h1>
                        <h1>${Number(discount || 0).toFixed(2)}</h1>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between font-bold">
                    <h1>Total: </h1>
                    <h1 className={`${hasVIPDiscount ? 'text-[#f67f20]' : 'text-black'}`}>${curentUser ? ( curent_location === '/main/order/table' ? (Number(curentUser.curent_cart.sum.subtotal) + Number(curentUser.curent_cart.sum.change) - Number(discount)) : (curentUser.curent_cart.sum.subtotal + tax + curentUser.curent_cart.sum.change - Number(discount))).toFixed(2) : '0.00'}</h1>
                </div>
                <div className="w-full flex items-center gap-1 justify-between">
                    <button className={`h-12 bg-black text-white rounded font-semibold w-full cursor-pointer px-8 duration-100 hover:bg-gray-950 ${isSubmit ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}`} type="submit"
                    disabled={isSubmit}>Pleace Order</button>
                </div>
            </div>
        </div>
    )
}

export default ProductAndChack
