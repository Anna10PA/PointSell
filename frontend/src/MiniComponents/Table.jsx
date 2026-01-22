import Item from "./Item"

function Table({col1, col2, col3, col4, col5, ApiInfo, func}) {
    return (
        <div className="rounded-2xl h-[83vh] relative overflow-y-auto border border-gray-200 ">
            <table className="w-full border-collapse rounded-2xl table-auto">
                <thead className="sticky top-0 bg-white ">
                    <tr className="text-gray-400 text-lg h-15 ">
                        <th className="border border-gray-200 font-semibold ">
                            {col1}
                        </th>
                        <th className="border border-gray-200 font-semibold ">
                            {col2}
                        </th>
                        <th className="border border-gray-200 font-semibold ">
                            {col3}
                        </th>
                        <th className="border border-gray-200 font-semibold px-4">
                            {col4}
                        </th>
                        <th className="border border-gray-200 font-semibold">
                            {col5}
                        </th>
                        <th className="border border-gray-200 font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ApiInfo?.length > 0 ? 
                        ApiInfo.map((item, index) => {
                            return <Item
                                image={item.product_image || item.profileUrl}
                                name={item.product_name || item.name}
                                info={item}
                                info2={item.time || item.orders.length}
                                info3={item.product_description || item.address}
                                info4={item.Id || item.email}
                                price={item.price || item.spent}
                                hasBlock={item.block || null}
                                func={func}
                                key={index} />
                        })
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
