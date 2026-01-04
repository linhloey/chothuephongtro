import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import menuManage from '../../ultils/menuManage' 
import * as actions from '../../store/actions'
import icons from '../../ultils/icons'

const { AiOutlineLogout, AiOutlineUsergroupAdd, MdOutlineLibraryBooks } = icons
const activeStyle = 'flex items-center gap-2 py-2 font-bold bg-gray-200 rounded-md px-4 text-blue-600'
const notActiveStyle = 'flex items-center gap-2 py-2 hover:bg-gray-100 rounded-md px-4 transition-all text-gray-700'

const Sidebar = () => {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    return (
        <div className='w-[256px] flex-none p-4 flex flex-col gap-6 border-r h-full bg-white'>
            <div className='flex flex-col gap-2 border-b pb-4'>
                <div className='flex items-center gap-4'>
                    <img 
                        src={userData?.avatar || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                        alt="avatar" 
                        className='w-12 h-12 object-cover rounded-full border-2 border-blue-500 shadow-sm' 
                    />
                    <div className='flex flex-col'>
                        <span className='font-bold text-gray-800 text-sm overflow-hidden text-ellipsis whitespace-nowrap w-32'>
                            {userData?.name}
                        </span>
                        <small className='text-gray-500'>{userData?.phone}</small>
                    </div>
                </div>
                <div className='mt-2 flex items-center justify-between'>
                    <span className='text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold uppercase'>
                        {userData?.roleCode === 'R1' ? 'Quản trị viên' : 'Thành viên'}
                    </span>
                    <span className='text-xs text-gray-400'>Mã: {userData?.id?.split('-')[0]}</span>
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                
                {menuManage.map(item => (
                    <NavLink 
                        key={item.id} 
                        to={item.path}
                        className={({ isActive }) => isActive ? activeStyle : notActiveStyle}
                    >
                        {item.icon}
                        <span>{item.value}</span>
                    </NavLink>
                ))}

                {userData?.roleCode === 'R1' && (
                    <>
                        <div className='mt-4 mb-1 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider'>
                            Quản trị hệ thống
                        </div>
                        <NavLink 
                            to='/he-thong/quan-ly-nguoi-dung' 
                            className={({ isActive }) => isActive ? activeStyle : notActiveStyle}
                        >
                            <AiOutlineUsergroupAdd size={20} />
                            <span>Quản lý người dùng</span>
                        </NavLink>
                        <NavLink 
                            to='/he-thong/quan-ly-tat-ca-bai-dang' 
                            className={({ isActive }) => isActive ? activeStyle : notActiveStyle}
                        >
                            <MdOutlineLibraryBooks size={20} />
                            <span>Quản lý tin</span>
                        </NavLink>
                    </>
                )}
                
                <hr className='my-4 border-gray-100' />

                {/* Nút thoát */}
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