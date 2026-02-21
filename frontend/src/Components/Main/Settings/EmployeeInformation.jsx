import { Info } from "../Main"
import { useContext } from "react"
import User from "../../../MiniComponents/User"

function EmployeeInformation() {
  let { allUser } = useContext(Info)

  return (
    <section className='w-full h-[75vh] flex flex-col items-start gap-10 max-sm:h-screen max-sm:mt-5'>
      <div className='leading-10 min-h-[10vh] flex flex-col items-start gap-3'>
        <h1 className='font-bold text-[27px] max-sm:text-xl max-sm:text-5'>Employee Infromation</h1>
        <p className='text-gray-400 max-sm:leading-5'>Information about all employed at the restaurant.</p>
      </div>
      <section className='h-full w-full overflow-auto relative'>
        <table className="w-full h-full border-collapse">
          <thead className="w-full sticky top-0 right-0 bg-white" >
            <tr className="w-full flex justify-between">
              <th className="w-1/2 border-b border-t border-gray-300 h-15 flex items-center justify-center text-xl max-sm:text-lg">Employer</th>
              <th className="w-1/2 border-b border-t border-gray-300 h-15 flex items-center justify-center text-xl max-sm:text-lg">Email</th>
            </tr>
          </thead>
          <tbody className="w-full mt-15">
            {
              allUser?.filter((user) => {
                return user.position === 'Worker' || user.position === 'Manager'
              }).map((item, index) => {
                return <User
                  image={item?.profileUrl}
                  name={item?.name}
                  email={item?.email}
                  position={item?.position }
                  key={index} />
              })
            }
          </tbody>
        </table>
      </section>
    </section>
  )
}

export default EmployeeInformation
