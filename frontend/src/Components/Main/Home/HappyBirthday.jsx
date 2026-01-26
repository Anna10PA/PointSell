import { useState, useEffect } from "react"


function HappyBirthday() {
    let [endFirstVideo, setEndFirstVideo] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setEndFirstVideo(true)
        }, 6000)

        return () => clearTimeout(timer)
    }, [])
    return (
        <div className='w-full h-full absolute top-0 right-0 z-90 bg-[rgba(0,0,0,0.77)] flex items-center justify-center'>
            <div>
                <video autoPlay muted className={`${endFirstVideo ? 'hidden' : 'block'}`}>
                    <source src='/happy_birthday.mp4' type='video/mp4' />
                </video>

                <video loop autoPlay muted className={`${endFirstVideo ? 'block' : 'hidden'}`}>
                    <source src='/Happy_birthday (part 2).mp4' type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

export default HappyBirthday
