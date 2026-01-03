import React, { useState, useEffect } from 'react'
import { text } from '../../ultils/constant'
import { Province, ItemSidebar, RelatedPost } from '../../components'
import { List, Pagination } from './index'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions'
import { useLocation } from 'react-router-dom'

const Collection = () => {
  const { categories, prices, areas } = useSelector(state => state.app)
  const dispatch = useDispatch()
  const location = useLocation()
  const [categoryCurrent, setCategoryCurrent] = useState({})

  useEffect(() => {
      const category = categories?.find(item => item.path === location.pathname)
      setCategoryCurrent(category)
  }, [location.pathname, categories])

  useEffect(() => {
    dispatch(actions.getPrices())
    dispatch(actions.getAreas())
  }, []);

  return (
    <div className='w-full flex flex-col gap-3 shrink-0'>
      <div>
        <h1 className='text-[28px] font-bold'>{categoryCurrent?.header}</h1>
        <p className='text-base text-gray-700'>{categoryCurrent?.subheader}</p>
      </div>
      <Province />
      <div className='w-full flex gap-4'>
        <div className='w-[70%]'>
          <List categoryCode={categoryCurrent?.code} />
          <Pagination />
        </div>
        <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
          <ItemSidebar isDouble={true} type='priceCode' content={prices} title='Xem theo giá' />
          <ItemSidebar isDouble={true} type='areaCode' content={areas} title='Xem theo diện tích' />
          <RelatedPost />
        </div>
      </div>
    </div>
  )
}

export default Collection