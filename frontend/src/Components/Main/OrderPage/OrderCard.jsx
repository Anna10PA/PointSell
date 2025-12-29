function OrderCard({ order, type, pay, userOrders, user }) {
    let detail = () => {
        // saxeli, misamarti, nomeri

    }
    
    return (
        <div className='bg-[#F5F5F5] px-5 py-4 w-full duration-100 hover:bg-gray-200'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl'>Order #{order.toUpperCase()}</h1>
                <h2 className={`${userOrders?.includes(order) || user === 'futureana735@gmail.com' ? 'text-[green] font-bold' : 'hidden'}`}>${pay}</h2>
            </div>
            <div>
                <h2 className='text-gray-400 font-semibold'>{`${userOrders?.includes(order) || user === 'futureana735@gmail.com' ? type : ''}`}</h2>
            </div>
        </div>
    )
}

export default OrderCard
