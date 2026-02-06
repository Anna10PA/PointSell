import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { Info } from "../Main"

function Password() {
  let { register, formState: { errors }, handleSubmit } = useForm()
  let { curentUser } = useContext(Info)
  let navigate = useNavigate()

  return (
    <section>
      <div className='min-h-[12vh]'>
        <div className='leading-10 max-sm:leading-15'>
          <h1 className='text-[27px] font-bold max-sm:text-[20px]'>Password Update</h1>
          <p className='text-gray-400 leading-5 max-sm:text-sm'>If you forgot password or want change it, verify your email and change</p>
        </div>
      </div>
      <section className='h-[65vh] w-full flex flex-col gap-20 items-start overflow-auto py-6'>
        <form className='w-full flex items-start flex-col gap-4' onSubmit={handleSubmit(()=> {
          navigate('/main/setting/password/verify')
        })}>
          <div className='w-full flex flex-col items-start gap-2'>
            <div className='flex flex-col items-start gap-2 w-full'>
              <label htmlFor="" className='font-bold'>Email</label>
              <div className="flex items-center gap-3 w-full max-sm:flex-col max-sm:items-start max-sm:gap-2 ">
                <input type="email" className={`border outline-[#f67f20] px-4 py-3  max-sm:text-sm rounded-lg w-full ${errors.email ? 'border-red-600' : 'border-gray-400'}`} placeholder='Enter Email' {...register('email', {
                  required: 'Enter your account email',
                  validate: (e) => {
                    if (e !== curentUser.email) return 'Enter your account email'
                  }
                })} />
                <button type='submit' className="bg-[#f67f20] text-white px-5 py-3 rounded-lg disabled:opacity-50 font-bold duration-200 hover:bg-orange-400 cursor-pointer max-sm:px-3 max-sm:w-full max-sm:text-sm max-sm:font-semibold">Submit</button>
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
