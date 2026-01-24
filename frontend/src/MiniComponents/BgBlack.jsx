import FoodDetail from '../Components/Main/Home/FoodDetail'
import { useLocation } from "react-router-dom"
import PostDetail from "../Components/Main/Post/PostDetail"
import Warning from "./Warning"

function BgBlack({ allInfo, open, client, curentUser, mode, allUsers }) {
  let location = useLocation()
  let curentLocation = location.pathname
  let currentMonth = new Date().getMonth()


  // პოსტის წაშლის ფუნქცია
  const deletePost = async () => {
    try {
      let res = await fetch('https://pointsell-4.onrender.com/delete_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: allInfo.id }),
        credentials: 'include'
      })
      if (res.ok) {
        window.location.reload()
      }
    }
    catch (e) {
      console.error(e)
    }
  }


  // პროდუქტის წაშლის ფუნქცია
  const deleteProduct = async () => {
    try {
      let res = await fetch('https://pointsell-4.onrender.com/delete_product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: allInfo }),
        credentials: 'include'
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // მომხმარებლის წაშლის ფუნქცია
  const deleteUser = async () => {
    if (!allInfo) {
      return
    }
    try {
      let res = await fetch('https://pointsell-4.onrender.com/delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: allInfo }),
        credentials: 'include'
      })
      if (res.ok) {
        window.location.reload()
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="w-full h-full absolute z-90 bg-[rgba(0,0,0,0.77)] flex items-center justify-center max-md:p-3 ">
      {curentLocation == '/main/home' && currentMonth == 11 || curentLocation == '/main/home' && currentMonth == 0 ?
        <div className='flex items-start justify-center w-full h-full  max-md:items-end'>
          <div className="w-max h-max flex items-center max-md:justify-end justify-start flex-col relative ">
            <img src="/nagdi santa.png" className="w-[250px] relative -bottom-25 -left-[10%] max-md:left-[5%] max-md:top-25 z-20" alt="" />
            <FoodDetail
              allInfo={allInfo}
              open={open} />
          </div>
        </div>
        : curentLocation == '/main/home' && curentLocation !== 11 ?
          <FoodDetail
            allInfo={allInfo}
            open={open} />
          : curentLocation === '/main/posts' && mode === "delete" ?
            <Warning
              allInfo={allInfo}
              open={open}
              title={'Delete This Post?'}
              message={'Are you sure, You want delete this post?'}
              deleteFunction={deletePost}
            />
            : curentLocation === '/main/posts' && mode === "view" ?
              <PostDetail
                allInfo={allInfo}
                open={open}
                client={client}
                allUsers={allUsers}
                curentUser={curentUser} />
              : curentLocation === '/main/products' && mode === 'delete_product' ?
                <Warning
                  open={open}
                  title={'Delete This Product?'}
                  message={'Are you sure, You want delete this Product?'}
                  deleteFunction={deleteProduct}
                />
                : curentLocation === '/main/order/deliver' || curentLocation === '/main/order/table' ?
                  <div>
                    <h2 className='text-white text-4xl font-extrabold tracking-[1px] text-center'>Payment In Progress . . .</h2>
                  </div>
                  : null

      }
    </div>
  )
}

export default BgBlack
