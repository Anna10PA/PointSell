import Comment from "./Comment"

function PostDetail({ allInfo, open, client, curentUser }) {
  return (
    <div className='bg-white flex items-start gap-3 px-5 rounded-2xl py-4 relative max-w-[70%] mx-5'>
      <div className={`${allInfo.post !== null ? 'h-[600px] overflow-hidden rounded w-[750px]' : 'hidden'}`}>
        <img src={allInfo.post} alt={allInfo.post} className='w-full h-full object-cover' />
      </div>
      <div className='h-[600px] w-[65%] flex flex-col items-start gap-5 justify-between'>
        <div className='flex items-center gap-3 w-full relative '>
          <img src={client.profileUrl} alt="" className='w-15 h-15 rounded-[50%]' />
          <div className='leading-4.5 w-full'>
            <h1 className='font-bold'>{client.name}</h1>
            <p className='text-sm text-gray-600 font-bold'>
              {client.position}
            </p>
          </div>
          <i className="fa-solid fa-xmark absolute top-1 right-3 text-2xl cursor-pointer" onClick={() => {
            open(false)
          }}></i>
        </div>
        <div className="max-h-[250px] w-full">
          <p className='font-medium max-h-[170px] min-h-[60px] pb-3 overflow-auto w-full px-3'>{allInfo.title}</p>
          <div className='flex items-center justify-between w-full text-gray-600 border-b border-gray-300 pb-3 text-2xl px-4 mt-1 relative pr-10'>
            <div className='flex items-center gap-2.5'>
              <i className={`fa-regular fa-heart cursor-pointer`}></i>
              <span className='text-lg font-medium'>{allInfo.like}</span>
            </div>
            <div className='flex items-center gap-2.5 '>
              <label htmlFor="comment">
                <i className="fa-regular fa-comment cursor-pointer"></i>
              </label>
              <span className='text-lg font-medium'>{allInfo.comments.length}</span>
            </div>
            <div className='flex items-center gap-2.5 cursor-pointer'>
              <i className="fa-regular fa-eye"></i>
              <span className='text-lg font-medium'>{allInfo.View.length}</span>
            </div>
          </div>
        </div>
        <div className='h-full flex items-center justify-start gap-3 flex-col  w-full relative overflow-auto   '>
          {
            allInfo.comments.length > 0 ?
              allInfo.comments.map((item, index) => {
                return <Comment item={item} key={index} />
              }) : <h1 className='font-bold text-gray-500 w-full text-center'>No Comments Yet</h1>
          }
        </div>
        <div className='w-full h-max flex items-center gap-3 relative bottom-1'>
          <img src={curentUser.profileUrl} alt="" className='w-12.5 h-12.5 object-cover rounded-[50%]' />
          <form className='w-full relative bottom-0'>
            <input type="text" className='border w-full px-5 py-3 rounded-[40px] pr-12 outline-[#F67F20]' placeholder='Comment . . .' id="comment" />
            <div className='absolute bg-[#F67F20] h-10 w-10 rounded-[50%] flex items-center justify-center cursor-pointer top-1 right-1'>
              <i className="fa-solid fa-paper-plane text-white"></i>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
