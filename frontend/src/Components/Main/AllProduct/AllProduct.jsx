import { useEffect, useState } from "react"
import Navigation from "../../../MiniComponents/Navigation"
import ProductItem from "./ProductItem"

function AllProduct() {

    let [allProduct, setAllProduct] = useState([])

    useEffect(() => {
        async function getAllProduct() {
            let result = await fetch('http://localhost:5000/product20list', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (!result.ok) {
                console.error("Not found")
            } else {
                setAllProduct(final)
            }
        }
        getAllProduct()
    }, [])

    console.log(allProduct)
    return (
        <>
            <Navigation />
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Product</h1>
                    <button className="text-lg bg-[#F67F20] font-semibold cursor-pointer px-5 text-white py-2 rounded duration-100 hover:bg-orange-400">+ Add Product</button>
                </header>
                <div className="rounded-2xl h-[83vh] relative overflow-y-auto border border-gray-200 ">
                    <table className="w-full border-collapse rounded-2xl table-auto">
                        <thead className="sticky top-0 bg-white ">
                            <tr className="text-gray-400 text-lg h-15 ">
                                <th className="border border-gray-200 font-semibold">
                                    Product
                                </th>
                                <th className="border border-gray-200 font-semibold">
                                    Time
                                </th>
                                <th className="border border-gray-200 font-semibold">
                                    Detail
                                </th>
                                <th className="border border-gray-200 font-semibold px-4">
                                    Id
                                </th>
                                <th className="border border-gray-200 font-semibold">
                                    Price
                                </th>
                                <th className="border border-gray-200 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allProduct.map((item, index) => {
                                    return <ProductItem info={item} key={index} />
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default AllProduct
