import FoodDetail from "../Components/Main/Home/FoodDetail"
import { useLocation } from "react-router-dom"
import PostDetail from "../Components/Main/Post/PostDetail"

function BgBlack({ allInfo, open, client, curentUser }) {
  let location = useLocation()
  let curentLocation = location.pathname

  return (
    <div className="w-full h-full absolute z-10 bg-[rgba(0,0,0,0.77)] flex items-center justify-center">
      {curentLocation == '/home' ?
        <FoodDetail allInfo={allInfo} open={open} />
        :
        curentLocation === '/posts' ?
          <PostDetail allInfo={allInfo} open={open} client={client} curentUser={curentUser} />
          : null
      }
    </div>
  )
}

export default BgBlack
