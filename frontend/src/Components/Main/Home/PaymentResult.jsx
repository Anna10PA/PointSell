import Navigation from "../../../MiniComponents/Navigation"
import { useLocation, useNavigate } from "react-router-dom"

function PaymentResult() {
    let location = useLocation()
    let { text, isPay, order } = location.state
    let navigate = useNavigate()

    return (
        <>
            <Navigation />
            <main className="w-full h-screen flex justify-center relative flex-col items-center">
                <div className="w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 left-10 cursor-pointer hover:bg-orange-400 duratuion-100 flex items-center justify-center" onClick={()=> {
                    isPay ? navigate('/home') :  navigate('/order_type')  
                }}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>
                {
                    <video autoPlay muted loop>
                        <source src={`${isPay ? '/order_confirm.mp4' : '/not_confirm.mp4'}`} type='video/mp4' />
                        not found
                    </video>
                }
                <h1 className="font-bold text-3xl mb-3">
                    {text}
                </h1>
                {
                    isPay ?
                        <p className="text-gray-400">
                            Your Order Number Is <span className="text-gray-500 font-bold">
                                {order.toUpperCase()}
                            </span>
                            , Thanks for choice our Restaurant!
                        </p> : <p className="text-gray-400">
                            Sorry, Something went wrong. Thanks for choice our Restaurant!
                        </p>
                }
            </main>
        </>
    )
}

export default PaymentResult
