import React from 'react'
import { Navbar } from './components/Navbar'

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar>

      </Navbar>
      <main className='pt-5'>
        {children}
      </main>
    </>
  )
}
