import React, { useEffect, useState } from 'react'
import { apiGetPostsAdmin, apiDeletePost } from '../../services/post'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/vi' // Để hiển thị thời gian tiếng Việt
import Swal from 'sweetalert2'

const AdminManagePost = () => {
    const [posts, setPosts] = useState([])
    const [updateData, setUpdateData] = useState(false)
    const { userData } = useSelector(state => state.user)

    // Thiết lập tiếng Việt cho moment
    moment.locale('vi')

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiGetPostsAdmin()
            if (response?.data.err === 0) {
                setPosts(response.data.response)
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
                    setUpdateData(prev => !prev) // Load lại danh sách bài đăng
                    Swal.fire('Thành công!', 'Bài đăng đã được gỡ bỏ.', 'success')
                } else {
                    Swal.fire('Thất bại!', 'Có lỗi xảy ra khi xóa bài.', 'error')
                }
            }
        })
    }

    // Kiểm tra quyền Admin (R1)
    if (userData.roleCode !== 'R1') {
        return (
            <div className='p-6 text-red-500 font-bold bg-red-50 rounded-md m-4 border border-red-200'>
                Cảnh báo: Bạn không có quyền quản trị để truy cập trang này!
            </div>
        )
    }

    return (
        <div className='flex flex-col h-full bg-white p-6'>
            {/* Header */}
            <div className='flex justify-between items-center border-b pb-4 mb-6'>
                <h1 className='text-3xl font-bold text-gray-800'>Quản lý tất cả bài đăng</h1>
                <div className='flex gap-4'>
                    <span className='bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm'>
                        Tổng số tin: <span className='font-bold'>{posts?.length || 0}</span>
                    </span>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className='relative overflow-x-auto shadow-lg sm:rounded-lg border border-gray-100'>
                <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-xs text-white uppercase bg-blue-600'>
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
                        {posts?.length > 0 ? posts.map((post) => (
                            <tr key={post.id} className='bg-white border-b hover:bg-blue-50 transition-all duration-200'>
                                <td className='px-6 py-4 font-mono text-xs font-semibold text-gray-700 uppercase'>
                                    #{post.overview?.code}
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='w-16 h-16 rounded overflow-hidden border border-gray-200 shadow-sm'>
                                        <img 
                                            src={post.images?.image ? JSON.parse(post.images.image)[0] : 'https://via.placeholder.com/150'} 
                                            alt="post-thumb" 
                                            className='w-full h-full object-cover' 
                                        />
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='max-w-[300px] truncate font-bold text-gray-900 text-[15px]' title={post.title}>
                                        {post.title}
                                    </div>
                                    {/* LẤY DANH MỤC TỪ DATABASE */}
                                    <div className='text-xs text-blue-600 mt-1 font-semibold'>
                                        Chuyên mục: {post?.label?.value || 'Chưa phân loại'}
                                    </div>
                                </td>
                                <td className='px-6 py-4 text-center font-bold text-green-600 whitespace-nowrap text-base'>
                                    {post.attributes?.price}
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='text-gray-900 font-semibold'>{post.user?.name}</div>
                                    <div className='text-xs text-gray-500 font-mono'>{post.user?.phone}</div>
                                </td>
                                <td className='px-6 py-4 text-xs font-medium text-gray-600'>
                                    {/* LẤY NGÀY ĐĂNG TỪ DATABASE */}
                                    <div className='font-bold text-gray-800'>
                                        {moment(post.createdAt).format('DD/MM/YYYY')}
                                    </div>
                                    <div className='text-[10px] text-gray-400 mt-0.5'>
                                        {moment(post.createdAt).fromNow()}
                                    </div>
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <div className='flex items-center justify-center gap-4'>
                                        <button 
                                            className='text-blue-600 hover:text-blue-800 font-bold underline transition-colors'
                                            onClick={() => Swal.fire('Thông tin', `Bài viết: ${post.title}`, 'info')}
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
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center py-20 text-gray-400 bg-gray-50 italic text-lg">
                                    Đang tải dữ liệu bài đăng...
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