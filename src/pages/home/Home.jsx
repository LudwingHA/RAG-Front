import React from 'react'
import { Layout } from '../../layout/Layout'

export const Home = () => {
  return (
    <Layout>
      <div className='w-4/5 m-auto flex flex-row justify-center gap-2 items-center'>
      <input className='border w-full p-4 rounded-2xl' type="text" placeholder='Preguntame......' />
        <button className='bg-[var(--color-primary)] h-full text-amber-50 p-4 rounded-4xl cursor-pointer hover:bg-[var(--color-secondary)]'>Mandar</button></div>
    </Layout>
  )
}
