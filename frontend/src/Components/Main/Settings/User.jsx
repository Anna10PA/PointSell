function User({ name, email, image, func }) {
    return (
        <tr className="flex w-full justify-between">
            <td className="flex items-center gap-3 border-gray-300 border p-2 w-1/2 ">
                <img src={image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                <h1 className="font-bold text-md wrap-break-word whitespace-normal">{name}</h1>
            </td>
            <td className="text-[#f67f20] font-bold text-md  p-2 border-gray-300 border px-4 py-2 w-1/2 flex items-center">
                <h1 className="wrap-break-word whitespace-normal w-full">
                    {email}
                </h1>
            </td>
        </tr>
    )
}

export default User
