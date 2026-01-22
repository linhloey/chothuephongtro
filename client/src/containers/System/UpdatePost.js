import React, { useState } from 'react'
import { apiUpdatePost } from '../../services/post'
import { Button } from '../../components'
import Swal from 'sweetalert2'

const UpdatePost = ({ dataEdit, setIsEdit, setUpdateData }) => {
    const [payload, setPayload] = useState({
        postId: dataEdit?.id,
        attributesId: dataEdit?.attributesId,
        imagesId: dataEdit?.imagesId,
        overviewId: dataEdit?.overviewId,
        title: dataEdit?.title || '',
        // Hiển thị text thuần trong textarea để dễ sửa
        description: dataEdit?.description?.startsWith('[') 
            ? JSON.parse(dataEdit.description).join('\n') 
            : dataEdit?.description,
        // Lấy con số từ chuỗi "3.5 triệu/tháng" để hiện lên ô input
        price: dataEdit?.attributes?.price ? parseFloat(dataEdit.attributes.price) : 0,
        acreage: dataEdit?.attributes?.acreage ? parseFloat(dataEdit.attributes.acreage) : 0,
        address: dataEdit?.overview?.address || '',
        phone: dataEdit?.user?.phone || '',
        zalo: dataEdit?.user?.zalo || '',
        images: dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : []
    })

    const handleUpdate = async () => {
        // TRƯỚC KHI GỬI: Format lại dữ liệu theo đúng kiểu database cũ
        const finalPayload = {
            ...payload,
            // 1. Format giá: 3.5 -> "3.5 triệu/tháng"
            price: `${payload.price} triệu/tháng`,
            // 2. Format diện tích: 30 -> "30m2"
            acreage: `${payload.acreage}m2`,
            // 3. Chuyển description từ text thuần về mảng JSON (để giữ định dạng cũ nếu cần)
            description: payload.description.split('\n')
        }

        const response = await apiUpdatePost(finalPayload)
        if (response?.data.err === 0) {
            Swal.fire('Thành công', 'Đã cập nhật tin đăng', 'success')
            setIsEdit(false)
            setUpdateData(prev => !prev)
        } else {
            Swal.fire('Thất bại', response.data.msg, 'error')
        }
    }

    return (
        <div 
            className='fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center z-[1000] overflow-y-auto pt-10 pb-10'
            onClick={() => setIsEdit(false)}
        >
            <div 
                className='bg-white w-[90%] max-w-[900px] h-fit p-8 rounded-lg shadow-2xl flex flex-col gap-6'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex justify-between items-center border-b pb-4'>
                    <h2 className='text-2xl font-bold uppercase text-orange-600'>Chỉnh sửa tin đăng #{dataEdit?.overview?.code}</h2>
                    <span className='cursor-pointer text-3xl' onClick={() => setIsEdit(false)}>&times;</span>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold'>Tiêu đề</label>
                            <input 
                                type="text"
                                className='border rounded-md p-2 outline-none focus:border-blue-500'
                                value={payload.title}
                                onChange={(e) => setPayload(prev => ({...prev, title: e.target.value}))}
                            />
                        </div>

                        <div className='flex gap-4'>
                            <div className='flex-1 flex flex-col gap-2'>
                                <label className='font-bold'>Giá thuê (triệu/tháng)</label>
                                <input 
                                    type="number"
                                    step="0.1" 
                                    className='border rounded-md p-2 outline-none'
                                    value={payload.price}
                                    onChange={(e) => setPayload(prev => ({...prev, price: e.target.value}))}
                                />
                            </div>
                            <div className='flex-1 flex flex-col gap-2'>
                                <label className='font-bold'>Diện tích (m²)</label>
                                <input 
                                    type="number"
                                    className='border rounded-md p-2 outline-none'
                                    value={payload.acreage}
                                    onChange={(e) => setPayload(prev => ({...prev, acreage: e.target.value}))}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-gray-700'>Địa chỉ</label>
                            <textarea 
                                className='border rounded-md p-2 outline-none bg-gray-50'
                                value={payload.address}
                                onChange={(e) => setPayload(prev => ({...prev, address: e.target.value}))}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-bold text-blue-600'>SĐT liên hệ</label>
                            <input 
                                type="text"
                                className='border rounded-md p-2 outline-none'
                                value={payload.phone}
                                onChange={(e) => setPayload(prev => ({...prev, phone: e.target.value}))}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='font-bold'>Mô tả (Xuống dòng tự động lưu)</label>
                            <textarea 
                                rows="8"
                                className='border rounded-md p-2 outline-none'
                                value={payload.description}
                                onChange={(e) => setPayload(prev => ({...prev, description: e.target.value}))}
                            />
                        </div>
                    </div>
                </div>

                <div className='flex gap-4 justify-end border-t pt-4'>
                    <Button 
                        text='Hủy' 
                        bgColor='bg-gray-400' 
                        textColor='text-white'
                        onClick={() => setIsEdit(false)}
                    />
                    <Button 
                        text='Lưu cập nhật' 
                        bgColor='bg-orange-600' 
                        textColor='text-white'
                        onClick={handleUpdate}
                    />
                </div>
            </div>
        </div>
    )
}

export default UpdatePost