import AnswersCard from './AnswersCard'
import { Info } from '../Main'
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GetCode() {
    let { curentUser, Game, allAnswers, question, getVerification } = useContext(Info)
    let navigate = useNavigate()

    useEffect(() => {
        if (!question) {
            Game()
        }
    }, [Game, question, curentUser])

    useEffect(() => {
        if (curentUser?.block) {
            navigate('/')
        }
    }, [curentUser?.count])
    
    console.log(question)
    return (
        <section className='w-full h-[56vh] flex flex-col items-start gap-15 '>
            <div>
                <h1 className='font-bold text-[27px]'>Verification</h1>
                <p className='text-gray-400'>Answer the questions correctly! After thank you can change password!</p>
            </div>
            <form className='flex items-end gap-5 flex-col w-full relative' >
                <h1 className='font-semibold text-gray-400'>Mistake: <span className={`${(curentUser?.count || 0) > 0 ? 'text-[red]' : ''}`}>{curentUser?.count || 0}</span> / 3</h1>
                <h1 className='text-center font-bold text-2xl w-full'>{question?.question}</h1>
                <div className='w-full flex items-center justify-between'>
                    <div className='text-white px-7 rounded py-3 text-center w-max font-bold text-sm tracking-[1px] bg-[#f67f20]'>
                        {question?.category}
                    </div>
                    <div className={`${question?.difficulty.toLowerCase() === 'easy' ? 'bg-[#009700]' :
                        question?.difficulty.toLowerCase() === 'medium' ? 'bg-[#f67f20]' :
                            question?.difficulty.toLowerCase() === 'hard' ? 'bg-[red]' :
                                ''} text-white px-7 rounded py-3 text-center w-max font-bold text-sm tracking-[1px]`}>
                        {question?.difficulty[0].toUpperCase() + question?.difficulty.slice(1)}
                    </div>
                </div>
                <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full justify-items-center gap-2'>
                    {
                        allAnswers?.map((item, index) => {
                            return <AnswersCard 
                            answer={item} 
                            key={index}
                            getVerification={getVerification}
                            email={curentUser?.email}
                            correctAnswer={question?.correct_answer}
                            />
                        })
                    }
                </div>
            </form>
        </section>
    )
}

export default GetCode
