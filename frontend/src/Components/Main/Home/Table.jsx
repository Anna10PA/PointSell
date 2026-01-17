import ProductAndChack from "./ProductAndChack"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import DiscountNitification from "./DiscountNitification"
import BgBlack from "../../../MiniComponents/BgBlack"

function Table() {
    let [curentUser, setCurentUser] = useState(null)
    let { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
        mode: "onBlur"
    })
    let [deliverInfo, setDeliverInfo] = useState({ distance: 0, duration: 0 })
    let navigate = useNavigate()
    let promoCode = 'HelloUser2009'
    let [openMessage, setOpenMessage] = useState(false)
    let [gotDisc, setGotDisc] = useState(false)
    let [submit, setSubmit] = useState(false)


    // ამჟამინდელი მომხმარებლის ინფორმაცია
    useEffect(() => {
        let getUserInfo = async () => {
            let result = await fetch('https://pointsell-4.onrender.com/get_current_user', {
                method: 'GET',
                credentials: 'include'
            })
            let final = await result.json()
            if (result.ok) {
                setCurentUser(final)
                reset({
                    name: final.name || '',
                })
            }
        }

        getUserInfo()
    }, [reset])


    // გადახდა
    let promoCodeInput = watch('promo_code')
    let subtotal = Number(curentUser?.curent_cart?.sum?.subtotal) || 0
    let change = Number(curentUser?.curent_cart?.sum?.change) || 0
    let discount = Number(curentUser?.curent_cart?.sum?.discount) || 0

    let sum = subtotal + change - discount
    let discountValue = discount

    if (promoCodeInput === promoCode) {
        discountValue = (sum * 0.95).toFixed(2)
    }

    let arr = []
    for (let i = 0; i <= 70; i++) {
        arr.push(i)
    }


    useEffect(() => {
        if (promoCodeInput === promoCode) {
            setOpenMessage(true)
            setGotDisc(true)
        } else {
            setOpenMessage(false)
            setGotDisc(false)
        }
    }, [promoCodeInput])

    let onSubmit = async (data) => {
        setSubmit(true)
        let orderData = {
            order_number: curentUser?.curent_cart?.order,
            subtotal: subtotal,
            change: change,
            discount: Number(discountValue),
            table: data.table_number,
            name: data.name
        }

        try {
            let response = await fetch('https://pointsell-4.onrender.com/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
                credentials: 'include'
            })

            let result = await response.json()
            if (response.ok) {
                navigate('/main/order/table/payment', {
                    state: {
                        text: result.success,
                        order: curentUser?.curent_cart?.order,
                        isPay: true
                    },
                    replace: true
                })
                setSubmit(false)
            } else {
                navigate('/main/order/table/payment', {
                    state: {
                        text: result.error,
                        isPay: false
                    },
                    replace: true
                })
                setSubmit(false)
            }
        } catch (error) {
            console.error(error)
            navigate('/main/order/table/payment', {
                state: {
                    text: "Connection error with server",
                    isPay: false
                },
                replace: true
            })
            setSubmit(false)
        }
    }

    return (
        <>
            {
                openMessage ?
                    < DiscountNitification close={() => {
                        setOpenMessage(false)
                    }} />
                    : null
            }
            {
                submit ?
                    <BgBlack /> : null
            }
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] relative">
                    <h1 className="text-3xl font-bold">
                        Order #{curentUser ?
                            curentUser?.curent_cart?.order?.toUpperCase() : 'Loading . . . '}
                    </h1>
                    <Link to='/main/order'>
                        <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] cursor-pointer hover:bg-orange-400 duratuion-100'>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                </header>
                <form className="flex flex-col gap-3 justify-between h-[70vh]" onSubmit={handleSubmit((data) => {
                    onSubmit(data)
                })}>
                    <div className='grid grid-cols-3 gap-5'>
                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="fullname" className='font-bold text-lg'>
                                Recipent:
                            </label>
                            <input type="text" placeholder='Enter Fullname' name='fullname' id='fullname' className={` border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] ${errors.name ? 'border-red-600 border-2' : 'border-gray-400'}`}
                                {...register('name',
                                    {
                                        required: 'Enter fullname',
                                        validate: (element) => {
                                            for (let i of element) {
                                                if (!'qwertyuiopasdfghjklzxcvbnm '.includes(i.toLowerCase())) {
                                                    return 'Must be text'
                                                }
                                            }
                                            return true
                                        }
                                    })}
                            />
                            <span className='text-[red] font-semibold'>{errors.name ? errors.name.message : ''}</span>
                        </div>

                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="Code" className='font-bold text-lg'>
                                Code:
                            </label>
                            <div className='w-full flex items-center gap-3'>
                                <input type="text" placeholder='Enter Code' name='Code' id='Code' className={`border-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] 
                                ${errors.promo_code ? 'border-red-600 border-2' : 'border-gray-400 '}`}
                                    {...register('promo_code', {
                                        validate: (value) => {
                                            if (value.trim() === "") {
                                                return true
                                            }
                                            return value === promoCode || 'Code is not correct'
                                        }
                                    })} />
                            </div>
                            <span className='text-[red] font-semibold'>{errors.promo_code ? errors.promo_code.message : ''}</span>
                        </div>

                        <div className='flex items-start gap-3 flex-col'>
                            <label htmlFor="" className='font-bold text-lg'>Table</label>
                            <select name="" id="" className={`w-full border px-4 rounded-lg py-2.5 text-gray-500 outline-[#f67f20]  ${errors.table_number ? 'border-red-600 border-2' : 'border-gray-400 '}`} {...register('table_number', {
                                required: 'Choose a table number',
                                validate: (e) => {
                                    if (e === 'select') {
                                        return 'Choose a table number'
                                    }
                                    return true
                                }
                            })}>
                                <option value="select" disabled selected>Table Number</option>
                                {
                                    arr?.map((item, index) => {
                                        return <option value={`${item}`} key={index} >{item}</option>
                                    })
                                }
                            </select>
                            <span className='text-[red] font-semibold'>{errors.table_number ? errors.table_number.message : ''}</span>
                        </div>

                    </div>
                    <ProductAndChack curentUser={curentUser} tax={deliverInfo.distance ? (deliverInfo.distance * 2 + 1.5) : 1.5} discount={discountValue} hasVIPDiscount={gotDisc} />
                </form>
            </main>
        </>
    )
}

export default Table
