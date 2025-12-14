import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Card from "../../MiniComponents/Card"
import { useForm } from "react-hook-form"
import BgBlack from "../../MiniComponents/BgBlack"


function Home() {
    let [product, setProduct] = useState([])
    let { register, watch } = useForm({
        defaultValues: {
            product: ''
        }
    })
    let [openDetail, setOpenDetail] = useState(false)
    let [foodInfo, setFoodInfo] = useState([])

    let sendInfo = (item, isOpen) => {
        setFoodInfo(item)
        setOpenDetail(!isOpen)
    }

    useEffect(() => {
        fetch('http://127.0.0.1:5000/product20list')
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err))
    }, [])

    let searchProduct = watch('product')
    let filteredProducts = product.filter((item) => {
        if (!searchProduct.trim()) {
            return product
        }
        return item.product_name.toLowerCase().includes(searchProduct.toLowerCase().trim())
    })

    return (
        <>
            {openDetail ?
                <BgBlack allInfo={foodInfo} open={setOpenDetail} /> :
                null
            }
            <nav className='border-r border-[#ececec] w-min flex items-center flex-col h-screen justify-start text-[#BBBBBB] gap-5'>
                <div className='w-full border-b border-[#ececec]  object-cover flex items-center justify-center'>
                    <img src="/icon.png" alt="icon" className='w-[90%] m-3.5' />
                </div>
                <div className="flex items-center flex-col h-[80%] justify-between text-[28px] px-8 max-md:px-4 max-md:text-2xl">
                    <Link to='/home'>
                        <i className="fa-solid fa-house hover:text-[#F67F20] text-[#F67F20] duration-100"></i>
                    </Link>
                    <Link to='/manager dashboard'>
                        <i className="fa-solid fa-bars-staggered hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-book hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-burger hover:text-[#F67F20]"></i>
                    </Link>
                    <Link to='/notification'>
                        <i className="fa-solid fa-bell hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-user hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-paper-plane hover:text-[#F67F20]"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-gear hover:text-[#F67F20]"></i>
                    </Link>
                </div>
            </nav>
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">
                        Point<span className="text-[#F67F20]">sell</span>
                    </h1>
                    <form className="relative border border-[#bbb] rounded-4xl w-full max-w-[500px] overflow-hidden">
                        <input type="text" placeholder="Search Anything Here" className="w-full outline-0 px-5 py-2" {...register('product')} />
                        <i className="fa-solid fa-magnifying-glass absolute right-5 bottom-1 text-[#bbb] py-4 h-full bg-white pl-3"></i>
                    </form>
                    <Link to='/notification'>
                        <div className="min-w-12 min-h-12 bg-[#F67F20] rounded-[50%] flex items-center justify-center text-white text-lg cursor-pointer hover:bg-amber-600 duration-100">
                            <i className="fa-solid fa-bell"></i>
                        </div>
                    </Link>
                </header>
                <section className="flex flex-col gap-4">
                    <h2 className="font-bold text-xl bg-white w-full">Special Menu For You</h2>
                    <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 h-full overflow-auto justify-items-center max-h-[75vh]">
                        {
                            filteredProducts.length !== 0 ?
                                filteredProducts.map((e, index) => {
                                    return <Card
                                        img={e.product_image}
                                        title={e.product_name}
                                        price={e.price}
                                        desc={e.product_description}
                                        star={e.star}
                                        allInfo={() => {
                                            sendInfo(e)
                                        }}
                                        key={index} />
                                }) :
                                <div>
                                    <video muted autoPlay loop>
                                        <source src="/not_found.mp4" type="video/mp4" />
                                        Not found
                                    </video>
                                    <div className="leading-loose">
                                        <h1 className="text-center w-full text-2xl font-bold">The Product You Are Looking For In Not Found</h1>
                                        <p className="text-center w-full text-gray-400">Please Try Another Product</p>
                                    </div>
                                </div>
                        }
                    </section>
                </section>
            </main>
            <aside className="h-full border-l border-gray-300 min-h-screen max-w-[350px] w-full max-lg:hidden">
                <h1 className="text-gray-300 font-medium text-center leading-6 text-xl">+ <br />Add Product <br />From special menu</h1>
            </aside>
        </>
    )
}

export default Home
