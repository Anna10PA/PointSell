import Item from "./Item"
import { useState, useEffect } from "react"

function Table({ col1, col2, col3, col4, col5, ApiInfo, func }) {
    let [mode, setMode] = useState(6)

    useEffect(() => {
        let changeSize = () => {
            if (window.innerWidth >= 1024) {
                setMode(6)
            } else if (window.innerWidth < 1024 && window.innerWidth > 767) {
                setMode(prev => (prev === 6 ? 2 : prev))
            } else if (window.innerWidth <= 767) {
                setMode(prev => (prev === 6 ? 2 : prev))
            }
        }
        changeSize()
        window.addEventListener('resize', changeSize)
    }, [])

    return (
        <div className="rounded-2xl  h-[83vh] relative overflow-y-auto border border-gray-200 ">
            <table className="w-full border-collapse rounded-2xl table-auto">
                <thead className="sticky top-0 bg-white ">
                    <tr className="text-gray-400 text-lg h-15 ">
                        <th className="border border-gray-200 font-semibold max-sm:text-[18px]">
                            {col1}
                        </th>
                        <th className="border border-gray-200 font-semibold table-cell max-lg:hidden">
                            {col2}
                        </th>
                        <th className="border border-gray-200 font-semibold table-cell max-lg:hidden">
                            {col3}
                        </th>
                        <th className="border border-gray-200 font-semibold px-4  table-cell max-md:hidden">
                            {col4}
                        </th>
                        <th className="border border-gray-200 font-semibold table-cell max-lg:hidden">
                            {col5}
                        </th>
                        <th className="border border-gray-200 font-semibold duration-300 max-sm:text-[18px] max-lg:cursor-pointer max-lg:hover:text-black px-2" onClick={() => {
                            if (window.innerWidth < 1023 && window.innerWidth > 767) {
                                setMode(prev => prev >= 6 ? 2 : prev == 3 ? prev + 2 : prev + 1)
                            } else if (window.innerWidth <= 767) {
                                setMode(prev => prev >= 6 ? 2 : prev + 1)
                            } else {
                                setMode(6)
                            }
                        }}>
                            {
                                mode == 2 ? col2 :
                                    mode == 3 ? col3 :
                                        mode == 4 ? col4 :
                                            mode == 5 ? col5 :
                                                'Action'
                            }
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ApiInfo?.length > 0 ?
                            ApiInfo.map((item, index) => {
                                return <Item
                                    image={item.product_image || item.profileUrl}
                                    name={item.product_name || item.name}
                                    info={item}
                                    info2={item?.time || item?.orders?.length}
                                    info3={item.product_description || item.address}
                                    info4={item.Id || item.email}
                                    price={item.price || item.spent}
                                    hasBlock={item.block || null}
                                    func={func}
                                    mode={mode}
                                    key={index} />
                            })
                            : null
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
