import { useContext } from "react"
import { Info } from "../Main"

function Card({ user, text, time }) {
  let { answer } = useContext(Info)

  return (
    <div className='bg-gray-100 px-7 py-5 rounded-2xl w-full flex flex-col items-start gap-5 border border-gray-200'>
      <div className='flex items-center justify-between w-full'>
        <h1 className='text-gray-500 text-xl font-bold'>{user}</h1>
        <p className='text-gray-500 font-semibold'>{(String(new Date(time.split(' ')[0])).split(' ').slice(1, 4)).join(' ')}</p>
      </div>
      <p className='text-gray-400 font-semibold'>{text}</p>
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <button className='px-5 py-2 rounded bg-[#f67f20] flex items-center gap-3 justify-center text-white font-bold tracking-wide duration-100 hover:bg-orange-400 cursor-pointer' onClick={()=> {
            answer(true, user)
          }}>
            <i className="fa-solid fa-check"></i>
            Accept
          </button>
          <button className='px-5 py-2 rounded bg-[#f62020] flex items-center gap-3 justify-center text-white font-bold tracking-wide duration-100 hover:bg-red-500 cursor-pointer' onClick={()=> {
            answer(false, user)
          }}>
            <i className="fa-solid fa-xmark"></i>
            Reject
          </button>
        </div>
        <button className='px-5 py-2 rounded bg-gray-500 flex items-center gap-3 justify-center text-white font-bold tracking-wide duration-100 hover:bg-gray-400 cursor-pointer'>
          <i className="fa-solid fa-address-card"></i>
          Info
        </button>
      </div>
    </div>
  )
}

export default Card
