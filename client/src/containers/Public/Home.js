import React from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation, Search } from './index'
import { Intro, Contact } from '../../components'
import { path } from '../../ultils/constant'

const Home = () => {
  const location = useLocation()
  const isAuthPage = location.pathname.includes(path.LOGIN)

  return (
    <div className='w-full flex flex-col gap-6 items-center h-full'>
        <Header />
        <Navigation />
        {!isAuthPage && <Search />}
        <div className='w-4/5 lg:w-3/5 flex flex-col items-center justify-start mt-3'>
          <Outlet />
        </div>
        {!isAuthPage && (
          <>
            <Intro />
            <Contact />
          </>
        )}
    </div>
  )
}

export default Home