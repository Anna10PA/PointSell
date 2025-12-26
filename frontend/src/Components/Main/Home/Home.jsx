import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Card from "./Card"
import { useForm } from "react-hook-form"
import BgBlack from "../../../MiniComponents/BgBlack"
import CartCard from "./CartCard"
import Navigation from "../../../MiniComponents/Navigation"


function Home() {
    let [product, setProduct] = useState([])
    let navigate = useNavigate()
    let { register, watch } = useForm({
        defaultValues: {
            product: ''
        }
    })
    let [sum, setSum] = useState(0)
    let [Change, setChange] = useState(1)
    let [openDetail, setOpenDetail] = useState(false)
    let [foodInfo, setFoodInfo] = useState([])
    let [client, setClient] = useState({ curent_cart: { cart: [] } })
    let [allProduct, setAllProduct] = useState([])


    // შავი გვერდი
    let sendInfo = (item, isOpen) => {
        setFoodInfo(item)
        setOpenDetail(!isOpen)
    }

    // ამჟამინდელი მომხმარებლის ინფორმაციების წამოღება
    let curentUser = async () => {
        let result = await fetch('http://localhost:5000/get_current_user', {
            method: 'GET',
            credentials: 'include'
        })
        let final = await result.json()
        if (result.ok) {
            setClient(final)
        }
    }

    // ყველა პროდუქტის ინფორმაციის წამოღება
    useEffect(() => {
        async function allProduct() {
            let result = await fetch('http://localhost:5000/product20list', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (result.ok) {
                setProduct(final)
                setAllProduct(final)
            }
            await curentUser()
        }
        allProduct()
    }, [])


    // კალათის გასუფთავება
    let cleanCart = async () => {
        try {
            let res = await fetch('http://localhost:5000/clean_cart', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (res.ok) {
                await curentUser()
            }
        } catch (error) {
            console.error(error)
        }
    }

    // გადასახადი
    useEffect(() => {
        let total = 0
        let change = 0

        if (client.curent_cart?.cart?.length > 0) {
            client.curent_cart.cart.map((item, _) => {
                return product.map((prod, _) => {
                    if (item.Id === prod.Id) {
                        total += (Number(prod.price) * Number(item.count))
                        change += 2
                    }
                })
            })
        }

        setChange(total >= 100 ? 20 : change)
        setSum(total)

    }, [client, product])


    // მოძებნა პროდუქტის
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
            <Navigation />
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

                {/* მენიუ */}
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
                                        id={e.Id}
                                        update={curentUser}
                                        key={index} />
                                }) :
                                <div>
                                    <video muted autoPlay loop>
                                        <source src="/not_found.mp4" type="video/mp4" />
                                        Not found
                                    </video>
                                    <div className="leading-loose">
                                        <h1 className="text-center w-full text-2xl font-bold">The Product You Are Looking For Is Not Found</h1>
                                        <p className="text-center w-full text-gray-400">Please Try Another Product</p>
                                    </div>
                                </div>
                        }
                    </section>
                </section>
            </main>

            {/* კალათა */}
            <aside className="h-full border-l border-gray-300 min-h-screen max-w-[370px] w-full max-lg:hidden px-5 py-3 flex items-start flex-col gap-4 relative">
                {client.curent_cart.cart.length > 0 ?
                    <div className="w-full h-full ">
                        <div className="flex items-center justify-between gap-2 w-full mb-3">
                            <h1 className="font-bold text-2xl py-3">Order #{client.curent_cart.order?.toUpperCase() || 'F67F20'}</h1>
                            <i className="fa-solid fa-trash-can cursor-pointer text-2xl duration-100 hover:text-red-600 " onClick={cleanCart}></i>
                        </div>
                        <div className="flex items-start flex-col gap-4 overflow-auto h-[50vh] w-full pr-3 pt-4">
                            {
                                client.curent_cart.cart.map((item, index) => {
                                    return allProduct.map((prod, _) => {
                                        if (item.Id === prod.Id) {
                                            return <CartCard
                                                name={prod.product_name}
                                                key={index}
                                                price={prod.price}
                                                img={prod.product_image}
                                                count={item.count}
                                                update={curentUser}
                                                id={item.Id}
                                            />
                                        }
                                    })
                                })

                            }
                        </div>
                        <div className="w-full min-h-[250px] h-full py-3 flex flex-col justify-between ">
                            <div className="flex flex-col items-start gap-2.5">
                                <div className="flex items-center justify-between w-full font-bold">
                                    <h1>Subtotal</h1>
                                    <h1>${sum.toFixed(2)}</h1>
                                </div>
                                <div className="text-gray-400 flex items-center justify-between w-full ">
                                    <h1>Change</h1>
                                    <h1>${Change.toFixed(2)}</h1>
                                </div>
                                <div className="text-gray-400 flex items-center justify-between w-full border-b border-gray-200 pb-3 mb-3">
                                    <h1>Tax</h1>
                                    <h1>${sum < 100 ? (10).toFixed(2) : sum >= 100 && sum < 200 ? 5 : 'Free'}</h1>
                                </div>
                                <div className="flex items-center justify-between w-full text-gray-950 font-extrabold text-lg">
                                    <h1>Total</h1>
                                    <h1>${(sum + (sum < 100 ? 10 : sum >= 100 && sum < 200 ? 5 : 0) + Change).toFixed(2)}</h1>
                                </div>
                            </div>
                            <button className="bg-[#F67F20] text-white px-5 py-3 w-full rounded-xl font-bold tracking-tight duration-100 hover:bg-amber-500 cursor-pointer" onClick={()=> {
                                navigate('/order_type')
                            }}>Place Order</button>
                        </div>
                    </div> :
                    <div className="h-[60vh] w-full flex items-center justify-center">
                        <h1 className="text-gray-300 font-medium text-center leading-6 text-xl">+ <br />Add Product <br />From special menu</h1>
                    </div>
                }
            </aside>
        </>
    )
}

export default Home
