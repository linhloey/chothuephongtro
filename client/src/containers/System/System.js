import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { path } from '../../ultils/constant'
import Sidebar from './Sidebar'

const System = () => {
    const { isLoggedIn } = useSelector(state => state.auth)

    if (!isLoggedIn) return <Navigate to={`/${path.LOGIN}`} replace={true} />

    return (
        <div className='w-full h-screen overflow-hidden flex flex-col items-center'>
            <div className='w-full h-[60px] flex-none bg-blue-700 flex items-center px-10 justify-between text-white shadow-md'>
                <span className='font-bold text-lg'>Phongtro.com</span>
                <div className='flex items-center gap-4'>
                    <small>Chào mừng bạn!</small>
                    <button onClick={() => window.location.href = '/'} className='bg-blue-600 px-3 py-1 rounded text-sm'>Trang chủ</button>
                </div>
            </div>

            <div className='w-full flex flex-auto h-[calc(100vh-60px)]'>
                <Sidebar />
                <div className='flex-auto bg-[#f1f1f1] shadow-inner p-4 h-full overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default System