import React, { useEffect } from 'react'
import { Button, Item } from '../../components'
import { getPostsLimit, getSavedPosts } from '../../store/actions/post'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

const List = ({ categoryCode }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const { posts } = useSelector(state => state.post)
    const { isLoggedIn } = useSelector(state => state.auth)

    // EFFECT 1: Đồng bộ danh sách tin đã lưu từ Server vào Redux
    // Chạy khi: Mới load trang (Reload) hoặc khi trạng thái đăng nhập thay đổi
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getSavedPosts())
        }
    }, [isLoggedIn, dispatch])

    // EFFECT 2: Fetch danh sách bài đăng theo bộ lọc/phân trang
    // Chạy khi: Thay đổi trang, thay đổi giá, diện tích, hoặc category
    useEffect(() => {
        let paramsObj = Object.fromEntries([...searchParams])
        if (categoryCode) paramsObj.categoryCode = categoryCode
        
        // Luôn fetch bài mới dựa trên params của URL
        dispatch(getPostsLimit(paramsObj))
        
        // Cuộn lên đầu trang mỗi khi chuyển trang/lọc
        const listElement = document.getElementById('list-post')
        if (listElement) listElement.scrollIntoView({ behavior: 'smooth' })
    }, [searchParams, categoryCode, dispatch])

    const handleSort = (sortType) => {
        const params = new URLSearchParams(searchParams)
        if (sortType === 'newest') {
            params.set('order', 'createdAt') 
        } else {
            params.delete('order') 
        }
        navigate({
            pathname: location.pathname,
            search: params.toString()
        })
    }

    const currentOrder = searchParams.get('order')

    return (
        <div id='list-post' className='w-full p-2 bg-white shadow-md rounded-md px-5'>
            <div className='flex items-center justify-between my-3'>
                <h4 className='text-xl font-semibold'>Danh sách tin đăng</h4>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <span>Sắp xếp:</span>
                <Button 
                    bgColor={!currentOrder ? 'bg-blue-600 text-white' : 'bg-gray-200'} 
                    text='Mặc định'
                    onClick={() => handleSort('default')}
                />
                <Button 
                    bgColor={currentOrder === 'createdAt' ? 'bg-blue-600 text-white' : 'bg-gray-200'} 
                    text='Mới nhất'
                    onClick={() => handleSort('newest')}
                />
            </div>
            <div className='items'>
                {posts?.length > 0 ? posts.map(item => {
                    return (
                        <Item
                            key={item?.id}
                            attributes={item?.attributes}
                            // Kiểm tra và parse description an toàn
                            description={item?.description?.startsWith('[') || item?.description?.startsWith('{') 
                                ? JSON.parse(item?.description) 
                                : item?.description}
                            // Parse mảng ảnh an toàn
                            images={item?.images?.image ? JSON.parse(item?.images?.image) : []}
                            star={+item?.star}
                            title={item?.title}
                            user={item?.user}
                            overview={item?.overview}
                            id={item?.id}
                        />
                    )
                }) : (
                    <div className='p-10 text-center flex flex-col items-center gap-4'>
                        <span className='text-gray-400 text-lg'>Không có tin đăng nào phù hợp với bộ lọc của bạn.</span>
                        <Button 
                            text='Xóa bộ lọc' 
                            bgColor='bg-orange-500 text-white' 
                            onClick={() => navigate(location.pathname)} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default List