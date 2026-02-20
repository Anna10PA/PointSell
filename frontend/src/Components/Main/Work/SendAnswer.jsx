import { useNavigate } from "react-router-dom"

function SendAnswer() {
    let navigate = useNavigate()

    return (
        <main className='w-full h-full flex items-center justify-center z-30 bg-white flex-col relative'>
            <div className="w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 left-10 cursor-pointer hover:bg-orange-400 duratuion-100 flex items-center justify-center max-md:text-center max-sm:left-2 max-sm:top-4" onClick={() => {
                navigate('/main/home')
            }}>
                <i className="fa-solid fa-angle-left"></i>
            </div>
            <video loop muted autoPlay>
                <source src='/Aplication_send_succs.mp4' type="video/mp4" />
                not found
            </video>
            <h1 className="font-bold text-3xl mb-3 max-md:text-xl">
                Your application has been sent successfully
            </h1>
        </main>
    )
}

export default SendAnswer
