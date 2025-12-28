import OrderCard from "./OrderCard"

function ProductAndChack({curentUser, tax}) {
    return (
        <div className="flex items-start gap-5 ">
            <div className="h-[40vh] overflow-auto flex flex-col items-start gap-3 w-full">
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
            <div className="w-100 h-[40vh] border border-gray-400 rounded-xl p-5 flex flex-col items-start justify-between">
                <div className="w-full flex flex-col items-start gap-3 border-b border-gray-300 pb-5">
                    <div className="w-full flex items-center justify-between font-bold">
                        <h1>Subtotal: </h1>
                        <h1>${curentUser ? curentUser.curent_cart.sum.subtotal.toFixed(2) : '0.00'}</h1>
                    </div>
                    <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                        <h1>Tax: </h1>
                        <h1>${tax.toFixed(2)}</h1>
                    </div>
                    <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                        <h1>Changes: </h1>
                        <h1>${curentUser ? curentUser.curent_cart.sum.change.toFixed(2) : '0.00'}</h1>
                    </div>
                    <div className="w-full flex items-center text-gray-400 justify-between font-semibold">
                        <h1>Discaunt: </h1>
                        <h1>${curentUser ? curentUser.curent_cart.sum.discount.toFixed(2) : '0.00'}</h1>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between font-bold">
                    <h1>Total: </h1>
                    <h1>${curentUser ? (curentUser.curent_cart.sum.subtotal + tax + curentUser.curent_cart.sum.change - curentUser.curent_cart.sum.discount).toFixed(2) : '0.00'}</h1>
                </div>
                <div className="w-full flex items-center gap-1 justify-between">
                    <button className="h-12 bg-black text-white rounded font-semibold w-full cursor-pointer px-8 duration-100 hover:bg-gray-950" type="submit">Pleace Order</button>
                </div>
            </div>
        </div>
    )
}

export default ProductAndChack
