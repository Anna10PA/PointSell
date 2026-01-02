import { useContext } from "react"
import Table from "../../../MiniComponents/Table"
import { Info } from "../Main"

function Costumers() {
    let { allUser } = useContext(Info)

    return (
        <>
            <main className="w-full h-[98vh] flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Costumers</h1>
                </header>
                {
                    allUser?.length > 0 ?
                        <Table
                            col1='Name'
                            col2='Orders'
                            col3='Address'
                            col4='Email'
                            col5='Spent'
                            ApiInfo={allUser} />
                        : null
                }
            </main >
        </>
    )
}

export default Costumers
