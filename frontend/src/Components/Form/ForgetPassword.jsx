import { useForm } from 'react-hook-form'

function ForgetPassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
    }
  })

  console.log(watch('email'))
  console.log(errors)
  return (
    <div className='flex flex-col items-start gap-7 border-l border-gray-200 px-[60px] py-5 w-full max-w-[500px] max-md:px-10'>
      <h1 className='font-bold text-[30px]'>Forget Password</h1>
      <p>Please enter your email address below you will receive a verification code</p>
      <form action="" className='flex items-start gap-5 flex-col w-full' onSubmit={handleSubmit((data) => {
        console.log(data)
      })}>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-at text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="email" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='Email Address'
            {...register('email', { required: 'Enter email' })
            } />
        </div>
        <p>{errors.email ? errors.email.message : ''}</p>
        
        <button className='bg-[#F67F20] text-white font-bold px-5 rounded w-full py-2.5 cursor-pointer duration-200 hover:bg-orange-500'>Continue</button>
      </form>
    </div>
  )
}

export default ForgetPassword
