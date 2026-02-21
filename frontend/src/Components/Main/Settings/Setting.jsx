import { Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom'
import { useContext, useRef, useState, useEffect } from 'react'

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
    let image = useRef()
    let [currentImage, setCurrentImage] = useState(curentUser?.profileUrl || "https://i.pinimg.com/736x/3d/39/c3/3d39c364105ac84dfc91b6f367259f1a.jpg")


    // პროფილის სურათის ჩატვირთვა
    useEffect(() => {
        if (curentUser?.profileUrl) {
            setCurrentImage(curentUser?.profileUrl)
        }
    }, [curentUser])


    // საიტიდან გასვლა
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


    // სურათის შეცვლის ფუნქცია
    async function change(file_name) {
        try {
            let formData = new FormData()
            formData.append('image', file_name)

            let res = await fetch('https://pointsell-4.onrender.com/change_profile', {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

        } catch (e) {
            console.error(e)
        }
    }


    // სურათის ატვირთვის ფუნქცია
    let imageChangeFunc = (e) => {
        let file = e.target.files[0]
        // console.log(file)
        if (file) {
            let url = URL.createObjectURL(file)
            setCurrentImage(url)
            change(file)
        }
    }


    return (
        <main className="w-full h-[98vh] flex flex-col px-10 py-5 max-sm:px-3 max-sm:py-2">
            <header className="flex items-center justify-between gap-5 min-h-[10vh]">
                <h1 className="text-3xl font-bold max-sm:text-[25px]">Setting</h1>
            </header>
            <section className='w-full flex items-start gap-5 max-lg:flex-col overflow-auto '>
                <section className='border border-gray-300 rounded-lg h-full p-5 flex flex-col items-start gap-9 w-[40%] max-lg:w-full max-lg:h-screen max-sm:p-2'>
                    <div className='flex items-center justify-center flex-col gap-3 border-b min-h-[33vh] h-full border-gray-300 w-full'>
                        <div className='w-35 h-35 relative'>
                            <img src={currentImage} className='w-full h-full object-cover rounded-[50%]' alt="" />
                            <div className='w-10 h-10 flex items-center justify-center bg-[#f67f20] rounded-[50%] text-white absolute top-2 -right-1 border-3 border-white cursor-pointer duration-100 hover:bg-orange-500'>
                                <div className='relative w-full h-full flex items-center justify-center cursor-pointer'>
                                    <input type="file" className='w-full h-full absolute opacity-0 cursor-pointer'
                                        ref={image}
                                        accept='image/*'
                                        onChange={imageChangeFunc}
                                    />
                                    <i className="fa-solid fa-pen cursor-pointer"></i>
                                </div>
                            </div>
                        </div>
                        <div className='text-center'>
                            <h1 className='font-bold text-2xl max-sm:text-xl'>{curentUser?.name || curentUser?.email.split('@')[0]}</h1>
                            <p className='font-semibold text-gray-400 max-sm:text-sm'>{curentUser?.position}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start justify-between gap-4 max-sm:gap-3'>
                        <div className='w-full h-full flex flex-col items-start gap-5'>
                            <Link to="/main/setting" className="w-full">
                                <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName == '/main/setting' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'}`}>
                                    <h1 className='font-bold max-sm:text-[14px]'>Personal Information</h1>
                                    <i className="fa-solid fa-angle-right"></i>
                                </div>
                            </Link>
                            <Link to="/main/setting/employers_information" className={`w-full ${curentUser?.position === 'Customer' ? 'hidden' : ''}`} >
                                <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName == '/main/setting/employers_information' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'} `}>
                                    <h1 className='font-bold max-sm:text-[14px]'>Employee Information</h1>
                                    <i className="fa-solid fa-angle-right"></i>
                                </div>
                            </Link>
                            <Link to="/main/setting/password" className="w-full">
                                <div className={`flex items-center justify-between border px-5 py-3 rounded cursor-pointer  hover:bg-gray-10 ${locationName === '/main/setting/password' || locationName === '/main/setting/password/verify' || locationName === '/main/setting/password/verify/reset_password' ? 'border-[#f67f20] bg-[#f67f20] text-white' : 'border-gray-300'}`}>
                                    <h1 className='font-bold max-sm:text-[14px]'>Password</h1>
                                    <i className="fa-solid fa-angle-right"></i>
                                </div>
                            </Link>
                        </div>
                        <button className='px-5 py-3 text-[#f67f20] font-bold text-lg duration-100 max-sm:text-[14px] hover:bg-[#f67f20] hover:text-white cursor-pointer rounded' onClick={log_out}>Log out</button>
                    </div>
                </section>
                <section className='w-[60%] max-lg:w-full'>
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
