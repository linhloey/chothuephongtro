import React, { use, useEffect } from 'react'
import { text } from '../../ultils/constant'
import { Province, ItemSidebar, RelatedPost } from '../../components'
import { List, Pagination } from './index'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions'
 
const RentalRoom = () => {
  const { categories, prices, areas } = useSelector(state => state.app)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.getPrices())
    dispatch(actions.getAreas())
  }, []);

  return (
    <div className='w-full flex flex-col gap-3 shrink-0'>
      <div>
        <h1 className='text-[28px] font-bold'>{text.HOME_TITLE}</h1>
        <p className='text-base text-gray-700'>{text.HOME_DESCRIPTION}</p>
      </div>
      <Province />
      <div className='w-full flex gap-4'>
        <div className='w-[70%]'>
          <List />
          <Pagination />
        </div>
        <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
          <ItemSidebar content={categories} title='Danh mục cho thuê' />
          <ItemSidebar isDouble={true} type='priceCode' content={prices} title='Xem theo giá' />
          <ItemSidebar isDouble={true} type='areaCode' content={areas} title='Xem theo diện tích' />
          <RelatedPost />
        </div>
      </div>
      
    </div>
  )
}

export default RentalRoom