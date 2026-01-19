import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import Card from "./Card"
import { useForm } from "react-hook-form"
import BgBlack from "../../../MiniComponents/BgBlack"
import CartCard from "./CartCard"
import { Info } from "../Main"
import FoodStar from "./FoodStar"


function Home() {
    let { curentUser, getCurentUser, allProduct, getAllProduct, postReadNotification } = useContext(Info)

    let navigate = useNavigate()
    let { register, watch } = useForm({
        defaultValues: {
            product: ''
        }
    })
    let [sum, setSum] = useState(0)
    let [Change, setChange] = useState(1)
    let [discount, setDiscount] = useState(0)

    let [openDetail, setOpenDetail] = useState(false)
    let [foodInfo, setFoodInfo] = useState([])

    let [searchOpen, setSearchOpen] = useState(false)
    let [openCart, setOpenCart] = useState(false)
    let [openStar, setOpenStar] = useState(false)


    // შავი გვერდი
    let sendInfo = (item, isOpen) => {
        setFoodInfo(item)
        setOpenDetail(!isOpen)
    }


    // ყველა პროდუქტის ინფორმაციის წამოღება
    useEffect(() => {
        getAllProduct()
    }, [])


    // კალათის გასუფთავება
    let cleanCart = async () => {
        try {
            let res = await fetch('https://pointsell-4.onrender.com/clean_cart', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (res.ok) {
                await getCurentUser()
            }
        } catch (error) {
            console.error(error)
        }
    }


    // გადასახადის გამოთვლა
    useEffect(() => {
        let total = 0
        let change = 0
        let disc = 0

        if (curentUser?.curent_cart?.cart?.length > 0) {
            curentUser?.curent_cart?.cart.map((item, _) => {
                return allProduct.map((prod, _) => {
                    if (item.Id === prod.Id) {
                        total += (Number(prod.price) * Number(item.count))
                        change += 1.5
                        if (prod.discount) {
                            disc += (Number(prod.price) * (Number(prod.discount.split('%')[0])) / 100) * Number(item.count)
                        }
                    }
                })
            })
        }

        setChange(total >= 100 ? 20 : change)
        setSum(total)
        setDiscount(disc)

    }, [curentUser, allProduct])


    // მოძებნა პროდუქტის
    let searchProduct = watch('product')
    let filteredProducts = allProduct?.filter((item) => {
        if (!searchProduct.trim()) {
            return allProduct
        }
        return item.product_name.toLowerCase().includes(searchProduct.toLowerCase().trim())
    })


    // გადასახადის დამატება json ფაილში
    let paySum = async (s, c, d) => {
        try {

            let res = await fetch('https://pointsell-4.onrender.com/pay_sum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    subtotal: s,
                    change: c,
                    discount: d,
                    tax: 0
                })
            })
            if (res.ok) {
                navigate('/main/order')
            }
        } catch (e) {
            console.error(e)
        }
    }


    let notificatinClick = async (e) => {
        e.preventDefault()
        await postReadNotification('1')
        navigate('/main/notification')
    }


    return (
        <>
            {openDetail ?
                <BgBlack allInfo={foodInfo} open={setOpenDetail} /> :
                openStar ?
                    <FoodStar id={openStar} close={setOpenStar}/> : null

            }

            <main className="w-full h-full flex flex-col px-10 py-5 gap-5 max-sm:px-3 max-sm:py-2 max-sm:gap-2 relative">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] ">
                    <h1 className="text-3xl font-bold max-sm:text-[29px]">
                        Point<span className="text-[#F67F20]">sell</span>
                    </h1>
                    <div className="flex items-center w-[50%] justify-end">
                        <form className={`relative border border-[#bbb] rounded-4xl bg-white duration-300 overflow-hidden ${searchOpen
                                ? 'max-sm:w-full max-sm:absolute max-sm:right-0 z-40'
                                : 'max-sm:w-10 max-sm:h-10 w-full max-w-[500px]'}`}>

                            <input
                                type="text"
                                placeholder="Search Anything Here"
                                className={`w-full outline-0 px-5 py-2 ${!searchOpen && 'max-sm:opacity-0'}`}
                                {...register('product')}
                            />

                            <i className={`fa-solid fa-magnifying-glass absolute right-5 bottom-1 text-[#bbb] py-4 h-full bg-white pl-3 `}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        setSearchOpen(!searchOpen)
                                    }
                                }}>
                            </i>
                        </form>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to='/main/notification'>
                            <div className="min-w-12 min-h-12 max-sm:min-h-10 max-sm:min-w-10 max-sm:text-sm bg-[#F67F20] rounded-[50%] flex items-center justify-center text-white text-lg cursor-pointer hover:bg-amber-600 duration-100 relative" onClick={(e) => {
                                notificatinClick(e)
                            }}>
                                <i className="fa-solid fa-bell"></i>
                                <div className={` ${curentUser?.notification?.filter(item => !item.read).length > 0 ? 'bg-white rounded-[50%] absolute top-1.5 right-1.5 text-[#f67f20] text-[10px] font-extrabold w-4 h-4 flex items-center justify-center border p-1 max-sm:min-w-2 max-sm:min-h-2 max-sm:p-0 ' : 'hidden'}`}>
                                    {
                                        curentUser?.notification?.length > 0 ?
                                            (curentUser?.notification?.filter(item => !item.read).length > 9 ? '9+' : curentUser?.notification?.filter(item => !item.read).length) : null
                                    }
                                </div>
                            </div>
                        </Link>
                        <div className="min-w-12 min-h-12 max-sm:min-h-10 max-sm:min-w-10 max-sm:text-sm bg-[#F67F20] rounded-[50%] flex items-center justify-center text-white text-lg cursor-pointer hover:bg-amber-600 duration-100 relative lg:hidden" onClick={() => {
                            setOpenCart(!openCart)
                        }}>
                            <i className="fa-solid fa-cart-arrow-down"></i>
                            <div className="bg-white rounded-[50%] absolute top-1.5 right-1.5 text-[#f67f20] text-[10px] font-extrabold w-4 h-4 flex items-center justify-center border p-1 max-sm:min-w-2 max-sm:min-h-2 max-sm:p-0 ">
                                <h1>{curentUser?.curent_cart?.cart.length}</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* მენიუ */}
                <section className="flex flex-col gap-4">
                    <h2 className="font-bold text-xl bg-white w-full max-sm:text-[18px]">Special Menu For You</h2>
                    <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 h-full overflow-auto justify-items-center max-h-[75vh] max-sm:max-h-[80vh]">
                        {
                            filteredProducts?.length !== 0 ?
                                filteredProducts?.map((e, index) => {
                                    return <Card
                                        img={e.product_image}
                                        title={e.product_name}
                                        price={e.price}
                                        desc={e.product_description}
                                        star={e.star}
                                        allInfo={() => {
                                            sendInfo(e)
                                        }}
                                        discount={e.discount}
                                        id={e.Id}
                                        update={getCurentUser}
                                        starOpen={setOpenStar}
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
            <aside className={`duration-300 border-l h-full border-gray-300 max-w-[370px] w-full flex items-start flex-col gap-4 relative px-5 py-3 max-lg:absolute max-lg:right-0 max-lg:top-0 max-lg:bg-white max-lg:z-50 ${openCart
                ? 'max-lg:translate-x-0 max-lg:block'
                : 'max-lg:translate-x-full max-lg:hidden '}`}>
                <div className="lg:hidden absolute top-7 right-3">
                    <i className="fa-solid fa-xmark cursor-pointer text-2xl duration-100 hover:text-red-600 lg:hidden" onClick={() => {
                        setOpenCart(!openCart)
                    }}></i>
                </div>
                {curentUser?.curent_cart?.cart.length > 0 ?
                    <div className="w-full h-full ">
                        <div className="flex items-center justify-between gap-2 w-full mb-3 relative">
                            <h1 className="font-bold text-2xl py-3">Order #{curentUser?.curent_cart.order?.toUpperCase() || 'F67F20'}</h1>
                            <div className="flex items-center gap-3 mr-5">
                                <i className="fa-solid fa-trash-can cursor-pointer text-2xl duration-100 hover:text-red-600 " onClick={cleanCart}></i>
                            </div>
                        </div>
                        <div className="flex items-start flex-col gap-4 overflow-auto h-[50vh] w-full pr-3 pt-4">
                            {
                                curentUser?.curent_cart?.cart.map((item, index) => {
                                    return allProduct?.map((prod, _) => {
                                        if (item.Id === prod.Id) {
                                            return <CartCard
                                                name={prod.product_name}
                                                key={index}
                                                price={prod.price}
                                                img={prod.product_image}
                                                count={item.count}
                                                update={getCurentUser}
                                                id={item.Id}
                                            />
                                        }
                                    })
                                })
                            }
                        </div>
                        <div className="w-full min-h-[250px] py-3 flex flex-col ">
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
                                    <h1>Discount:</h1>
                                    <h1>${discount.toFixed(2)}</h1>
                                </div>
                                <div className="flex items-center justify-between w-full text-gray-950 font-extrabold text-lg">
                                    <h1>Total</h1>
                                    <h1>${(sum + Change - discount).toFixed(2)}</h1>
                                </div>
                            </div>
                            <button className="bg-[#F67F20] text-white px-5 py-3 w-full rounded-xl font-bold tracking-tight duration-100 hover:bg-amber-500 mt-5 cursor-pointer" onClick={() => {
                                paySum(sum, Change, discount)
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
