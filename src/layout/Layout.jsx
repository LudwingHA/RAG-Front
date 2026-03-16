import React from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar>

      </Navbar>
      <main className=''>
        {children}
      </main>
      <Footer></Footer>
    </>
  )
}
