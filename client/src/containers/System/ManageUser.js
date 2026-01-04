import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'
import Swal from 'sweetalert2'

const ManageUser = () => {
    const dispatch = useDispatch()
    const { users } = useSelector(state => state.user)
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(actions.getAllUsers())
    }, [dispatch])

    const handleDeleteUser = (userId) => {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Tài khoản này sẽ bị xóa vĩnh viễn khỏi hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gọi action delete tại đây
                // dispatch(actions.deleteUser(userId))
                Swal.fire('Đã xóa!', 'Người dùng đã được gỡ bỏ.', 'success')
            }
        })
    }

    if (userData.roleCode !== 'R1') {
        return <div className='p-4 text-red-500 font-bold'>Bạn không có quyền truy cập trang này!</div>
    }

    return (
        <div className='flex flex-col h-full bg-white p-6'>
            <div className='flex justify-between items-center border-b pb-4 mb-6'>
                <h1 className='text-3xl font-bold text-gray-800'>Quản lý thành viên</h1>
                <div className='flex gap-4'>
                    <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
                        Tổng: {users?.length || 0}
                    </span>
                </div>
            </div>

            <div className='relative overflow-x-auto shadow-md sm:rounded-lg border'>
                <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-white uppercase bg-blue-600'>
                        <tr>
                            <th className='px-6 py-4'>Ảnh</th>
                            <th className='px-6 py-4'>Tên hiển thị</th>
                            <th className='px-6 py-4'>Số điện thoại</th>
                            <th className='px-6 py-4'>Zalo</th>
                            <th className='px-6 py-4'>Vai trò</th>
                            <th className='px-6 py-4 text-center'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.length > 0 ? users.map((user) => (
                            <tr key={user.id} className='bg-white border-b hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4'>
                                    <img 
                                        src={user.avatar || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                                        alt="avatar" 
                                        className='w-10 h-10 object-cover rounded-full shadow-sm' 
                                    />
                                </td>
                                <td className='px-6 py-4 font-semibold text-gray-900'>{user.name}</td>
                                <td className='px-6 py-4 font-mono'>{user.phone}</td>
                                <td className='px-6 py-4'>{user.zalo || 'N/A'}</td>
                                <td className='px-6 py-4'>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${user.roleCode === 'R1' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {user.roleCode === 'R1' ? 'ADMIN' : 'USER'}
                                    </span>
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <button 
                                        className='text-blue-600 hover:text-blue-900 font-medium mr-4 underline'
                                        onClick={() => Swal.fire('Tính năng đang phát triển', '', 'info')}
                                    >
                                        Sửa
                                    </button>
                                    {user.roleCode !== 'R1' && (
                                        <button 
                                            className='text-red-600 hover:text-red-900 font-medium underline'
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-400 italic">Đang tải danh sách người dùng...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageUser