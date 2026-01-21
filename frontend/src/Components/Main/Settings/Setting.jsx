import { Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom'
import { useContext } from 'react'

import { Info } from '../Main'

import ResetPassword from './ResetPassword'
import PersonalInformation from './PersonalInformation'
import EmployeeInformation from './EmployeeInformation'
import Password from './Password'
import GetCode from './GetCode'

function Setting() {
    let location = useLocation()
    let locationName = location.pathname
    let { curentUser } = useContext(Info)
    let navigate = useNavigate()

    async function log_out() {
        let res = await fetch('https://pointsell-4.onrender.com/log_out', {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({ 'is_login': false })
        })

        if (res.ok) {
            navigate('/', {
                replace: true
            })
        }
    }

    return (
        <main className="w-full h-[98vh] flex flex-col px-10 py-5">
            <header className="flex items-center justify-between gap-5 min-h-[10vh]">
                <h1 className="text-3xl font-bold">Setting</h1>
            </header>
            <section className='w-full flex items-start gap-5'>
                <section className='border border-gray-300 rounded-lg h-full p-5 flex flex-col items-start gap-9 w-[40%]'>
                    <div className='flex items-center justify-center flex-col gap-3 border-b h-[33vh] border-gray-300 w-full '>
                        <div className='w-35 h-35 relative '>
                            <img src="https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg" className='w-full h-full object-cover rounded-[50%]' alt="" />
                            <div className='w-10 h-10 flex items-center justify-center bg-[#f67f20] rounded-[50%] text-white absolute top-2 -right-1 border-3 border-white'>
                                <i className="fa-solid fa-pen"></i>
                            </div>
                        </div>
                        <div className='text-center'>
                            <h1 className='font-bold text-2xl'>{curentUser?.name || curentUser?.email.split('@')[0]}</h1>
                            <p className='font-semibold text-gray-400'>{curentUser?.position}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start gap-4'>
                        <Link to="/main/setting" className="w-full">
                            <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName == '/main/setting' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'}`}>
                                <h1 className='font-bold'>Personal Information</h1>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        </Link>
                        <Link to="/main/setting/employers_information" className="w-full">
                            <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName == '/main/setting/employers_information' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'}`}>
                                <h1 className='font-bold'>Employee Information</h1>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        </Link>
                        <Link to="/main/setting/password" className="w-full">
                            <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName === '/main/setting/password' || locationName === '/main/setting/password/verify' || locationName === '/main/setting/password/verify/reset_password' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'}`}>
                                <h1 className='font-bold'>Password</h1>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        </Link>
                        <button className='px-5 py-3 text-[#f67f20] font-bold text-lg duration-100 hover:bg-[#f67f20] hover:text-white cursor-pointer rounded' onClick={log_out}>Log out</button>
                    </div>
                </section>
                <section className='w-[60%]'>
                    <Routes>
                        <Route index element={<PersonalInformation />} />
                        <Route path='employers_information' element={<EmployeeInformation />} />
                        <Route path='password' element={<Password />} />
                        <Route path='password/verify' element={<GetCode />} />
                        <Route path='password/verify/reset_password' element={<ResetPassword />} />
                    </Routes>
                </section>
            </section>
        </main >
    )
}

export default Setting
