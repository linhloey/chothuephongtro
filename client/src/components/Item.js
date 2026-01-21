import React, { memo } from 'react'
import icons from '../ultils/icons'
import { useNavigate, Link } from 'react-router-dom'
import { formatVNToString } from '../ultils/common/formatVNToString'

const indexs = [0, 1, 2, 3]
const { GrStar, RiHeartFill, RiHeartLine, BsBookmarkStarFill } = icons

const Item = ({ images, user, title, star, description, attributes, overview, id }) => {
    const [isHoverHeart, setIsHoverHeart] = React.useState(false);
    
    const pathDetail = `/chi-tiet/${formatVNToString(title)}/${id}`

    const handleStar = (star) => {
        let stars = []
        for (let i = 1; i <= +star; i++) stars.push(<GrStar key={i} className='star-item' size={18} color='yellow' />)
        return stars
    }

    return (
        <div className='w-full flex border-t border-orange-600 py-3'>
            <Link
                to={pathDetail}
                className='w-2/5 grid grid-cols-2 gap-[2px] relative mr-4 cursor-pointer'
            >
                {images.length > 0 && images.filter((i, index) => indexs.some(i => i === index)).map((i, index) => {
                    return (
                        <img key={index} src={i} alt="preview" className='w-full h-full aspect-square object-cover block' />
                    )
                })}
                <span className='bg-overlay-70 text-sm text-white px-2 rounded-md absolute left-1 bottom-1'>{`${images.length} ảnh`}</span>
                <span
                    className='text-white absolute right-1 bottom-0'
                    onMouseEnter={(e) => {
                        e.stopPropagation();        // Ngăn sự kiện click khi nhấn vào trái tim
                        setIsHoverHeart(true)
                    }}
                    onMouseLeave={(e) => {
                        e.stopPropagation();
                        setIsHoverHeart(false)
                    }}
                >
                    {isHoverHeart ? <RiHeartFill size={26} color='red' /> : <RiHeartLine size={26} color='white' />}
                </span>
            </Link>

            <div className='w-3/5'>
                <div className='flex justify-between gap-4 w-full'>
                    <Link to={pathDetail} className='text-red-600 font-medium hover:underline cursor-pointer'>
                        {handleStar(+star).length > 0 && handleStar(+star).map((star, number) => {
                            return (
                                <span key={number}>{star}</span>
                            )
                        })}
                        {title}
                    </Link>
                    
                    <div className='w-[10%] flex justify-end'>
                        <BsBookmarkStarFill size={24} color='orange' />
                    </div>
                </div>

                <div className='my-2 gap-2 flex items-center justify-between'>
                    <span className='text-sm flex-2 font-bold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis'>{attributes?.price}</span>
                    <span className='text-sm flex-1'>{attributes?.acreage}</span>
                    <span className='text-sm flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
                        {`${overview?.address?.split(',')[overview?.address?.split(',').length - 2]}, ${overview?.address?.split(',')[overview?.address?.split(',').length - 1]}`}
                    </span>
                </div>

                <p className='text-gray-500 w-full h-[50px] text-ellipsis overflow-hidden'>
                    {description}
                </p>

                <div className='flex items-center my-5 justify-between'>
                    <div className='flex items-center'>
                        <img src={user?.avatar || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"} alt='avatar' className='w-[30px] h-[30px] object-cover rounded-full' />
                        <p className='ml-1 text-sm'>{user?.name}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <button
                            type='button'
                            className='bg-blue-700 whitespace-nowrap text-white p-1 rounded-md text-sm'
                        >
                            {`Gọi ${user?.phone}`}
                        </button>
                        <button
                            type='button'
                            className='text-blue-700 px-1 rounded-md border border-blue-700 text-sm'
                        >
                            Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Item)