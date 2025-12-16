import { useEffect, useState } from "react"
import Navigation from "../../MiniComponents/Navigation"
import PostCard from "../../MiniComponents/PostCard"
import BgBlack from "../../MiniComponents/BgBlack"

function Post() {
  const [allPost, setAllPost] = useState([])
  const [curentUser, setCurentUser] = useState(0)

  const [openDetail, setOpenDetail] = useState(false)
  const [foodInfo, setFoodInfo] = useState([])

  const sendInfo = (item, isOpen) => {
    setFoodInfo(item)
    setOpenDetail(!isOpen)
  }

  useEffect(() => {
    async function getCurentUser() {
      try {
        let res = await fetch('http://localhost:5000/get_current_user', {
          method: "GET",
          credentials: 'include'
        })
        let result = await res.json()
        if (!res.ok) {
          return "something went wrong"
        } else {
          setCurentUser(result)
        }
      } catch (e) {
        console.error(e)
      }
    }
    getCurentUser()
  }, [])


  useEffect(() => {
    async function checkPosts() {
      try {
        let res = await fetch('http://localhost:5000/check_posts', {
          method: 'GET',
          credentials: 'include'
        })
        let result = await res.json()

        if (res.ok) {
          setAllPost(result)
        }
      } catch (e) {
        console.error(e)
      }
    }

    checkPosts()
  }, [])


  return (
    <>
    {
      openDetail ? 
      <BgBlack /> : null
    }
      <Navigation />
      <main className="w-full flex flex-col px-10 py-5 gap-3 h-full">
        <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
          <h1 className="text-3xl font-bold">
            Posts
          </h1>
          <button className={`text-lg text-[#F67F20] font-semibold cursor-pointer ${curentUser.position == 'Manager' ? 'text-lg text-[#F67F20] font-semibold cursor-pointer px-5 duration-100 hover:bg-[#F67F20] hover:text-white hover:py-2 rounded' : 'hidden'}`}>
            Add New Post
          </button>
        </header>
        <section className="w-full h-[80vh] overflow-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  gap-3">
          {
            allPost.length > 0 ?
              allPost.map((item, index) => {
                return <PostCard 
                info={item} 
                key={index} 
                sendInfo={()=> {
                  sendInfo(item)
                }} />
              })
              :
              <div className="flex items-center justify-center h-full w-full">
                <h1>No Post Yet</h1>
              </div>
          }
        </section>
      </main>
    </>
  )
}

export default Post
