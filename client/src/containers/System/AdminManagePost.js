import React, { useEffect, useState } from 'react'
import { apiGetPostsAdmin, apiDeletePost } from '../../services/post'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/vi'
import Swal from 'sweetalert2'
import { formatVNToString } from '../../ultils/common/formatVNToString'

const AdminManagePost = () => {
    const [posts, setPosts] = useState(null)
    const [updateData, setUpdateData] = useState(false)
    const { userData } = useSelector(state => state.user)

    moment.locale('vi')

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiGetPostsAdmin()
            if (response?.data.err === 0) {
                setPosts(response.data.response)
            } else {
                setPosts([])
            }
        }
        fetchPosts()
    }, [updateData])

    const handleDeletePost = (postId) => {
        Swal.fire({
            title: 'Xác nhận xóa bài?',
            text: "Dữ liệu bài đăng này sẽ bị xóa vĩnh viễn khỏi hệ thống!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeletePost(postId)
                if (response?.data.err === 0) {
                    setUpdateData(prev => !prev)
                    Swal.fire('Thành công!', 'Bài đăng đã được gỡ bỏ.', 'success')
                } else {
                    Swal.fire('Thất bại!', response?.data?.msg || 'Có lỗi xảy ra', 'error')
                }
            }
        })
    }

    if (userData.roleCode !== 'R1') {
        return (
            <div className='p-6 text-red-500 font-bold bg-red-50 rounded-md m-4 border border-red-200 text-center text-lg'>
                ⚠️ Cảnh báo: Bạn không có quyền quản trị để truy cập trang này!
            </div>
        )
    }

    return (
        <div className='flex flex-col h-full bg-white p-6'>
            <div className='flex justify-between items-center border-b pb-4 mb-6'>
                <h1 className='text-3xl font-bold text-gray-800'>Quản lý tất cả bài đăng</h1>
                <span className='bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm'>
                    Tổng số tin: <span className='font-bold'>{posts?.length || 0}</span>
                </span>
            </div>

            <div className='relative overflow-x-auto shadow-lg sm:rounded-lg border border-gray-100'>
                <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-white uppercase bg-blue-600 sticky top-0'>
                        <tr>
                            <th className='px-6 py-4'>Mã tin</th>
                            <th className='px-6 py-4'>Ảnh thumb</th>
                            <th className='px-6 py-4'>Thông tin bài đăng</th>
                            <th className='px-6 py-4 text-center'>Giá</th>
                            <th className='px-6 py-4'>Người đăng</th>
                            <th className='px-6 py-4'>Ngày đăng</th>
                            <th className='px-6 py-4 text-center'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts === null ? (
                             <tr>
                                <td colSpan="7" className="text-center py-20 text-gray-400 italic font-medium">Đang tải dữ liệu bài đăng...</td>
                             </tr>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.id} className='bg-white border-b hover:bg-blue-50 transition-all duration-200'>
                                    <td className='px-6 py-4 font-mono text-xs font-semibold uppercase text-gray-600'>
                                        #{post.overview?.code?.split('-')[0] || post.id.slice(0, 6)}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='w-16 h-16 rounded overflow-hidden border border-gray-200'>
                                            <img 
                                                src={post.images?.image ? JSON.parse(post.images.image)[0] : 'https://via.placeholder.com/150'} 
                                                alt="thumb" 
                                                className='w-full h-full object-cover'
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} 
                                            />
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='max-w-[250px] truncate font-bold text-gray-900 text-[15px]' title={post.title}>
                                            {post.title}
                                        </div>
                                        <div className='text-xs text-blue-600 mt-1 font-semibold uppercase'>
                                            {post?.label?.value || 'N/A'}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 text-center font-bold text-green-600 whitespace-nowrap text-base'>
                                        {post.attributes?.price}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='text-gray-900 font-semibold'>{post.user?.name}</div>
                                        <div className='text-xs text-gray-500 font-mono'>{post.user?.phone}</div>
                                    </td>
                                    <td className='px-6 py-4 text-xs whitespace-nowrap'>
                                        <div className='font-bold text-gray-700'>{moment(post.createdAt).format('DD/MM/YYYY')}</div>
                                        <div className='text-gray-400 mt-0.5'>{moment(post.createdAt).fromNow()}</div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex justify-center gap-4'>
                                            <button 
                                                className='text-blue-600 hover:text-blue-800 font-bold underline transition-colors'
                                                onClick={() => {
                                                    const titleSlug = formatVNToString(post.title);
                                                    window.open(`/chi-tiet/${post.id}`, '_blank');
                                                }}
                                            >
                                                Xem
                                            </button>
                                            <button 
                                                className='text-red-600 hover:text-red-800 font-bold underline transition-colors'
                                                onClick={() => handleDeletePost(post.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-20 text-gray-500 italic text-lg font-medium">
                                    Hệ thống hiện chưa có bài đăng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminManagePost