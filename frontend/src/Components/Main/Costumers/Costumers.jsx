import { useContext, useState } from "react"
import Table from "../../../MiniComponents/Table"
import { Info } from "../Main"
import BgBlack from "../../../MiniComponents/BgBlack"

function Costumers() {
    let { allUser, curentUser } = useContext(Info)
    let [itm, setId] = useState(null)
    let [openDetail, setOpenDetail] = useState(false)

    // შავი ფონი
    const sendInfo = (item, modeType) => {
        setOpenDetail(modeType)
        setId(item)
    }

    return (
        <>
            {
                openDetail ?
                    <BgBlack
                        open={() => setOpenDetail(false)}
                        func={sendInfo}
                        allInfo={itm}
                        mode={openDetail} /> : null
            }
            {
                curentUser?.position === 'Manager' ?
                    <main className="w-full h-[98vh] flex flex-col px-10 py-5 gap-5 max-sm:px-3 max-sm:py-2 max-sm:gap-2">
                        <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                            <h1 className="text-3xl font-bold max-sm:text-[25px]">
                                Costumers</h1>
                        </header>
                        {
                            allUser?.length > 0 ?
                                <Table
                                    col1='Name'
                                    col2='Orders'
                                    col3='Address'
                                    col4='Email'
                                    col5='Spent'
                                    ApiInfo={allUser}
                                    func={sendInfo}
                                />
                                : null
                        }
                    </main >
                    : <main className="flex w-full h-[98vh] items-center justify-center flex-col gap-3">
                        <video loop autoPlay muted>
                            <source src='/not_found.mp4' type="video/mp4" />
                        </video>
                        <h1 className="text-gray-400 text-2xl font-bold">You can't view this page</h1>
                    </main>
            }
        </>
    )
}

export default Costumers
