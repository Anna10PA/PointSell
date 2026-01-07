import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { Info } from "../Main"

function Password() {
  let { register, formState: { errors }, handleSubmit } = useForm()
  let { curentUser } = useContext(Info)
  let navigate = useNavigate()
  let [loading, setLoading] = useState(false);


  // მთავარი გაგზავნის ფუნქცია
  const onSubmit = async (Data) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/verification_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: Data.email }),
        credentials: 'include'
      })

      // let data = await response.json()
      if (response.ok) {
        navigate('verify', { state: { email: Data.email } })
      } else {
        console.error('Something went wrong')
      }
    } catch (error) {
      console.error('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <section>
      <div className='min-h-[12vh]'>
        <div className='leading-10'>
          <h1 className='text-[27px] font-bold'>Password Update</h1>
          <p className='text-gray-400'>If you forgot password or want change it, verify your email and change</p>
        </div>
      </div>
      <section className='h-[65vh] w-full flex flex-col gap-20 items-start overflow-auto py-6'>
        <form className='w-full flex items-start flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col items-start gap-2'>
            <div className='flex flex-col items-start gap-2 w-full'>
              <label htmlFor="" className='font-bold'>Email</label>
              <div className="flex items-center gap-3 w-full">
                <input type="email" className={`border outline-[#f67f20] px-4 py-3 rounded-lg w-full ${errors.email ? 'border-red-600' : 'border-gray-400'}`} placeholder='Enter Email' {...register('email', {
                  required: 'Enter your account email',
                  validate: (e) => {
                    if (e !== curentUser.email) return 'Enter your account email'
                    return true
                  }
                })} />
                <button type='submit' disabled={loading} className="bg-[#f67f20] text-white px-5 py-3 rounded-lg disabled:opacity-50 font-bold duration-200 hover:bg-orange-400 cursor-pointer mt">Submit</button>
              </div>
            </div>
          </div>
          <span className='text-red-600 font-semibold'>{errors.email ? errors.email.message : null} </span>
        </form>
        <p className="text-gray-400">After change your password you can't use old password. but if verify code was wrong 3 times your account will be blocked and only Manager can unblock you.</p>
      </section>
    </section>
  )
}

export default Password
