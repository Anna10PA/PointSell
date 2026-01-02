import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"

function AddProductPage() {
    let { register, handleSubmit, formState: { errors } } = useForm()
    let image = useRef()

    const imageChangeFunc = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile)
            image.current.src = imageUrl
            image.current.classList.remove('hidden')
        }
    }

    return (
        <>
            <main className="w-full h-full flex flex-col px-10 py-5 gap-5">
                <header className="flex items-center justify-between w-full gap-5 min-h-[10vh]">
                    <h1 className="text-3xl font-bold">Add Product</h1>
                </header>
                <section className="relative border border-gray-300 rounded-2xl p-5">
                    <Link to='/main/products'>
                        <button className='w-10 h-10 bg-[#F67F20] text-white rounded-[50%] cursor-pointer hover:bg-orange-400 duratuion-100'>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </Link>
                    <section className="flex w-full justify-center flex-col gap-5 items-center ">
                        <div className="flex flex-col gap-4 items-center " >
                            <div className="bg-[#F5F5F5] rounded-xl h-40 w-40 flex items-center justify-center relative cursor-pointer overflow-hidden">
                                <input
                                    type="file"
                                    className="border z-20 absolute top-0 w-full h-full opacity-0  "
                                    accept="image/*"
                                    required
                                    onChange={imageChangeFunc}
                                />
                                <i className={`fa-solid fa-images text-[#BBBBBB] text-4xl ${image.current?.src.length > 0 ? 'hidden' : ''}`}></i>
                                <img src="" alt="" ref={image} className="z-10 hidden absolute object-cover h-full w-full" />
                            </div>
                            <h1 className="font-bold text-2xl">Upload Image</h1>
                        </div>
                        <form className="w-full flex flex-col items-center gap-4" onSubmit={handleSubmit((data) => {
                            console.log(data)
                        })}>
                            <div className="w-full grid grid-cols-4 gap-5">
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex flex-col items-start gap-2 w-full">
                                        <label htmlFor="" className="font-bold text-lg">Product Name:</label>
                                        <input type="text" className={`px-4 py-2 border ${errors.product_name ? 'border-red-600 border-2' : 'border-gray-400'} rounded outline-[#f67f20] w-full`} placeholder="Product Name" {...register('product_name', {
                                            required: 'Enter Product Name',
                                            minLength: 1
                                        })} />
                                    </div>
                                    <span className="text-red-600 ">{errors.product_name ? errors.product_name.message : ''}</span>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex flex-col items-start gap-2 w-full">
                                        <label htmlFor="" className="font-bold text-lg">Price:</label>
                                        <input type="text" className={`px-4 py-2 border ${errors.price ? 'border-red-600 border-2' : 'border-gray-400'} rounded outline-[#f67f20] w-full`} placeholder="Product Price" {...register('price', {
                                            required: 'Enter Product Price',
                                            validate: (item) => {
                                                for (let i of item) {
                                                    if (!'0123456789.'.includes(i)) {
                                                        return "Must be number"
                                                    }
                                                }
                                                return true
                                            }
                                        })} />
                                    </div>
                                    <span className="text-red-600">{errors.price ? errors.price.message : ''}</span>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <div className="flex flex-col items-start gap-2 w-full">
                                        <label htmlFor="" className="font-bold text-lg">Discount:</label>
                                        <input type="text" className={`px-4 py-2 border ${errors.discount ? 'border-red-600 border-2' : 'border-gray-400'} rounded outline-[#f67f20] w-full`} placeholder="Product Discount"
                                            {...register('discount', {
                                                validate: (item) => {
                                                    for (let i of item.trim()) {
                                                        if (!'0123456789.%'.includes(i)) {
                                                            return 'Must be number'
                                                        }
                                                    }
                                                    if ((item.trim()[item.trim().length - 1] !== '%' || item.indexOf('%') !== item.lastIndexOf('%')) && item.trim().length > 0) {
                                                        return 'Must be procent last symbol'
                                                    }
                                                    if (Number(item.trim().split('%')[0]) > 100) {
                                                        return 'Must be less 100%'
                                                    }
                                                    console.log(Number('10.'))
                                                    return true
                                                }
                                            })} />
                                    </div>
                                    <span className="text-red-600">{errors.discount ? errors.discount.message : ''}</span>
                                </div>
                                <div className="flex flex-col items-start gap-2 w-full">
                                    <label htmlFor="" className="font-bold text-lg">Category:</label>
                                    <select name="" id="" className="w-full border border-gray-400 px-4 rounded py-2 text-gray-500 outline-[#f67f20]">
                                        <option value="food">Food</option>
                                        <option value="drink">Drink</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start gap-2 w-full col-start-1 col-end-6 ">
                                    <div className="flex flex-col items-start gap-2 w-full">
                                        <label htmlFor="" className="font-bold text-lg">Description:</label>
                                        <textarea className={`px-4 py-2 border ${errors.description ? 'border-red-600 border-2' : 'border-gray-400'} rounded outline-[#f67f20] w-full`} placeholder="Product Description" {...register('description', {
                                            required: 'Enter Product Description'
                                        })} ></textarea>
                                    </div>
                                    <span className="text-red-600">{errors.description ? errors.description.message : ''}</span>
                                </div>
                            </div>
                            <button className="bg-[#f67f20] text-white px-8 py-3 font-bold text-lg rounded-lg duration-100 hover:bg-amber-500 cursor-pointer" >Save Product</button>
                        </form>
                    </section>
                </section>
            </main>
        </>
    )
}

export default AddProductPage
