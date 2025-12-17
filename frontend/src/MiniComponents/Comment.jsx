import React from 'react'

function Comment({ item }) {
  return (
    <div className='border-gray-300 border w-full  flex items-start flex-col gap-2 px-3 py-2 rounded relative'>
      <div className='flex items-center gap-2.5'>
        <img src={item.user_img} alt="" className='w-10 h-10 object-cover rounded-[50%]' />
        <h1 className='font-bold'>{item.user_name}</h1>
      </div>
      <p className='absolute top-2 right-3'>{item.date}</p>
      <h1 className='font-medium pb-2'>{item.comment}</h1>
    </div>
  )
}

export default Comment
