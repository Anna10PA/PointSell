import FoodDetail from "./FoodDetail"
import { useLocation } from "react-router-dom"
import PostDetail from "./PostDetail"

function BgBlack({ allInfo, open }) {
  let location = useLocation()
  let curentLocation = location.pathname

  return (
    <div className="w-full h-full absolute z-10 bg-[rgba(0,0,0,0.77)] flex items-center justify-center">
      {curentLocation == '/home' ?
        <FoodDetail allInfo={allInfo} open={open} />
        :
        curentLocation === '/posts' ?
          <PostDetail allInfo={allInfo} open={open} />
          : null
      }
    </div>
  )
}

export default BgBlack
