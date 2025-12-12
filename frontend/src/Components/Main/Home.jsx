import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Card from "../../MiniComponents/Card"

function Home() {
    let [product, setProduct] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/product20list')
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [])

    return (
        <>
            <nav className='border-r border-[#ececec] w-min flex items-center flex-col h-screen justify-start text-[#BBBBBB] gap-5'>
                <div className='w-full border-b border-[#ececec]  object-cover flex items-center justify-center'>
                    <img src="/icon.png" alt="icon" className='w-[90%] m-3.5' />
                </div>
                <div className="flex items-center flex-col h-[80%] justify-between text-[28px] px-8">
                    <Link to='/home'>
                        <i className="fa-solid fa-house hover:text-[#F67F20] duration-100"></i>
                    </Link>
                    <Link to='/manager dashboard'>
                        <i className="fa-solid fa-bars-staggered"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-book"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-burger"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-bell"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-paper-plane"></i>
                    </Link>
                    <Link>
                        <i className="fa-solid fa-gear"></i>
                    </Link>
                </div>
            </nav>
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-[80%] gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">
                        Point<span className="text-[#F67F20]">sell</span>
                    </h1>
                    <div className="relative border border-[#bbb] rounded-4xl w-full max-w-[500px]">
                        <input type="text" placeholder="Search Anything Here" className="w-full outline-0 px-5 py-2" />
                        <i className="fa-solid fa-magnifying-glass absolute right-5 top-3 text-[#bbb]"></i>
                    </div>
                    <div className="w-12 h-12 bg-[#F67F20] rounded-[50%] flex items-center justify-center text-white text-lg cursor-pointer hover:bg-amber-600 duration-100">
                        <i className="fa-solid fa-bell"></i>
                    </div>
                </header>
                <section className="flex flex-col gap-4">
                    <h2 className="font-bold text-xl bg-white w-full">Special Menu For You</h2>
                    <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 h-full overflow-auto justify-items-center max-h-[75vh]">
                        {
                            product.map((e, index) => {
                                console.log(e)
                                return <Card 
                                img={e.product_image}
                                title={e.product_name} 
                                price={e.price}
                                desc={e.product_description}
                                star={e.star}
                                key={index} />
                            })
                        }
                    </section>
                </section>
            </main>
            <aside className="h-full border min-h-screen">
                <h1>Add Product from special menu</h1>


            </aside>
        </>
    )
}

export default Home
