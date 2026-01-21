import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetOnePost } from '../../services/post'
import Slider from "react-slick"
import icons from '../../ultils/icons'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const { HiOutlineLocationMarker, TbReportMoney, RiCrop2Line, MdOutlineAccessTime, GrStar } = icons

const DetailPost = () => {
    const { postId } = useParams()
    const [post, setPost] = useState(null)
    // Thêm state và ref để điều khiển slide
    const [currentSlide, setCurrentSlide] = useState(0)
    const sliderRef = useRef(null)

    const settings = {
        dots: false, // Tắt dots vì đã dùng thumbnail bên dưới
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: true,
        afterChange: (index) => setCurrentSlide(index) // Cập nhật ảnh đang xem
    };

    useEffect(() => {
        const fetchPost = async () => {
            const response = await apiGetOnePost(postId)
            if (response?.data.err === 0) setPost(response.data.response)
        }
        fetchPost()
        window.scrollTo(0, 0)
    }, [postId])

    if (!post) return <div className='w-full text-center py-10 font-medium text-gray-500'>Đang tải dữ liệu bài đăng...</div>

    const images = post?.images?.image ? JSON.parse(post.images.image) : []
    const description = post?.description ? JSON.parse(post.description) : []

    // Sửa lại phần sao: Luôn hiện 5 sao (vàng cho điểm thật, xám cho điểm trống)
    const renderStar = (star) => {
        let stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(<GrStar key={i} size={20} color={i <= +star ? '#feba02' : '#ccc'} />)
        }
        return stars
    }

    return (
        <div className='w-full flex flex-col gap-3'>
            <div className='text-[14px] flex gap-2'>
                <span className='text-blue-600 font-medium cursor-pointer'>Trang chủ</span>
                <span>/</span>
                <span className='text-blue-600 font-medium cursor-pointer'>{post?.label?.value}</span>
            </div>

            <div className='w-full flex gap-4'>
                {/* CỘT TRÁI (70%) */}
                <div className='w-[70%] flex flex-col gap-4'>
                    
                    {/* KHU VỰC SLIDE ẢNH - GIỮ NGUYÊN STYLE CŨ NHƯNG THÊM THUMBNAIL */}
                    <div className='w-full bg-white rounded-lg shadow-lg p-2'>
                        <div className='w-full bg-black rounded-lg overflow-hidden relative'>
                            <Slider ref={sliderRef} {...settings}>
                                {images.map((item, index) => (
                                    <div key={index} className='h-[450px] outline-none'>
                                        <img 
                                            src={item} 
                                            alt={`slide-${index}`} 
                                            className='w-full h-full object-contain m-auto' 
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {/* Danh sách ảnh nhỏ đứng yên bên dưới - Click để nhảy slide */}
                        <div className='flex justify-center flex-wrap gap-2 mt-3'>
                            {images.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => sliderRef.current.slickGoTo(index)}
                                    className={`w-20 h-16 cursor-pointer rounded overflow-hidden border-2 transition-all 
                                    ${currentSlide === index ? 'border-orange-500 shadow-md' : 'border-transparent opacity-70'}`}
                                >
                                    <img src={item} alt="thumb" className='w-full h-full object-cover' />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GIỮ NGUYÊN TOÀN BỘ PHẦN THÔNG TIN BÊN DƯỚI CỦA BẠN */}
                    <div className='bg-white rounded-md shadow-sm p-6'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-1'>
                                {renderStar(post?.star)}
                                <span className='text-red-600 font-bold text-lg ml-2'>{post?.type}</span>
                            </div>
                            <h1 className='text-2xl font-bold text-red-600 uppercase leading-tight'>{post?.title}</h1>
                        </div>

                        <div className='flex items-center justify-between py-4 border-y my-6'>
                            <div className='flex flex-col items-center flex-1 border-r'>
                                <span className='text-gray-500 text-xs uppercase mb-1'>Mức giá</span>
                                <span className='text-xl font-bold text-green-600 flex items-center gap-1'>
                                    <TbReportMoney /> {post?.attributes?.price}
                                </span>
                            </div>
                            <div className='flex flex-col items-center flex-1 border-r'>
                                <span className='text-gray-500 text-xs uppercase mb-1'>Diện tích</span>
                                <span className='text-xl font-bold flex items-center gap-1 text-gray-800'>
                                    <RiCrop2Line /> {post?.attributes?.acreage}
                                </span>
                            </div>
                            <div className='flex flex-col items-center flex-1'>
                                <span className='text-gray-500 text-xs uppercase mb-1'>Cập nhật</span>
                                <span className='text-sm flex items-center gap-1 italic text-gray-800'>
                                    <MdOutlineAccessTime /> {post?.attributes?.published}
                                </span>
                            </div>
                        </div>

                        <div className='mt-8 mb-10'>
                            <h2 className='text-xl font-bold mb-4'>Đặc điểm tin đăng</h2>
                            <table className='w-full border-collapse text-sm'>
                                <tbody>
                                    <tr className='bg-gray-50'>
                                        <td className='p-3 border text-gray-500 font-medium text-base'>Loại tin:</td>
                                        <td className='p-3 border text-base'>{post?.label?.value}</td>
                                    </tr>
                                    <tr>
                                        <td className='p-3 border text-gray-500 font-medium text-base'>Tỉnh thành:</td>
                                        <td className='p-3 border text-base'>{post?.overview?.district || 'Hồ Chí Minh'}</td>
                                    </tr>
                                    <tr>
                                        <td className='p-3 border text-gray-500 font-medium text-base'>Địa chỉ:</td>
                                        <td className='p-3 border text-base'>{post?.overview?.address || 'Hồ Chí Minh'}</td>
                                    </tr>
                                    <tr className='bg-gray-50'>
                                        <td className='p-3 border text-gray-500 w-1/3 font-medium text-base'>Mã tin:</td>
                                        <td className='p-3 border text-base'>{post?.overview?.code}</td>
                                    </tr>
                                    <tr>
                                        <td className='p-3 border text-gray-500 font-medium text-base'>Ngày đăng:</td>
                                        <td className='p-3 border text-base'>{post?.overview?.created}</td>
                                    </tr>
                                    <tr className='bg-gray-50'>
                                        <td className='p-3 border text-gray-500 font-medium text-base'>Ngày hết hạn:</td>
                                        <td className='p-3 border text-base'>{post?.overview?.expired}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='mb-8 border-t pt-8'>
                            <h2 className='text-xl font-bold mb-4'>Thông tin mô tả</h2>
                            <div className='flex flex-col gap-3 text-gray-800 leading-8 text-[16px]'>
                                {description.map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (GIỮ NGUYÊN) */}
                <div className='w-[30%] flex flex-col gap-4'>
                    <div className='bg-[#feba02] p-6 rounded-lg flex flex-col items-center text-center sticky top-5 shadow-lg'>
                        <img 
                            src={post?.user?.avatar || 'https://via.placeholder.com/100'} 
                            className='w-24 h-24 rounded-full border-4 border-white object-cover mb-4 shadow-md'
                            alt="host"
                        />
                        <h3 className='font-bold text-xl uppercase mb-1'>{post?.user?.name}</h3>
                        <div className='flex items-center gap-2 mb-6'>
                            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                            <p className='text-sm italic'>Đang hoạt động</p>
                        </div>
                        
                        <button className='w-full bg-[#16a34a] text-white py-3 rounded-md font-bold text-2xl shadow-md mb-4 hover:scale-105 transition-all'>
                            {post?.user?.phone}
                        </button>
                        <a 
                            href={`https://zalo.me/${post?.user?.phone}`}
                            target='_blank' rel='noreferrer'
                            className='w-full bg-blue-700 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all'
                        >
                            Nhắn Zalo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPost