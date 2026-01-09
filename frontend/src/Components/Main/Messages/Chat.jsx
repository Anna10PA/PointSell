
function Chat({ user }) {
    return (
        <section className="w-1/2 h-[73vh]">
            <header className="w-full flex items-center justify-between py-5 border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <img src={user?.profileUrl} alt="" className="w-14 object-cover h-14 rounded-[50%]" />
                    <h1 className="font-bold">{user?.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[50%] bg-[#039803] flex items-center justify-center text-white">
                        <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="w-10 h-10 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white">
                        <i className="fa-solid fa-video"></i>
                    </div>
                </div>
            </header>
            <section className="h-full">

            </section>
            <div className="w-full">
                <input type="text" placeholder="Write Message..." className="w-full rounded-3xl px-5 py-2 outline-[#f67f20] border border-gray-300"/>
            </div>
        </section>
    )
}

export default Chat
