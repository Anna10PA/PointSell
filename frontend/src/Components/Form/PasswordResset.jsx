import { useForm } from 'react-hook-form'

function PasswordResset() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      newPassword: '',
      password: '',
    }
  })

  console.log(watch('email'))
  console.log(errors)
  return (
    <div className='flex flex-col items-start gap-7 border-l border-gray-200 px-[60px] py-5 max-w-[500px] max-md:px-10 h-full '>
      <h1 className='font-bold text-[30px]'>Reset Password</h1>
      <form action="" className='flex items-start gap-5 flex-col w-full justify-between' onSubmit={handleSubmit((data) => {
        console.log(data)
      })}>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-lock text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="password" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='New Password'
            {...register('newPassword', {
            required: 'Enter password', minLength: {
              value: 8,
              message: 'Min length is 8'
            }
          })}  />
        </div>
        <p>{errors.newPassword ? errors.newPassword.message : ''}</p>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-lock text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="Confirm Password" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='Password' {...register('password', {
            required: 'Enter password', minLength: {
              value: 8,
              message: 'Min length is 8'
            }
          })} />
        </div>
        <p>{errors.password ? errors.password.message : ''}</p>
        <button className='bg-[#F67F20] text-white font-bold px-5 rounded w-full py-2.5 cursor-pointer duration-200 hover:bg-orange-500'>Change Password</button>
      </form>


    </div>
  )
}

export default PasswordResset
