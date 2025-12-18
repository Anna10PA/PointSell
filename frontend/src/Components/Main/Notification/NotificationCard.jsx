function NotificationCard({time, message, date}) {

    let curent = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

    return (
        <div className="px-5 py-4 flex items-start gap-4 border-gray-300 border">
            <div className="bg-[#F67F20] text-white rounded-[50%] w-max h-max px-4 py-3 text-xl">
                <i className="fa-solid fa-bell rotate-45"></i>
            </div>
            <div>
                <h1 className="font-bold text-lg">
                    {message}
                </h1>
                <h2 className="font-normal">
                    {curent !== date ? date : Number(time.split(':')[0]) >= 12 && Number(time.split(':')[1]) > 0? `${Number(time.split(':')[0]) != 12 ? Number(time.split(':')[0]) - 12 : 12}:${time.split(':')[1]} P.M` : `${time.split(':')[0]}:${time.split(':')[1]} A.M`}
                </h2>
            </div>
        </div>
    )
}

export default NotificationCard
