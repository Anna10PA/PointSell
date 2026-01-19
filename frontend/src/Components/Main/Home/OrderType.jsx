import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function OrderType() {
    let navigate = useNavigate()

    return (
        <>
            <main className="w-full h-screen flex justify-center relative flex-col items-start">
                <Link to='/main/home'>
                    <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 max-sm:left-2 left-10 cursor-pointer max-sm:top-3 hover:bg-orange-400 duratuion-100'>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </Link>
                <section className="w-full flex items-center justify-center gap-10 max-sm:px-2 px-10 max-md:flex-col max-md:justify-start">
                    <div className="border border-gray-400 rounded-2xl p-7 cursor-pointer max-w-100 w-full flex flex-col items-center gap-10 shadow-[0px_10px_0px_rgb(0,0,0)] duration-200 hover:-translate-y-5 hover:shadow-[0px_30px_0px_rgb(0,0,0)] max-md:p-4 pb-10 max-md:pb-6 max-md:gap-4" onClick={()=> {
                        navigate('/main/order/table')
                    }}>
                        <img src="https://i.pinimg.com/736x/11/87/0a/11870ac440914fed6af9357df74c2b97.jpg" alt="table" className="w-full h-50 object-cover max-md:h-30 max-md:object-contain " />
                        <h1 className="w-full text-center font-bold text-xl">Taking it on the spot</h1>
                    </div>
                    <div className="border border-gray-400 rounded-2xl p-7 cursor-pointer max-w-100 w-full flex flex-col items-center gap-10 shadow-[0px_10px_0px_rgb(0,0,0)] duration-200 hover:-translate-y-5 hover:shadow-[0px_30px_0px_rgb(0,0,0)] max-md:p-4 pb-10 max-md:gap-4 max-md:pb-6" onClick={()=> {
                        navigate('/main/order/deliver')
                    }}>
                        <img src="/location.png" alt="location" className="w-full h-50 object-contain max-md:h-30 max-md:object-contain" />
                        <h1 className="w-full text-center font-bold text-xl">Delivery</h1>
                    </div>
                </section>
            </main>
        </>
    )
}

export default OrderType
