import FoodDetail from "./FoodDetail"

function BgBlack({allInfo, open}) {
    console.log(allInfo)
  return (
    <div className="w-full h-full absolute z-10 bg-[rgba(0,0,0,0.77)] flex items-center justify-center">
      <FoodDetail allInfo={allInfo} open={open} />
    </div>
  )
}

export default BgBlack
