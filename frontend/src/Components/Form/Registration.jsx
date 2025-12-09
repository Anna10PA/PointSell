import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

function Registration() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  console.log(watch('email'))
  console.log(errors)
  return (
    <div className='flex flex-col items-start w-full gap-7 border-l border-gray-200 px-[60px] py-5 max-w-[500px] max-md:px-10'>
      <h1 className='font-bold text-[30px]'>Registration</h1>
      <form action="" className='flex items-start gap-5 flex-col' onSubmit={handleSubmit((data) => {
        console.log(data)
      })}>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-at text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="email" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='Email Address'
            {...register('email', { required: 'Enter email' })
            } />
        </div>
        <p>{errors.email ? errors.password.email : ''}</p>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-lock text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="password" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='Password' {...register('password', {
            required: 'Enter password', minLength: {
              value: 8,
              message: 'Min length is 8'
            }
          })} />
        </div>
        <p>{errors.password ? errors.password.message : ''}</p>
        <div className='flex items-center relative w-full'>
          <i className="fa-solid fa-lock text-[#F67F20] absolute left-3 top-3.5"></i>
          <input type="password" className='border border-gray-300 rounded px-10 py-2 outline-none w-full' placeholder='Confirm Password' {...register('confirm_password', {
            required: 'Confirm password', minLength: {
              value: 8,
              message: 'Min length is 8'
            }
          })} />
        </div>
        <p>{errors.confirm_password ? errors.confirm_password.message : ''}</p>
        <h2 className='font-semibold max-md:text-[15px] leading-5'>By signing below, you agree to the, <span className='text-[#F67F20]'>Team of use</span> and <span className='text-[#F67F20]'>privacy notice</span></h2>
        <button className='bg-[#F67F20] text-white font-bold px-5 rounded w-full py-2.5 cursor-pointer duration-200 hover:bg-orange-500'>Sign Up</button>
      </form>
      <h2 className='font-semibold text-center w-full'>Already have an account?
        <Link to='/'>
          <span className='text-[#F67F20] cursor-pointer'> Login</span>
        </Link>
      </h2>
    </div>
  )
}

export default Registration
