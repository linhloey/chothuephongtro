import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions'
import Swal from 'sweetalert2'
import {getBase64} from '../../ultils/common/getBase64'

const Profile = () => {
    const { userData } = useSelector(state => state.user)
    const { isLoggedIn } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    
    const [payload, setPayload] = useState({
        name: '',
        phone: '',
        zalo: '',
        avatar: ''
    })

    useEffect(() => {
        setPayload({
            name: userData?.name || '',
            phone: userData?.phone || '',
            zalo: userData?.zalo || '',
            avatar: userData?.avatar || ''
        })
    }, [userData])

    useEffect(() => {
        if (isLoggedIn && (!userData || Object.keys(userData).length === 0)) {
            dispatch(actions.getCurrentUser())
        }
    }, [isLoggedIn, userData, dispatch])

    const handleFile = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const base64 = await getBase64(file)
            setPayload(prev => ({
                ...prev,
                avatar: base64
            }))
        }
    }

    const handleSubmit = async () => {
        const result = await dispatch(actions.updateUser(payload))
    
    if (result) {
        dispatch(actions.getCurrentUser())
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Thông tin cá nhân của bạn đã được cập nhật.',
            showConfirmButton: false,
            timer: 1500, 
            position: 'center', 
        })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại...',
                text: 'Có lỗi xảy ra, vui lòng thử lại sau!',
            })
        }
    }

    return (
        <div className='flex flex-col items-center p-10 w-full'>
            <h1 className='text-3xl font-medium border-b border-gray-200 w-full pb-4'>Chỉnh sửa thông tin cá nhân</h1>
            <div className='w-full max-w-xl mt-8 flex flex-col gap-6'>
                <div className='flex flex-col gap-4 items-center'>
                    <label className='font-semibold self-start'>Ảnh đại diện</label>
                    <div className='relative group'>
                        <img 
                            src={payload.avatar || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                            alt="avatar" 
                            className='w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg' 
                        />
                        <label 
                            htmlFor="avatar" 
                            className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300'
                        >
                            Thay đổi
                        </label>
                    </div>
                    
                    <input 
                        type="file"
                        id="avatar"
                        hidden
                        onChange={handleFile}
                        accept="image/*"
                    />
                    
                    <p className='text-sm text-gray-500 italic'>Click vào ảnh để tải ảnh lên</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-semibold' htmlFor="name">Tên hiển thị</label>
                    <input 
                        id="name"
                        type="text"
                        className='outline-none border border-gray-300 p-2 rounded-md'
                        value={payload.name}
                        onChange={e => setPayload(prev => ({...prev, name: e.target.value}))}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-semibold'>Số điện thoại</label>
                    <input 
                        className='border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed' 
                        value={payload.phone || ''} 
                        disabled 
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-semibold' htmlFor="zalo">Zalo</label>
                    <input 
                        id="zalo"
                        type="text"
                        className='outline-none border border-gray-300 p-2 rounded-md'
                        value={payload.zalo}
                        onChange={e => setPayload(prev => ({...prev, zalo: e.target.value}))}
                    />
                </div>
                <button 
                    className='bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-all'
                    onClick={handleSubmit}
                >
                    Lưu thông tin
                </button>
            </div>
        </div>
    )
}

export default Profile