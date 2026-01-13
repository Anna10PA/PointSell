import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AllPost() {
    const [text, setText] = useState("")
    const [view, setView] = useState(null)
    const [file, setFile] = useState(null)
    const textareaRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        let textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [text])

    const imageChangeFunc = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setView(URL.createObjectURL(selectedFile))
        }
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('text', text)
        if (file) {
            formData.append('image', file)
        }

        try {
            const res = await fetch('https://pointsell-4.onrender.com/post_post', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })

            if (res.ok) {
                setText("")
                setView(null)
                setFile(null)
                navigate('/main/posts')
                window.location.reload()
            }
        } catch (error) {
            console.error("Error sending post:", error)
        }
    }

    return (
        <main className='w-full flex items-center relative h-[98vh]'>
            <section className='w-full flex items-center justify-center flex-col gap-10 '>
                <Link to='/main/posts'>
                    <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] absolute top-8 left-10 cursor-pointer hover:bg-orange-400 duratuion-100'>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                </Link>
                <h1 className='text-3xl font-bold'>New <span className='text-[#F67F20]'>POST</span>!</h1>

                <form
                    onSubmit={handlePostSubmit}
                    className="min-w-[300px] h-full w-[60%] border-[#F67F20] border py-4 rounded px-6 bg-white shadow-sm"
                >
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What Do You Think?"
                        className="w-full p-2 text-lg outline-none min-h-[50px] max-h-[300px] overflow-y-auto resize-none"
                    />

                    {view ?
                        <div className="relative mt-3">
                            <img
                                src={view}
                                alt="Preview"
                                className="w-full rounded-lg object-cover max-h-[400px]"
                            />
                            <div onClick={() => {
                                setView(null)
                                setFile(null)
                            }}
                                className='absolute w-8 h-8 rounded-full bg-[#F67F20] text-white flex items-center justify-center top-2 right-2 cursor-pointer hover:bg-orange-400'
                            >
                                <i className="fa-solid fa-x text-xs"></i>
                            </div>
                        </div>
                        : null
                    }

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <label className="cursor-pointer flex items-center gap-2 hover:text-white w-10 h-10 rounded-lg hover:hover:bg-orange-400 justify-center text-[#F67F20] duration-200">
                            <i className="fa-solid fa-image  text-xl"></i>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={imageChangeFunc}
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-[#F67F20] text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 cursor-pointer hover:bg-orange-600"
                            disabled={!text && !file}
                        >
                            Post
                        </button>
                    </div>
                </form>
            </section>
        </main >
    )
}

export default AllPost