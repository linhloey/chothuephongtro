import React, { useEffect } from 'react'
import { Button, Item } from '../../components'
import { getPostsLimit } from '../../store/actions/post'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

const List = ({ categoryCode }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { posts } = useSelector(state => state.post)

    useEffect(() => {
        let paramsObj = Object.fromEntries([...searchParams])
        if (categoryCode) paramsObj.categoryCode = categoryCode
        dispatch(getPostsLimit(paramsObj))
    }, [searchParams, categoryCode])

    // Hàm xử lý khi nhấn nút sắp xếp
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
        <div className='w-full p-2 bg-white shadow-md rounded-md px-5'>
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
                            description={item?.description?.startsWith('[') || item?.description?.startsWith('{') ? JSON.parse(item?.description) : item?.description}
                            images={JSON.parse(item?.images?.image)}
                            star={+item?.star}
                            title={item?.title}
                            user={item?.user}
                            overview={item?.overview}
                            id={item?.id}
                        />
                    )
                }) : <div className='p-4 text-center'>Không có tin đăng nào phù hợp</div>}
            </div>
        </div>
    )
}

export default List