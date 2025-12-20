import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { GoogleLogin } from '@react-oauth/google'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  })

  let [message, setMessage] = useState('')
  let navigation = useNavigate()

  let googleLoginFunc = async (resu) => {
    try {
      let res = await fetch('http://localhost:5000/google_login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resu.credential }),
        credentials: 'include'
      });

      let data = await res.json()

      if (res.ok) {
        navigation('/home')
      } else {
        setMessage(data.error || 'Google Login Failed')
      }
    } catch (e) {
      console.error(e)
      setMessage("Error with server")
    }
  }

  return (
    <div className='flex w-full flex-col items-start gap-7 border-l border-gray-200 px-[60px] py-5 max-w-[500px] max-md:px-10'>
      <h1 className='font-bold text-[30px]'>Welcome back!</h1>
      <form action="" className='flex items-start gap-5 flex-col w-full' onSubmit={handleSubmit(
        async (data) => {
          try {

            let result = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
              credentials: 'include'
            })

            let final = await result.json()

            if (result.ok) {
              navigation('/home')
            } else {
              setMessage(final.error || 'Something went wrong')
            }
          }
          catch (e) {
            console.error(e)
          }
        })}>

        <div className='w-full flex items-start flex-col gap-2'>

          <div className='flex items-center relative w-full'>
            <i className="fa-solid fa-at text-[#F67F20] absolute left-3 top-3.5"></i>
            <input type="email" className={`border border-gray-300 rounded px-10 py-2 outline-none w-full ${!errors.email ? 'border-gray-300' : 'border-red-600'}`} placeholder='Email Address'
              {...register('email', { required: 'Enter email' })
              } />
          </div>
          <p className='text-[red] font-semibold'>{errors.email ? errors.email.message : ''}</p>
        </div>

        <div className='w-full flex items-start flex-col gap-2'>
          <div className='flex items-center relative w-full'>
            <i className="fa-solid fa-lock text-[#F67F20] absolute left-3 top-3.5"></i>
            <input type="password" className={`border border-gray-300 rounded px-10 py-2 outline-none w-full ${!errors.password ? 'border-gray-300' : 'border-red-600'}`} placeholder='Password' {...register('password', {
              required: 'Enter password', minLength: {
                value: 8,
                message: 'Min length is 8'
              }
            })} />
          </div>
          <p className='text-[red] font-semibold'>{errors.password ? errors.password.message : ''}</p>
        </div>
        <Link to='/forgot password' className='font-semibold max-md:text-[15px] leading-5 text-[#F67F20] text-right w-full'>
          <h2 >Forgot password?</h2>
        </Link>
        <button className='bg-[#F67F20] text-white font-bold px-5 rounded w-full py-2.5 cursor-pointer duration-200 hover:bg-orange-500'>Login</button>
      </form>
      <h1 className={`${message ? 'bg-[red] px-7 py-2 text-white font-bold tracking-[1px] rounded' : 'hidden'}`}>{message}</h1>
      <div className='flex items-center justify-center w-full gap-5 flex-wrap max-md:justify-center max-md:gap-3'>
          <GoogleLogin
            onSuccess={googleLoginFunc}
            onError={() => setMessage('Google Login Failed')}
            width={250}
          />
  
      </div>
      <h2 className='font-semibold text-center w-full'>Don't you have a account?
        <Link to='/registration'>
          <span className='text-[#F67F20] cursor-pointer'> Sign Up</span>
        </Link>
      </h2>
    </div>
  )
}

export default Login
