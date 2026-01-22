import React, { memo, useState } from 'react'
import icons from '../ultils/icons'
import { useNavigate } from 'react-router-dom'
import { apiSavePost } from '../services/post'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../store/actions'
import Swal from 'sweetalert2'
import { formatVNToString } from '../ultils/common/formatVNToString'

const indexs = [0, 1, 2, 3]
const { GrStar, RiHeartFill, RiHeartLine, BsBookmarkStarFill } = icons

const Item = ({ images, user, title, star, description, attributes, overview, id }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false)
    const { isLoggedIn } = useSelector(state => state.auth)
    const { savedIds } = useSelector(state => state.post) 
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isSaved = savedIds?.some(savedId => String(savedId) === String(id))
    const pathDetail = `/chi-tiet/${id}`

    const handleStar = (star) => {
        let stars = []
        for (let i = 1; i <= +star; i++) stars.push(<GrStar key={i} className='star-item' size={18} color='yellow' />)
        return stars
    }

    const handleSavePost = async (e) => {
        e.stopPropagation() 
        
        if (!isLoggedIn) {
            Swal.fire('Thông báo', 'Vui lòng đăng nhập để lưu bài đăng!', 'info')
            return
        }

        const response = await apiSavePost({ postId: id })
        if (response?.data.err === 0) {
            dispatch(actions.getSavedPosts()) 
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            })
            Toast.fire({
                icon: 'success',
                title: response.data.msg
            })
        }
    }

    return (
        <div className='w-full flex border-t border-orange-600 py-3 relative'>
            <div className='w-2/5 relative mr-4'>
                <div 
                    onClick={() => navigate(pathDetail)} 
                    className='grid grid-cols-2 gap-[2px] cursor-pointer'
                >
                    {images?.length > 0 && images.filter((i, index) => indexs.some(i => i === index)).map((i, index) => (
                        <img key={index} src={i} alt="preview" className='w-full h-full aspect-square object-cover block' />
                    ))}
                </div>
                
                <span className='bg-overlay-70 text-sm text-white px-2 rounded-md absolute left-1 bottom-1 pointer-events-none'>
                    {`${images?.length || 0} ảnh`}
                </span>

                <span
                    className='absolute right-2 bottom-2 z-30 cursor-pointer p-1 transition-transform hover:scale-110'
                    onMouseEnter={() => setIsHoverHeart(true)}
                    onMouseLeave={() => setIsHoverHeart(false)}
                    onClick={handleSavePost}
                >
                    {(isSaved || isHoverHeart) 
                        ? <RiHeartFill size={30} color='red' /> 
                        : <RiHeartLine size={30} color='white' />
                    }
                </span>
            </div>

            <div className='w-3/5'>
                <div className='flex justify-between gap-4 w-full'>
                    <div 
                        onClick={() => navigate(pathDetail)} 
                        className='text-red-600 font-medium hover:underline cursor-pointer flex-1'
                    >
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => (
                            <span key={number}>{star}</span>
                        ))}
                        {title}
                    </div>
                    
                    <div className='w-[10%] flex justify-end'>
                        <BsBookmarkStarFill size={24} color='orange' />
                    </div>
                </div>

                <div className='my-2 gap-2 flex items-center justify-between' onClick={() => navigate(pathDetail)}>
                    <span className='text-sm flex-2 font-bold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis'>{attributes?.price}</span>
                    <span className='text-sm flex-1'>{attributes?.acreage}</span>
                    <span className='text-sm flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
                        {`${overview?.address?.split(',').slice(-2).join(', ')}`}
                    </span>
                </div>

                <p 
                    className='text-gray-500 w-full h-[50px] text-ellipsis overflow-hidden cursor-pointer'
                    onClick={() => navigate(pathDetail)}
                >
                    {description}
                </p>

                <div className='flex items-center my-5 justify-between'>
                    <div className='flex items-center'>
                        <img src={user?.avatar || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"} alt='avatar' className='w-[30px] h-[30px] object-cover rounded-full' />
                        <p className='ml-1 text-sm'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <a 
                            href={`tel:${user?.phone}`}
                            className='bg-blue-700 whitespace-nowrap text-white p-1 rounded-md text-sm px-2'
                        >
                            {`Gọi ${user?.phone}`}
                        </a>
                        <button
                            type='button'
                            className='text-blue-700 px-2 rounded-md border border-blue-700 text-sm'
                        >
                            Nhắn tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Item)