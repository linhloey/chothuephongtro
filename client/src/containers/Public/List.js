import React, { useEffect, useRef } from 'react'
import { Button, Item } from '../../components'
import { getPostsLimit } from '../../store/actions/post'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const List = ({categoryCode}) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { posts } = useSelector(state => state.post)

  useEffect(() => {
    let paramsObj = Object.fromEntries([...searchParams])
    if (categoryCode) paramsObj.categoryCode = categoryCode
    dispatch(getPostsLimit(paramsObj))
  }, [searchParams, categoryCode])

  return (
    <div className='w-full p-2 bg-white shadow-md rounded-md px-5'>
      <div className='flex items-center justify-between my-3'>
        <h4 className='text-xl font-semibold'>Danh sách tin đăng</h4>
      </div>
      <div className='flex items-center gap-2 my-2'>
        <span>Sắp xếp:</span>
        <Button bgColor='bg-gray-200' text='Mặc định'/>
        <Button bgColor='bg-gray-200' text='Mới nhất'/>
      </div>
      <div className='items'>
        {posts?.length > 0 && posts.map(item => {
          return (
            <Item
              key={item?.id}
              attributes={item?.attributes}
              description={JSON.parse(item?.description)}
              images={JSON.parse(item?.images?.image)}
              star={+item?.star}
              title={item?.title}
              user={item?.user}
              overview={item?.overview}
              id={item?.id}
            />
          )
        })}
      </div>
    </div>
  )
}

export default List