import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation, Search } from './index'
import { Intro, Contact } from '../../components'
import { path } from '../../ultils/constant'

const Home = () => {
  const { pathname } = useLocation()
  const isAuthPage = pathname.includes(path.LOGIN)

  // Cuộn lên đầu trang mỗi khi pathname thay đổi
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    })
  }, [pathname])

  return (
    <div className='w-full flex flex-col items-center h-full'>
      <div className='w-full sticky top-0 z-50 bg-white shadow-md flex flex-col items-center'>
          <Header />
          <Navigation />
      </div>

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