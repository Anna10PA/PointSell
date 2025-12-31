function OrderCard({ order, type, pay, userOrders, user, onClick, show }) {
    
    return (
        <div className={` px-5 py-4 w-full duration-100 rounded-xl ${show === order ? 'bg-[#f67f20] hover:bg-orange-400 text-white' : 'bg-[#F5F5F5] hover:bg-gray-200'}`} onClick={()=> {
            userOrders?.includes(order) || user === 'futureana735@gmail.com' ? onClick(order) : null
        }}>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl'>Order #{order.toUpperCase()}</h1>
                <h2 className={`${(userOrders?.includes(order) || user === 'futureana735@gmail.com') && show !== order ? 'text-[green] font-bold' : show === order && ( userOrders?.includes(order) || user === 'futureana735@gmail.com')? 'font-bold text-white' : userOrders?.includes(order) || user === 'futureana735@gmail.com'  ? 'bg-[#F5F5F5] hover:bg-gray-200' : 'hidden'}`}>${pay}</h2>
            </div>
            <div>
                <h2 className={` font-semibold ${(userOrders?.includes(order) || user === 'futureana735@gmail.com') && show !== order ? 'text-gray-400' : show === order && ( userOrders?.includes(order) || user === 'futureana735@gmail.com')? 'text-white' : userOrders?.includes(order) || user === 'futureana735@gmail.com'  ? 'bg-[#F5F5F5] hover:bg-gray-200' : 'hidden'}`}>{`${userOrders?.includes(order) || user === 'futureana735@gmail.com' ? type : ''}`}</h2>
            </div>
        </div>
    )
}

export default OrderCard
