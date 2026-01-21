import { useNavigate } from "react-router-dom"

function AnswersCard({ answer, getVerification, email, correctAnswer }) {
    let navigate = useNavigate()

    return (
        <div className='border-2 border-[#f67f20] rounded px-10 py-5 font-semibold cursor-pointer duration-100 hover:bg-[#f67f20] hover:text-white flex items-center justify-center w-full h-full text-lg' onClick={() => {
            getVerification(email, (answer === correctAnswer))
            if (answer === correctAnswer) {
                navigate('/main/setting/password/verify')
            }
        }}>
            <h1>{answer}</h1>
        </div>
    )
}

export default AnswersCard
