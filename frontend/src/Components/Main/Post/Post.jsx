import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Navigation from "../../../MiniComponents/Navigation"
import PostCard from "./PostCard"
import BgBlack from "../../../MiniComponents/BgBlack"

function Post() {
  const [allPost, setAllPost] = useState([])
  const [curentUser, setCurentUser] = useState(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [post, setPostInfo] = useState([])
  const [client, setClient] = useState('')
  const [allUsers, setAllUsers] = useState([])


  // შავი ფონი
  const sendInfo = (item, modeType) => {
    setPostInfo(item)
    setOpenDetail(modeType)
  }


  // ამჟამინდელი მომხმარებელი + ყველა მომხმარებელი + ყველა პოსტი
  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, currentRes, usersRes, myInfoRes] = await Promise.all([
          fetch('http://localhost:5000/check_posts', { credentials: 'include' }),
          fetch('http://localhost:5000/get_current_user', { credentials: 'include' }),
          fetch('http://localhost:5000/get_all_user', { credentials: 'include' }),
          fetch('http://localhost:5000/menegers_info', { credentials: 'include' })
        ])

        if (postsRes.ok) setAllPost(await postsRes.json())
        if (currentRes.ok) setCurentUser(await currentRes.json())
        if (usersRes.ok) setAllUsers(await usersRes.json())
        if (myInfoRes.ok) setClient(await myInfoRes.json())
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {
        openDetail ?
          <BgBlack
            allInfo={post}
            open={() => setOpenDetail(false)}
            client={client}
            curentUser={curentUser}
            allUsers={allUsers}
            mode={openDetail} /> : null
      }
      <Navigation />
      <main className="w-full flex flex-col px-10 py-5 gap-3 h-full">
        <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
          <h1 className="text-3xl font-bold">
            Posts
          </h1>
          <Link to='/add_post'>
            <button className={`text-lg text-[#F67F20] font-semibold cursor-pointer ${curentUser?.position == 'Manager' ? 'text-lg text-[#F67F20] font-semibold cursor-pointer px-5 duration-100 hover:bg-[#F67F20] hover:text-white hover:py-2 rounded' : 'hidden'}`}>
              Add New Post
            </button>
          </Link>
        </header>
        <section className="w-full h-[80vh] overflow-auto scroll-none grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))]  gap-5">
          {
            allPost.length > 0 ?
              allPost.map((item, index) => {
                return <PostCard
                  info={item}
                  key={index}
                  sendInfo={(mode) => {
                    sendInfo(item, mode)
                  }} />
              })
              :
              <div className="flex items-center flex-col justify-center h-full w-full">
                <video muted loop autoPlay>
                  <source src='/no_post.mp4' type='video/mp4' />
                </video>
                <div className="leading-loose">
                  <h1 className="text-center w-full text-2xl font-bold">No Post Yet</h1>
                  <p className="text-center w-full text-gray-400">Check Again Later.</p>
                </div>
              </div>
          }
        </section>
      </main>
    </>
  )
}

export default Post
