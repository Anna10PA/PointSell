import Navigation from "../../../MiniComponents/Navigation"
import { useEffect, useState } from "react"
import Table from "../../../MiniComponents/Table"

function Costumers() {
    let [users, setUsers] = useState([])

    // ყველა მომხმარებლის მიღება
    useEffect(() => {
        let getAllUser = async () => {
            let res = await fetch('http://localhost:5000/get_all_user', {
                method: 'GET',
                credentials: 'include'
            })

            try {
                let result = await res.json()
                console.log(result)
                if (res.ok) {
                    setUsers(result)
                }
            } catch (e) {
                console.error(e)
            }
        }
        getAllUser()
    }, [])


    return (
        <>
            <Navigation />
            
            <main className="w-full h-[98vh] flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Costumers</h1>
                </header>
                {
                    users.length > 0 ?
                        <Table 
                        col1='Name'
                        col2='Orders'
                        col3='Address'
                        col4='Email'
                        col5='Spent'
                        ApiInfo={users} />
                        : null
                }
            </main >
        </>
    )
}

export default Costumers
