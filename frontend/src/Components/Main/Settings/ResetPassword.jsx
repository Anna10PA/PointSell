import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { Info } from '../Main'

function ResetPassword() {
    let { handleSubmit, register, formState: { errors }, watch } = useForm()
    let password = watch('new_password')
    let { curentUser, resetPassword } = useContext(Info)

    return (
        <section className='w-full h-[56vh] flex flex-col items-start gap-10'>
            <div >
                <h1 className='font-bold text-[27px]'>Reset Password</h1>
                <p className='text-gray-400'>Verification successful! Enter a new password</p>
            </div>
            <form onSubmit={handleSubmit((data) => {
                resetPassword(curentUser?.email, data?.new_password)
            })} className='w-full flex flex-col items-start gap-5'>

                <div className='flex flex-col gap-2 items-start w-full'>
                    <label htmlFor="" className='font-bold'>New Password</label>
                    <input type="password" {...register('new_password', {
                        required: 'Enter New Password',
                        validate: (v) => {
                            if (v.length < 8) return "Must Be More Then 8 Symbol and Contain Number"
                            for (let i of v) {
                                if ('1234567890'.includes(i)) {
                                    return true
                                }
                            }
                            return 'Must Contain Number'
                        }
                    })} className={`border outline-[#f67f20] px-4 py-3 rounded-lg w-full ${errors.new_password ? 'border-red-600' : 'border-gray-400'}`} placeholder='Enter New Password' />
                    <span className='text-red-600 font-semibold'>{errors?.new_password ? errors?.new_password.message : ''}</span>
                </div>
                <div className='w-full flex flex-col gap-2 items-start'>
                    <label htmlFor="" className='font-bold'>Confirm Password</label>
                    <input type="password" {...register('confirm_password', {
                        required: "Confirm Password",
                        validate: (e) => {
                            if (e !== password) {
                                return "Must Have Same Value"
                            }
                            return true
                        }
                    })} className={`border outline-[#f67f20] px-4 py-3 rounded-lg w-full ${errors.confirm_password ? 'border-red-600' : 'border-gray-400'}`} placeholder='Confirm Password' />
                    <span className='text-red-600 font-semibold'>{errors.confirm_password ? errors.confirm_password.message : ''}</span>
                </div>
                <button className='w-full bg-[#f67f20] text-white px-10 py-3 rounded text-md font-bold cursor-pointer duration-100 hover:bg-orange-400' type='submit'>Submit</button>
            </form>
        </section>
    )
}

export default ResetPassword
