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
      let res = await fetch('http://localhost:5000/delete_post', {
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
      let res = await fetch('http://localhost:5000/delete_product', {
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


  return (
    <div className="w-full h-full absolute z-10 bg-[rgba(0,0,0,0.77)] flex items-center justify-center">
      {curentLocation == '/main/home' && currentMonth == 11 ?
        <div className="w-full h-full flex items-center justify-center flex-col relative">
          <img src="/nagdi santa.png" className="w-[250px] absolute top-4 left-[32%] z-20" alt="" />
          <FoodDetail
            allInfo={allInfo}
            open={open} />
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
                : curentLocation === '/main/order/deliver' || curentLocation === '/main/order/table'?
                  <div>
                    <h2 className='text-white text-4xl font-extrabold tracking-[1px]'>Payment In Progress . . .</h2>
                  </div>
                  : null

      }
    </div>
  )
}

export default BgBlack
