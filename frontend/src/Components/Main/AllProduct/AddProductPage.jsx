import Navigation from "../../../MiniComponents/Navigation"
import { Link } from "react-router-dom"

function AddProductPage() {
    return (
        <>
            <Navigation />
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Add Product</h1>
                </header>
                <section className="relative border border-gray-300 rounded-2xl p-5">
                    <Link to='/products'>
                        <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] cursor-pointer hover:bg-orange-400 duratuion-100'>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                    <img src="" alt="" />

                </section>
            </main>
        </>
    )
}

export default AddProductPage
