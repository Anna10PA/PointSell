import { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Info } from '../Main'
import { useNavigate } from 'react-router-dom'

function GetCode() {
    let { curentUser } = useContext(Info)
    let { register, handleSubmit, formState: { errors } } = useForm()
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState("")
    let navigate = useNavigate()

    useEffect(() => {
        if (curentUser?.block) {
            navigate('/')
        }
    }, [curentUser])


    let onVerifySubmit = async (data) => {
        setLoading(true)
        setError("")

        try {
            let res = await fetch('http://localhost:5000/reset_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 'code': data.code })
            })

            let result = await res.json()
            setLoading(false)
            if (res.ok) {
                navigate('reset_password', {state: curentUser.email})
            } else {
                setError(result.error)
            }
            
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <section className='w-full h-[56vh] flex flex-col items-start gap-10'>
            <div >
                <h1 className='font-bold text-[27px]'>Verification</h1>
                <p className='text-gray-400'>Check your email! You will get code. Enter a verify code.</p>
            </div>
            <form className='flex items-start gap-5 flex-col w-full' onSubmit={handleSubmit(onVerifySubmit)} onChange={() => {
                setError("")
            }}>
                <div className='flex items-end w-full gap-3'>
                    <div className='flex flex-col items-start gap-2 w-full'>
                        <label htmlFor="" className='font-bold'>Code</label>
                        <input type="text" className='border border-gray-400 rounded-lg outline-[#f67f20] px-5 py-2 w-full' placeholder='Enter a Verify code' {...register('code', {
                            required: 'Enter Verify Code'
                        })}
                        />
                    </div>
                    <button type='submit' disabled={loading} className='bg-[#f67f20] font-bold text-white px-7 py-2 text-md rounded-lg cursor-pointer duration-200 hover:bg-orange-400'>Submit</button>
                </div>
                <span className='text-red-600 font-semibold'>{error ? error : errors?.code ? errors.code.message : ''}</span>
            </form>
        </section>
    )
}

export default GetCode
