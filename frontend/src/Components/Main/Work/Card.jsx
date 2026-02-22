import { useContext } from "react"
import { Info } from "../Main"

function Card({ user, text, time }) {
  let { answer, curentUser } = useContext(Info)

  return (
    <div className='bg-gray-100 px-7 py-5 max-md:px-4 max-md:py-3 max-md:text-sm rounded-2xl w-full flex flex-col items-start gap-5 border border-gray-200 relative'>
      <div className='flex items-center justify-between w-full'>
        <h1 className='text-gray-500 text-xl font-bold max-md:text-[17px] break-all'>{user}</h1>
        <p className='text-gray-500 font-semibold max-md:text-sm max-md:absolute max-md:bottom-3 max-md:right-5'>{(String(new Date(time.split(' ')[0])).split(' ').slice(1, 4)).join(' ')}</p>
      </div>
      <p className='text-gray-400 font-semibold'>{text}</p>
      <div className='w-full flex items-center justify-between '>
        <div className={`flex items-center gap-5 ${curentUser?.position == 'Manager' ? ' ': 'hidden'} max-md:flex-col max-md:items-start max-md:gap-2`}>
          <button className='px-5 py-2 rounded bg-[#f67f20] flex items-center gap-3 justify-center text-white font-bold tracking-wide duration-100 hover:bg-orange-400 cursor-pointer max-md:px-3 max-md:py-1.5 max-md:text-sm' onClick={()=> {
            answer(true, user)
          }}>
            <i className="fa-solid fa-check"></i>
            Accept
          </button>
          <button className='px-5 py-2 rounded bg-[#f62020] flex items-center gap-3 justify-center text-white font-bold tracking-wide duration-100 hover:bg-red-500 cursor-pointer max-md:px-3 max-md:py-1.5 max-md:text-sm' onClick={()=> {
            answer(false, user)
          }}>
            <i className="fa-solid fa-xmark"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
