import { Info } from "../Main"
import { useContext } from "react"
import User from "./User"


function EmployeeInformation() {
  let { allUser } = useContext(Info)

  return (
    <section className='w-full h-[75vh] flex flex-col items-start gap-10'>
      <div className='leading-10 min-h-[10vh]'>
        <h1 className='font-bold text-[27px]'>Employee Infromation</h1>
        <p className='text-gray-400'>Information about all employed at the restaurant.</p>
      </div>
      <section className='h-full w-full overflow-auto relative'>
        <table className="w-full h-full border-collapse">
          <thead className="w-full sticky top-0 right-0 bg-white" >
            <tr className="w-full flex justify-between">
              <th className="w-1/2 border border-gray-300 h-15 flex items-center justify-center text-xl">Employer</th>
              <th className="w-1/2 border border-gray-300 h-15 flex items-center justify-center text-xl">Email</th>
            </tr>
          </thead>
          <tbody className="w-full mt-15">
            {
              allUser?.filter((user) => {
                return user.position === 'Worker'
              }).map((item, index) => {
                return <User
                  image={item?.profileUrl}
                  name={item?.name}
                  email={item?.email}
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
