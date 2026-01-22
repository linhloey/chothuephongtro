import React, { useEffect, useState } from 'react'
import { apiGetPostsUser, apiDeletePost } from '../../services/post'
import moment from 'moment'
import { Button } from '../../components'
import Swal from 'sweetalert2'
import UpdatePost from './UpdatePost'

const ManagePost = () => {
    const [posts, setPosts] = useState([])
    const [updateData, setUpdateData] = useState(false) 
    const [isEdit, setIsEdit] = useState(false)
    const [dataEdit, setDataEdit] = useState(null)

    useEffect(() => {
        fetchPosts()
    }, [updateData])

    const fetchPosts = async () => {
        const response = await apiGetPostsUser()
        if (response?.data.err === 0) {
            setPosts(response.data.response.rows)
        }
    }

    const handleDeletePost = (postId) => {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn sẽ không thể khôi phục lại tin đăng này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Xóa ngay',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeletePost(postId)
                if (response?.data.err === 0) {
                    setUpdateData(prev => !prev) 
                }
            }
        })
    }

    return (
        <div className='p-4 bg-white shadow-md rounded-md relative'>
            <h1 className='text-2xl font-bold mb-4 border-b pb-2'>Quản lý tin đăng</h1>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-gray-100 uppercase text-sm'>
                        <tr>
                            <th className='p-3 border text-center'>Mã tin</th>
                            <th className='p-3 border'>Ảnh</th>
                            <th className='p-3 border'>Tiêu đề</th>
                            <th className='p-3 border'>Giá</th>
                            <th className='p-3 border'>Ngày đăng</th>
                            <th className='p-3 border text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts?.length > 0 ? posts.map(item => (
                            <tr key={item.id} className='hover:bg-gray-50'>
                                <td className='p-3 border text-center font-bold'>#{item.overview?.code?.split('-')[0]}</td>
                                <td className='p-3 border'>
                                    <img src={JSON.parse(item.images?.image)[0]} className='w-16 h-16 object-cover rounded' alt='thumb'/>
                                </td>
                                <td className='p-3 border font-medium text-blue-600'>{item.title}</td>
                                <td className='p-3 border text-green-600'>{item.attributes?.price}</td>
                                <td className='p-3 border'>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                                <td className='p-3 border'>
                                    <div className='flex gap-2 justify-center'>
                                        <Button 
                                            text='Sửa' 
                                            bgColor='bg-yellow-500' 
                                            textColor='text-white'
                                            onClick={() => {
                                                setDataEdit(item)
                                                setIsEdit(true)
                                            }}
                                        />
                                        <Button 
                                            text='Xóa' 
                                            bgColor='bg-red-500' 
                                            textColor='text-white'
                                            onClick={() => handleDeletePost(item.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan='6' className='text-center p-4'>Trống</td></tr>}
                    </tbody>
                </table>
            </div>
            {/* Overlay Modal Sửa */}
            {isEdit && <UpdatePost dataEdit={dataEdit} setIsEdit={setIsEdit} setUpdateData={setUpdateData} />}
        </div>
    )
}

export default ManagePost