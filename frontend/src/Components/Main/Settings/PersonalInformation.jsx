import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Info } from '../Main'
import User from '../../../MiniComponents/User'


function PersonalInformation() {
    let [view, setView] = useState(false)
    let { curentUser, allUser } = useContext(Info)
    let registerDay = new Date(curentUser?.registration_date)
    let currentTime = new Date()
    let [friend, setFriend] = useState([])
    let time = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1}-${currentTime.getDate()}`


    let [disabled, setDisabled] = useState(true)
    let { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullname: curentUser?.name,
            email: curentUser?.email,
            phone: curentUser?.phone,
            address: curentUser?.address,
            birthday: curentUser?.birthday,
            date: curentUser?.date
        }
    })


    useEffect(() => {
        if (curentUser) {
            reset({
                fullname: curentUser.name,
                email: curentUser.email,
                phone: curentUser.phone,
                address: curentUser.address,
                date: curentUser.date
            })
        }
    }, [curentUser, reset])


    useEffect(() => {
        if (curentUser?.friends && allUser) {
            let foundFriends = allUser.filter(user =>
                curentUser?.friends?.map(e => e.toLowerCase()).includes(user.email.toLowerCase())
            )
            setFriend(foundFriends)
        }
    }, [curentUser, allUser])


    let getNext7Day = (start) => {
        let result = []
        let date = new Date(start)

        for (let i = 0; i < 7; i++) {
            let itemDate = new Date(date)
            itemDate.setDate(itemDate.getDate() + i)
            result.push(`${itemDate.getFullYear()}-${itemDate.getMonth() + 1}-${itemDate.getDate()}`)
        }
        return result
    }

    return (
        <section>
            <div className='min-h-[12vh]'>
                <div className='leading-10'>
                    <h1 className='text-[27px] font-bold'>Personal Information</h1>
                    <p className='text-gray-400'>Detailed information about you that only you can see.</p>
                </div>
            </div>
            <section className='h-[65vh] w-full flex flex-col gap-20 items-start overflow-auto py-6'>
                <div className='w-full h-[65vh] flex items-center flex-col gap-3 justify-center'>
                    <h2 className='font-bold text-2xl text-center w-full'>Card Info</h2>
                    <div className='w-full grid grid-cols-2 justify-items-center items-center'>
                        <div className='w-max px-10 flex items-center flex-col justify-center gap-3 h-75'>
                            <div className="group w-[210px] h-35 ">
                                <div className={`relative w-full h-full duration-500 transform-3d ${view ? 'transform-[rotateY(180deg)]' : ''}`}>

                                    <div className="absolute ">
                                        <img src="/card_2.jpg" alt="card" className='w-full h-full rounded-xl object-cover' />
                                    </div>

                                    <div className="absolute h-full w-full rounded-xl bg-[#D77723] flex items-center justify-center transform-[rotateY(180deg)] backface-hidden hover:bg-[#f67f20] duration-200">
                                        <h1 className='text-white font-bold text-3xl'>${curentUser?.money?.toFixed(2)}</h1>
                                    </div>

                                </div>
                            </div>
                            <button
                                className={`hover:bg-[#f67f20] hover:text-white hover:border-none px-7 py-2 rounded cursor-pointer border border-gray-400 font-bold text-md duration-200 active:scale-95`}
                                onClick={() => setView(!view)}
                            >
                                {view ? "Hide Balance" : "View Balance"}
                            </button>
                        </div>
                        <div className='flex items-center gap-3 flex-col'>
                            <div className='h-20 w-20 rounded-[50%] bg-[#f67f20] flex items-center justify-center text-white font-bold text-3xl'>
                                <h1>{curentUser?.visit?.length}</h1>
                            </div>
                            <p className='text-gray-400'>Visit our website everyday and receive Gifts!</p>
                            <div className='flex items-center gap-3'>
                                {
                                    getNext7Day(time).map((item, index) => {
                                        let result = item.split('-')[2] % 3 === 0 && index !== 0 ? '🎁' : index === 0 ? 'Used' : curentUser?.position === 'Customer' ? '$100' : curentUser?.position === 'Worker' ? '$300' : curentUser?.position === 'Manager' ? '$500' : null

                                        return <div className='flex flex-col gap-3 items-center' key={index}>
                                            <div className={`${index === 0 ? 'bg-[#f67f20]' : 'bg-gray-400'} h-10 w-10 rounded-[50%] flex items-center justify-center font-bold text-white`} key={index}>{item.split('-')[2]}</div>
                                            <span className={`${result === 'Used' ? 'text-[#f67f20]' : 'text-gray-400'} font-semibold`}>{result}</span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-around w-full '>
                        <h1 className='font-semibold text-gray-400'>
                            Spent: ${curentUser?.spent}
                        </h1>
                        <h1 className='font-semibold text-gray-400'>
                            Registration Date: {registerDay ? String(registerDay).split(' ').slice(1, 4).join(" ") : null}
                        </h1>
                        <h1 className='font-semibold text-gray-400'>
                            Current Date: {time ? String(new Date(time)).split(' ').slice(1, 4).join(" ") : 'hi'}
                        </h1>
                    </div>
                </div>
                <div className='w-full h-[60vh]'>
                    <h2 className='font-bold text-2xl text-center'>Accaunt Info</h2>
                    <form className='w-full grid py-10 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center items-center' onSubmit={handleSubmit(async (data) => {
                        let res = await fetch('http://localhost:5000/change_user_info', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                email: curentUser.email,
                                phone: data.phone,
                                address: data.address,
                                name: data.fullname,
                                date: data.date
                            })
                        })

                        if (res.ok) {
                            alert('Work!')
                        }
                    })}>
                        <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor="" className='font-bold'>Fullname</label>
                            <input type="text" className='border border-gray-400 outline-[#f67f20] rounded-lg px-5 py-3 disabled:text-gray-400' placeholder='Enter Fullname' disabled={disabled} {...register('fullname', {
                                validate: (date) => {
                                    for (let i of date) {
                                        if (!'qwertyuioplkjhgfdsazxcvbnm '.includes(i.toLowerCase())) {
                                            return 'Must be latter'
                                        }
                                    }
                                    return true
                                }
                            })} />
                            <span className='text-red-600'>{errors?.fullname ? errors?.fullname.message : ''}</span>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor="" className='font-bold'>Email</label>
                            <input type="text" className='border border-gray-400 outline-[#f67f20] rounded-lg px-5 py-3 disabled:text-gray-400' placeholder='Enter Email' disabled {...register('email')} />
                            <span></span>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor="" className='font-bold'>Address</label>
                            <input type="text" className='border border-gray-400 outline-[#f67f20] rounded-lg px-5 py-3 disabled:text-gray-400' placeholder='Enter Address' disabled={disabled} {...register('address', {
                                required: (curentUser?.position === 'Manager' || curentUser?.position === 'Worker')
                                    ? "Enter Your Address"
                                    : false
                            }
                            )} />
                            <span className='text-red-600 font-semibold'>{errors?.address ? errors?.address?.message : ''}</span>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor="" className='font-bold'>Phone Number</label>
                            <input type="text" className='border border-gray-400 outline-[#f67f20] rounded-lg px-5 py-3 disabled:text-gray-400' placeholder='Enter Phone' disabled={disabled} {...register('phone', {
                                validate: (data) => {
                                    for (let i of data) {
                                        if (!'0123456789'.includes(i)) {
                                            return 'Must be number'
                                        }
                                    }
                                    if (data.length !== 9 || data[0] != 5) {
                                        return 'Must Have 9 Symbol and start number 5'
                                    }
                                    return true
                                }
                            })} />
                            <span className='text-red-600'>{errors.phone ? errors.phone.message : ''}</span>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor="" className='font-bold'>Birthday</label>
                            <input type="date" className='border border-gray-400 outline-[#f67f20] rounded-lg px-5 py-3 disabled:text-gray-400' disabled={disabled} {...register('date')} />
                            <span className='text-red-600'>{errors.date ? errors.date.message : ''}</span>
                        </div>
                        <button
                            type='submit'
                            className='w-full h-12 mt-5 cursor-pointer font-bold text-white rounded-lg bg-[#f67f20] active:scale-95 duration-200 '
                            onClick={() => setDisabled(!disabled)}>
                            {disabled ? 'Edit' : 'Save'}
                        </button>
                    </form>
                </div>
                <div className='w-full min-h-[60vh] overflow-auto rounded-xl relative p-4'>
                    <table className="w-full border-collapse h-[40vh]">
                    <thead className='w-full flex justify-center items-center sticky top-0 bg-white'>
                        <tr className='w-full'>
                            <th className='w-full flex items-center justify-center'>
                                <h2 className='font-bold text-2xl text-center'>Friends List</h2>
                                <h3 className='absolute right-3 text-gray-400'>Found: ({friend?.length})</h3>
                            </th>
                        </tr>
                    </thead>
                        <tbody>
                            {friend?.length > 0 ? (
                                friend.map((item, index) => (
                                    <User
                                        key={index}
                                        name={item.name || item.email.split('@')[0]}
                                        email={item.email}
                                        image={item.profileUrl}
                                        myEmail={curentUser?.email}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-10 text-gray-400">
                                        No friends found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    )
}

export default PersonalInformation