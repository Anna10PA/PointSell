import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navigation from "../../../MiniComponents/Navigation"
import Table from "../../../MiniComponents/Table"

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
                    <Link to='/add_product'>
                        <button className="text-lg bg-[#F67F20] font-semibold cursor-pointer px-5 text-white py-2 rounded duration-100 hover:bg-orange-400">+ Add Product</button>
                    </Link>
                </header>
                {
                    allProduct.length > 0 ?
                        <Table 
                        col1='Product'
                        col2='Time'
                        col3='Detail'
                        col4='Id'
                        col5='Price'
                        ApiInfo={allProduct} />
                        : null
                }
            </main>
        </>
    )
}

export default AllProduct
