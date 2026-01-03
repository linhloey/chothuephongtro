import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import menuManage from '../../ultils/menuManage'
import * as actions from '../../store/actions'
import icons from '../../ultils/icons'

const { AiOutlineLogout } = icons
const activeStyle = 'flex items-center gap-2 py-2 font-bold bg-gray-200 rounded-md px-4'
const notActiveStyle = 'flex items-center gap-2 py-2 hover:bg-gray-100 rounded-md px-4 transition-all'

const Sidebar = () => {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    return (
        <div className='w-[256px] flex-none p-4 flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                    <img src={userData?.avatar || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                         alt="avatar" className='w-12 h-12 object-cover rounded-full border-2 border-white shadow-md' />
                    <div className='flex flex-col'>
                        <span className='font-bold'>{userData?.name}</span>
                        <small className='text-gray-500'>{userData?.phone}</small>
                    </div>
                </div>
                <span className='text-sm'>Mã thành viên: <span className='font-bold'>{userData?.id?.split('-')[0]}</span></span>
            </div>
            <div className='flex flex-col'>
                {menuManage.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.path}
                        className={({ isActive }) => isActive ? activeStyle : notActiveStyle}
                    >
                        {item.icon}
                        {item.value}
                    </NavLink>
                ))}
                <span 
                    onClick={() => dispatch(actions.logout())}
                    className='flex items-center gap-2 py-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-md px-4 transition-all'
                >
                    <AiOutlineLogout size={18} />
                    Thoát
                </span>
            </div>
        </div>
    )
}

export default Sidebar