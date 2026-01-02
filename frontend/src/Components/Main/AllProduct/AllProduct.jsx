import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import Table from "../../../MiniComponents/Table"
import { Info } from "../Main"
import BgBlack from "../../../MiniComponents/BgBlack"

function AllProduct() {
    let { allProduct } = useContext(Info)
    let [openDetail, setOpenDetail] = useState(false)
    let [itm, setId] = useState(null)

    // შავი ფონი
    const sendInfo = (item, modeType) => {
        setOpenDetail(modeType)
        setId(item)
    }
    return (
        <>
            {
                openDetail ?
                    <BgBlack
                        open={() => setOpenDetail(false)}
                        func={sendInfo}
                        allInfo={itm}
                        mode={openDetail} /> : null
            }
            <main className="w-full h-[98vh] flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Product</h1>
                    <Link to='/main/add_product'>
                        <button className="text-lg bg-[#F67F20] font-semibold cursor-pointer px-5 text-white py-2 rounded duration-100 hover:bg-orange-400">+ Add Product</button>
                    </Link>
                </header>
                {
                    allProduct?.length > 0 ?
                        <Table
                            col1='Product'
                            col2='Time'
                            col3='Detail'
                            col4='Id'
                            col5='Price'
                            ApiInfo={allProduct}
                            func={sendInfo}
                        />
                        : null
                }
            </main>
        </>
    )
}

export default AllProduct
