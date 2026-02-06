function NotificationCard({time, message, date, read}) {

    let curent = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
    let messageTime = new Date(date)

    return (
        <div className="px-5 py-4 flex items-start gap-4 border-gray-300 border max-sm:p-2 w-full max-sm:gap-2">
            <div className="bg-[#F67F20] text-white rounded-[50%] w-max h-max px-4 py-3 max-sm:px-3 max-sm:py-2 text-xl max-sm:text-sm ">
                <i className="fa-solid fa-bell rotate-45"></i>
            </div>
            <div className="w-full ">
                <h1 className={`${read ? 'font-semibold text-gray-400' : 'font-bold  text-black'} text-lg max-sm:text-[12px]  w-full`}>
                    {message}
                </h1>
                <h2 className={`font-normal max-sm:text-[10px] ${read ? 'text-gray-400' : 'text-black'}`}>
                    {curent !== date ? String(messageTime).split(' ')[2] + ' '+ String(messageTime).split(' ')[1] + ' '+ (String(messageTime).split(' ')[3] == new Date().getFullYear() ? '' : String(messageTime).split(' ')[3]) : Number(time.split(':')[0]) >= 12 && Number(time.split(':')[1]) > 0? `${Number(time.split(':')[0]) != 12 ? Number(time.split(':')[0]) - 12 : 12}:${time.split(':')[1]} P.M` : `${time.split(':')[0]}:${time.split(':')[1]} A.M`}
                </h2>
            </div>
        </div>
    )
}

export default NotificationCard
