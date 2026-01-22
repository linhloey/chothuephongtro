import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'
import { Item } from '../../components'

const SavedPost = () => {
    const dispatch = useDispatch()
    
    // LẤY DỮ LIỆU TỪ REDUX THAY VÌ USESTATE
    // Lưu ý: Hãy đảm bảo trong postReducer bạn đã khai báo biến savedPosts
    const { savedPosts, msg } = useSelector(state => state.post)
    const { isLoggedIn } = useSelector(state => state.auth)

    useEffect(() => {
        // Mỗi khi reload trang, fetch lại data từ server đổ vào Redux
        if (isLoggedIn) {
            dispatch(actions.getSavedPosts())
        }
    }, [isLoggedIn, dispatch])

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[850px] flex flex-col gap-6 py-6 px-4'>
                <div className='border-b border-gray-200 pb-4'>
                    <h1 className='text-2xl font-bold text-gray-800'>Tin đăng đã lưu</h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        {savedPosts?.length > 0 
                            ? `Bạn đang lưu ${savedPosts.length} bài niêm yết` 
                            : 'Danh sách yêu thích của bạn'}
                    </p>
                </div>

                <div className='flex flex-col'>
                    {savedPosts?.length > 0 ? (
                        savedPosts.map(item => {
                            // Cấu trúc thông thường: item là object chứa postData
                            const post = item?.postData 
                            if (!post) return null

                            return (
                                <div key={item?.id} className='border-b last:border-none'>
                                    <Item
                                        // postId này dùng để so sánh với mảng savedIds trong Item.js
                                        id={item?.postId} 
                                        title={post?.title}
                                        star={+post?.star}
                                        description={post?.description?.startsWith('[') || post?.description?.startsWith('{') 
                                            ? JSON.parse(post?.description) 
                                            : post?.description}
                                        images={post?.images?.image ? JSON.parse(post?.images?.image) : []}
                                        attributes={post?.attributes}
                                        user={post?.user}
                                        overview={post?.overview}
                                    />
                                </div>
                            )
                        })
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
                            <p className='text-gray-600 text-lg'>Bạn chưa lưu tin đăng nào.</p>
                            <button 
                                onClick={() => window.history.back()}
                                className='mt-4 text-blue-600 hover:underline font-medium'
                            >
                                Quay lại tìm tin ngay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SavedPost