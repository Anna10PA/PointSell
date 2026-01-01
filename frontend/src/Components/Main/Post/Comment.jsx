function Comment({ item, allUsers, curentUser, deleteComment }) {
  let curentTime = new Date(item.date)
  let user = allUsers.find(u => u.email === item.user_email)

  return (
    <div className='border-gray-300 border w-full flex items-start flex-col gap-2 px-3 py-2 rounded-xl relative h-max'>
      <div className='flex items-center gap-2.5'>
        <img src={user?.profileUrl} alt="" className='w-10 h-10 object-cover rounded-[50%]' />
        <h1 className='font-bold'>{user?.name ? user.name : user?.email}</h1>
      </div>
      <p className='absolute top-2 right-3 text-gray-400'>
        {`${String(curentTime).split(' ')[2]} ${String(curentTime).split(' ')[1]} ${String(curentTime).split(' ')[3] != new Date().getFullYear() ? String(curentTime).split(' ')[3] : ' '}`}</p>
      <p className='font-medium pb-2 w-full text-wrap wrap-break-word text-gray-900'>{item.comment}</p>
      {curentUser?.email === item.user_email || curentUser?.position === 'Manager' ?
        <i className={`fa-solid fa-trash absolute bottom-5 right-4 text-gray-400 text-xl cursor-pointer hover:text-red-600 duration-100`} onClick={deleteComment}></i>
        : null
      }
    </div>
  )
}

export default Comment
