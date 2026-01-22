import { useLocation, useNavigate } from "react-router-dom"

function PaymentResult() {
    let location = useLocation()
    let { text, isPay, order } = location.state
    let navigate = useNavigate()

    return (
        <>
        {/* {window.location.reload()} */}
            <main className="w-full h-screen flex justify-center relative flex-col items-center px-3">
                <div className="w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 left-10 cursor-pointer hover:bg-orange-400 duratuion-100 flex items-center justify-center max-md:text-center max-sm:left-2 max-sm:top-4" onClick={()=> {
                    navigate('/main/home')
                }}>
                    <i className="fa-solid fa-angle-left"></i>
                </div>
                {
                    <video autoPlay muted loop>
                        <source src={`${isPay ? '/order_confirm.mp4' : '/not_confirm.mp4'}`} type='video/mp4' />
                        not found
                    </video>
                }
                <h1 className="font-bold text-3xl mb-3 max-md:text-xl">
                    {text}
                </h1>
                {
                    isPay ?
                        <p className="text-gray-400 text-center max-md:text-sm">
                            Your Order Number Is <span className="text-gray-500 font-bold">
                                {order?.toUpperCase()}
                            </span>
                            , Thanks for choice our Restaurant!
                        </p> : <p className="text-gray-400 text-center  max-md:text-sm">
                            Sorry, Something went wrong. Thanks for choice our Restaurant!
                        </p>
                }
            </main>
        </>
    )
}

export default PaymentResult
