import { Info } from "../Main"
import { useContext, useState } from "react"
import Card from "./Card"
import { useForm } from "react-hook-form"

function Work() {
    let { curentUser } = useContext(Info)
    let [value, setValue] = useState(0)
    let { handleSubmit } = useForm()
    let [cands, setCands] = useState([])


    // სამსახურის დაწყება
    let startWork = async () => {
        let res = await fetch('https://pointsell-4.onrender.com/start_work', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: curentUser?.email,
                text: value
            })
        })
    }

    // კანდიდატების ნახვა
    let candidats = async () => {
        let res = await fetch('https://pointsell-4.onrender.com/candidats', {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            let result = await res.json()
            setCands(result)
        }
    }

    return (
        <main className="w-full h-[98vh] flex flex-col px-10 py-5 max-sm:px-3 max-sm:py-2">
            <header className="flex items-center justify-between gap-5 min-h-[10vh]">
                <h1 className="text-3xl font-bold max-sm:text-[25px]">{curentUser?.position === 'Customer' ? 'Start Work' : 'Job Candidates'}</h1>
            </header>
            <section className='w-full flex items-start gap-5 max-lg:flex-col overflow-auto '>
                {
                    curentUser?.position === 'Customer' ?
                        <form className="w-full flex flex-col items-start gap-3" onSubmit={handleSubmit(startWork)}>
                            <h2 className="font-semibold">Why do you want to work at our company?</h2>
                            <textarea name="" id="" className="border border-gray-400 rounded px-3 py-2 w-full min-h-15 max-h-50 outline-[#f67f20]" placeholder="Your answer . . . " onChange={(e) => {
                                setValue(e.target.value.trim())
                            }}></textarea>
                            <button type="submit" disabled={value.length === 0} className="bg-[#f67f20] text-white px-5 py-3 rounded font-bold disabled:bg-gray-400 cursor-pointer disabled:cursor-default">Submit</button>
                        </form> : <div>
                            {
                                cands?.length > 0 ?
                                    cands?.map((item, index) => {
                                        console.log(item)
                                    })
                                    : null
                            }
                        </div>

                }
            </section>

        </main>
    )
}

export default Work
