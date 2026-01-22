function OrderCard({ order, type, pay, userOrders, user, onClick, show }) {
    let myGmail = 'puturidzeana0210@gmail.com'

    return (
        <div className={` px-5 py-4 w-full duration-100 rounded-xl ${show === order ? 'bg-[#f67f20] hover:bg-orange-400 text-white max-md:px-2' : 'bg-[#F5F5F5] hover:bg-gray-200 cursor-pointer'}`} onClick={()=> {
            userOrders?.includes(order) || user === myGmail? onClick(order) : null
        }}>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-xl max-md:text-[16px]'>Order #{order?.toUpperCase()}</h1>
                <h2 className={`${(userOrders?.includes(order) || user === myGmail) && show !== order ? 'text-[green] font-bold' : show === order && ( userOrders?.includes(order) || user === myGmail)? 'font-bold text-white' : userOrders?.includes(order) || user === myGmail  ? 'bg-[#F5F5F5] hover:bg-gray-200' : 'hidden'}`}>${Number(pay || 0).toFixed(2)}</h2>
            </div>
            <div>
                <h2 className={` font-semibold ${(userOrders?.includes(order) || user === myGmail) && show !== order ? 'text-gray-400' : show === order && ( userOrders?.includes(order) || user === myGmail)? 'text-white' : userOrders?.includes(order) || user === myGmail  ? 'bg-[#F5F5F5] hover:bg-gray-200' : 'hidden'}`}>{`${userOrders?.includes(order) || user === myGmail ? type : ''}`}</h2>
            </div>
        </div>
    )
}

export default OrderCard
