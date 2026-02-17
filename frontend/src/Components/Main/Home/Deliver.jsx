import ProductAndChack from "./ProductAndChack"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import DiscountNitification from "./DiscountNitification"
import BgBlack from "../../../MiniComponents/BgBlack"

function Deliver() {
    let [curentUser, setCurentUser] = useState(null)
    let { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
        mode: "onBlur"
    })
    let [deliverInfo, setDeliverInfo] = useState({ distance: 0, duration: 0 })
    let navigate = useNavigate()
    let promoCode = 'mekhinkleMario'
    let [openMessage, setOpenMessage] = useState(false)
    let [gotDisc, setGotDisc] = useState(false)
    let [submit, setSubmit] = useState(false)


    // ნომრის შემოწმება
    let checkNumber = async (userNumber) => {
        const numStr = String(userNumber || "")

        if (numStr.length !== 9 || !numStr.startsWith('5')) {
            return "Number must be 9 digits and start with 5"
        }

        // console.log(result)
        try {
            let APIAccessKey = '429ca27b22f96212c97dd447d8e81ddf'
            let res = await fetch(`https://apilayer.net/api/validate?access_key=${APIAccessKey}&number=995${userNumber}&country_code=GE&format=1`)
            if (res.status === 429) return true
            let result = await res.json()

            if (result.valid) {
                return true
            } else {
                return "Number is not correct"
            }

        } catch (e) {
            console.error(e)
            return true
        }
    }


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
                    number: final.phone || '',
                    address: final.address || ''
                })
            }
        }

        getUserInfo()
    }, [reset])


    // მიტანის სერვისის თანხის გამოთვლა + მისამართის შემოწმება
    let taxCount = async (userAddress) => {
        if (!userAddress) return
        try {
            let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userAddress)}&format=json&limit=1&countrycodes=ge`)
            let result = await res.json()

            if (result.length === 0) return 'Address is not correct'

            // console.log(result)
            let locLat = result[0].lat
            let locLon = result[0].lon


            let resultDeliver = await fetch(`https://router.project-osrm.org/route/v1/driving/44.7517260,41.7247267;${locLon},${locLat}?overview=false`)
            let info = await resultDeliver.json()

            if (info.code !== 'Ok') return "Sorry, not working"


            let distanceKm = info.routes[0].distance / 1000
            let durationMin = Math.round(info.routes[0].duration / 60)

            setDeliverInfo({
                distance: distanceKm,
                duration: durationMin
            })
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }


    // გადახდა
    let promoCodeInput = watch('promo_code')
    let subtotal = Number(curentUser?.curent_cart?.sum?.subtotal) || 0
    let change = Number(curentUser?.curent_cart?.sum?.change) || 0
    let tax = deliverInfo.distance ? (deliverInfo.distance * 2 + 1.5) : 1.5
    let baseDiscount = Number(curentUser?.curent_cart?.sum?.discount) || 0

    let sum = subtotal + change + tax - baseDiscount
    let discountValue = promoCodeInput === promoCode ? (sum * 0.95) : baseDiscount

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
        if (submit) return

        setSubmit(true)
        let orderData = {
            order_number: curentUser?.curent_cart?.order,
            subtotal: subtotal,
            change: change,
            discount: Number(discountValue),
            tax: tax,
            phone: Number(data.number),
            address: data.address,
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
                navigate('/main/order/deliver/payment', {
                    state: {
                        text: result.success,
                        order: curentUser?.curent_cart?.order,
                        isPay: true
                    },
                    replace: true

                })
                setSubmit(false)
            } else {
                navigate('/main/order/deliver/payment', {
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
            navigate('/main/order/deliver/payment', {
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
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5 overflow-auto max-sm:px-3 max-sm:py-2 max-sm:gap-1 ">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh] relative max-sm:min-h-[8vh]">
                    <h1 className="text-3xl font-bold max-sm:text-2xl">
                        Order #{curentUser !== null ?
                            curentUser?.curent_cart?.order?.toUpperCase() : 'Loading . . . '}
                    </h1>
                    <Link to='/main/order'>
                        <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] cursor-pointer hover:bg-orange-400 duratuion-100'>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                </header>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit((data) => {
                    onSubmit(data)
                })}>
                    <div className='grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1'>
                        <div className='flex items-start gap-3 flex-col max-md:gap-1 max-sm:col-span-2'>
                            <label htmlFor="fullname" className='font-bold text-lg max-md:text-sm'>
                                Recipent:
                            </label>
                            <input type="text" placeholder='Enter Fullname' name='fullname' id='fullname' className={` border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] ${errors.name ? 'border-red-600 border-2' : 'border-gray-400'}`}
                                {...register('name',
                                    {
                                        required: 'Enter fullname',
                                        validate: (element) => {
                                            for (let i of element) {
                                                if (!'qwertyuiopasdfghjklzxcvbnmქწერტყუიოპასდფგჰჯკლზხცვბნმჭღთშძჩ '.includes(i.toLowerCase())) {
                                                    return 'Must be text'
                                                }
                                            }
                                            return true
                                        }
                                    })}
                            />
                            <span className='text-[red] font-semibold'>{errors.name ? errors.name.message : ''}</span>
                        </div>
                        <div className='flex items-start gap-3 flex-col max-md:gap-1 max-sm:col-span-2'>
                            <label htmlFor="PhoneNumber" className='font-bold text-lg max-md:text-sm'>
                                Phone Number:
                            </label>
                            <input type="text" placeholder='Enter Phone Number' name='PhoneNumber' id='PhoneNumber' className={`order-gray-400 border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] ${errors.number ? 'border-red-600 border-2' : 'border-gray-400'}`}
                                {...register('number',
                                    {
                                        required: "Enter your Phone number",
                                        minLength: {
                                            value: 9,
                                            message: 'Must be number and min length 9'
                                        },
                                        validate: {
                                            error_1: (element) => {
                                                if (!element || typeof element !== 'string') return true
                                                for (let i of element) {
                                                    if (!'1234567890'.includes(i)) {
                                                        return 'Must be number'
                                                    }
                                                }
                                                return true
                                            },
                                            error_2: async (number) => {
                                                return await checkNumber(number)
                                            }
                                        }
                                    })} />
                            <span className='text-[red] font-semibold'>
                                {errors.number ? errors.number.message : ''}
                            </span>
                        </div>
                        <div className='flex items-start gap-3 flex-col max-md:gap-1 max-md:col-span-2'>
                            <label htmlFor="Code" className='font-bold text-lg max-md:text-sm'>
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
                        <div className='flex items-start gap-3 flex-col max-md:gap-1 max-lg:col-span-3 max-md:col-span-2'>
                            <label htmlFor="Address" className='font-bold text-lg max-md:text-sm' >
                                Address:
                            </label>
                            <textarea name="Address" id="Address" placeholder='Enter Address' className={`border rounded-lg px-4 py-2.5 w-full outline-[#f67f20] min-h-20 max-h-20 ${errors.address ? 'border-red-600 border-2' : 'border-gray-400 '}`}
                                {...register('address', { required: 'Enter Address' })}
                                onBlur={(e) => taxCount(e.target.value)}></textarea>
                            <span className='text-[red] font-semibold'>
                                {errors.address ? errors.address.message : ''}
                            </span>
                        </div>
                        <div className="rounded-lg border border-gray-400 p-4 flex items-start justify-start gap-3 w-full max-h-min max-lg:col-span-3 max-md:col-span-2 max-sm:flex-col-reverse max-sm:text-center">
                            <div className="w-[50%] max-sm:w-full ">
                                <div className="flex items-center gap-4 text-gray-400 font-semibold max-sm:justify-center max-sm:w-full">
                                    <h1>Duration:</h1>
                                    <h1>{deliverInfo.duration || "0"} m</h1>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400 font-semibold max-sm:justify-center max-sm:w-full">
                                    <h1>Distance:</h1>
                                    <h1>{Number(deliverInfo.distance || 0).toFixed(1) || '0'} km</h1>
                                </div>
                                <div className="flex items-center gap-4 text-[#f67f20] font-bold text-xl mt-3 max-sm:justify-center max-sm:w-full">
                                    <h3>Tax:</h3>
                                    <h3>{deliverInfo.distance ? Number(deliverInfo.distance * 2 + 1.5 || 0).toFixed(2) : 0}$</h3>
                                </div>
                            </div>
                            <div className="max-sm:w-full ">
                                <h3 className="font-bold text-xl">Rules:</h3>
                                <div className="mt-2 font-semibold text-gray-400">
                                    <p>Start = $1.50</p>
                                    <p>1 km = $2.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductAndChack
                        curentUser={curentUser}
                        tax={deliverInfo.distance ? Number(deliverInfo.distance * 2 + 1.5 || 0) : 1.5}
                        discount={discountValue}
                        hasVIPDiscount={gotDisc}
                        isSubmit={submit} />
                </form>
            </main>
        </>
    )
}

export default Deliver