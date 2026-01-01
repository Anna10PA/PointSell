import Comment from "./Comment"
import { useState, useEffect, useCont } from "react"

function PostDetail({ allInfo, open, client, curentUser, allUsers }) {

  let [commentText, setCommentText] = useState('')
  let [allComment, setAllComment] = useState(allInfo.comments)
  let [likesCount, setLikesCount] = useState(allInfo.like ? allInfo.like.length : 0)
  let [isLiked, setIsLiked] = useState(false)
  let [View, setView] = useState(allInfo.view ? allInfo.view.length : 0)


  useEffect(() => {
    setAllComment(allInfo.comments)
  }, [allInfo.comments])


  // კომენტარის დამატება
  const commentSubmit = async (e) => {
    e.preventDefault()

    let commentInfo = {
      post_id: allInfo.id,
      text: commentText,
      user_name: curentUser.name,
      user_email: curentUser.email,
    }

    try {
      let res = await fetch('http://127.0.0.1:5000/add_comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentInfo),
        credentials: 'include'
      })

      if (res.ok) {
        let newComment = await res.json()
        setAllComment(prev => [...prev, newComment])
        setCommentText("")
      }
    } catch (error) {
      console.error(error)
    }
  }


  // კომენტარის წაშლის ფუნქცია
  const deleteComment = async (comment_id, post_id) => {
    try {
      const res = await fetch('http://localhost:5000/delete_comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post_id,
          comment_id: comment_id
        }),
        credentials: 'include'
      })

      if (res.ok) {
        setAllComment(prev => prev.filter(c => c.id !== comment_id))
      }
    } catch (err) {
      console.error(err)
    }
  }


  // დალაიქებულია თუ არა
  useEffect(() => {
    if (allInfo.like && curentUser?.email) {
      setIsLiked(allInfo.like.includes(curentUser.email))
    }
  }, [allInfo, curentUser])


  // დალაიქების ფუნქცია
  const Like = async () => {
    if (!curentUser) return

    try {
      const result = await fetch('http://127.0.0.1:5000/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: allInfo.id,
          email: curentUser.email,
        }),
      })

      let data = await result.json()

      if (result.ok) {
        setLikesCount(data.likes_count)
        setIsLiked(!data.status)
      }
    } catch (error) {
      console.error(error)
    }
  }


  // ნახვის ფუნქცია
  const view = async () => {
    if (!curentUser) return

    try {
      const result = await fetch('http://127.0.0.1:5000/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: allInfo.id,
          email: curentUser.email,
        }),
      })

      let data = await result.json()

      if (result.ok) {
        setView(data.view)
      }
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    view()
  }, [allInfo.id])


  return (
    <div className='bg-white flex items-start gap-3 px-5 rounded-2xl py-4 relative max-w-[70%] mx-5' >
      <div className={`${allInfo.post !== null ? 'h-[600px] min-w-[450px] overflow-y-hidden rounded w-[750px]' : 'hidden'}`}>
        <img src={allInfo.post} alt={allInfo.post} className='w-full h-full object-cover ' />
      </div>
      <div className='h-[600px] w-[50%] flex flex-col items-start gap-5 justify-between'>
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
              <i className={
                `fa-heart cursor-pointer ${isLiked ? 'text-red-600 fa-solid' : 'text-gray-600 fa-regular'}
                    active:scale-[0.8] duration-100`}
                onClick={Like}></i>
              <span className='text-lg font-medium'>{likesCount}</span>
            </div>
            <div className='flex items-center gap-2.5 '>
              <label htmlFor="comment">
                <i className="fa-regular fa-comment cursor-pointer"></i>
              </label>
              <span className='text-lg font-medium'>{allComment.length}</span>
            </div>
            <div className='flex items-center gap-2.5 cursor-pointer'>
              <i className="fa-regular fa-eye"></i>
              <span className='text-lg font-medium'>{View}</span>
            </div>
          </div>
        </div>
        <div className='h-full flex items-center justify-start gap-3 flex-col  w-full relative overflow-auto   '>
          {
            allComment.length > 0 ?
              allComment.map((item, index) => {
                return <Comment
                  item={{ ...item, post_id: allInfo.id }}
                  curentUser={curentUser}
                  allUsers={allUsers}
                  deleteComment={() => deleteComment(item.id, allInfo.id)}
                  key={index} />
              }) : <h1 className='font-bold text-gray-500 w-full text-center'>No Comments Yet</h1>
          }
        </div>
        <div className='w-full h-max flex items-center gap-3 relative bottom-1'>
          <img src={curentUser.profileUrl} alt="" className='w-12.5 h-12.5 object-cover rounded-[50%]' />
          <form className='w-full relative bottom-0' onSubmit={commentSubmit}>
            <input type="text" className='border w-full px-5 py-3 rounded-[40px] pr-12 outline-[#F67F20]' placeholder='Comment . . .' id="comment" value={commentText} onChange={(e) => {
              setCommentText(e.target.value)
            }} />
            <button className='absolute bg-[#F67F20] h-10 w-10 rounded-[50%] flex items-center justify-center cursor-pointer top-1 right-1 disabled:opacity-50' disabled={!commentText.trim()}>
              <i className="fa-solid fa-paper-plane text-white"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
