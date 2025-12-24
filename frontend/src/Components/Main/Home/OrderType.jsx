import { Link } from "react-router-dom"
import Navigation from "../../../MiniComponents/Navigation"
import { useNavigate } from "react-router-dom"

function OrderType() {
    let navigate = useNavigate()

    return (
        <>
            <Navigation />
            <main className="w-full h-screen flex justify-center relative flex-col items-start">
                <Link to='/home'>
                    <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 left-10 cursor-pointer hover:bg-orange-400 duratuion-100'>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </Link>
                <section className="w-full flex items-center justify-center gap-10">
                    <div className="border border-gray-400 rounded-2xl p-7 cursor-pointer max-w-100 w-full flex flex-col items-center gap-10 shadow-[0px_10px_0px_rgb(0,0,0)] duration-200 hover:-translate-y-5 hover:shadow-[0px_30px_0px_rgb(0,0,0)] pb-10" onClick={()=> {
                        navigate('/order')
                    }}>
                        <img src="https://i.pinimg.com/736x/11/87/0a/11870ac440914fed6af9357df74c2b97.jpg" alt="table" className="w-full h-50 object-cover" />
                        <h1 className="w-full text-center font-bold text-xl">Taking it on the spot</h1>
                    </div>
                    <div className="border border-gray-400 rounded-2xl p-7 cursor-pointer max-w-100 w-full flex flex-col items-center gap-10 shadow-[0px_10px_0px_rgb(0,0,0)] duration-200 hover:-translate-y-5 hover:shadow-[0px_30px_0px_rgb(0,0,0)] pb-10" onClick={()=> {
                        navigate('/order/deliver')
                    }}>
                        <img src="/location.png" alt="location" className="w-full h-50 object-contain" />
                        <h1 className="w-full text-center font-bold text-xl">Delivery</h1>
                    </div>
                </section>
            </main>
        </>
    )
}

export default OrderType
