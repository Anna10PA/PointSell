import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import PostCard from "./PostCard"
import BgBlack from "../../../MiniComponents/BgBlack"
import { Info } from "../Main"

function Post() {
  // const [allPost, setAllPost] = useState([])
  const { curentUser, allUser, allPost, managerInfo } = useContext(Info)
  const [openDetail, setOpenDetail] = useState(false)
  const [post, setPostInfo] = useState([])


  // შავი ფონი
  const sendInfo = (item, modeType) => {
    setPostInfo(item)
    setOpenDetail(modeType)
  }

  return (
    <>
      {
        openDetail ?
          <BgBlack
            allInfo={post}
            open={() => setOpenDetail(false)}
            client={managerInfo}
            curentUser={curentUser}
            allUsers={allUser}
            mode={openDetail} /> : null
      }
      <main className="w-full flex flex-col px-10 py-5 gap-3 h-full">
        <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
          <h1 className="text-3xl font-bold">
            Posts
          </h1>
          <Link to='/main/add_post'>
            <button className={`text-lg text-[#F67F20] font-semibold cursor-pointer ${curentUser?.position == 'Manager' ? 'text-lg text-[#F67F20] font-semibold cursor-pointer px-5 duration-100 hover:bg-[#F67F20] hover:text-white hover:py-2 rounded' : 'hidden'}`}>
              Add New Post
            </button>
          </Link>
        </header>
        <section className="w-full h-[80vh] overflow-auto scroll-none grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))]  gap-5">
          {
            allPost?.length > 0 ?
              allPost?.map((item, index) => {
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
