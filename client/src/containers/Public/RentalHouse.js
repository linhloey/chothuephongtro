import React, { use, useEffect, useState } from 'react'
import { text } from '../../ultils/constant'
import { Province, ItemSidebar, RelatedPost } from '../../components'
import { List, Pagination } from './index'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const RentalHouse = () => {
  const { prices, areas, categories } = useSelector(state => state.app)
  const [ categoryCode, setCategoryCode ] = useState('')
  const location = useLocation()

  useEffect(() => {
    const category = categories?.find(item => item.path === location.pathname)
    if (category) {
      setCategoryCode(category.code)
    }
  }, [location])

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
          <ItemSidebar isDouble={true} type='priceCode' content={prices} title='Xem theo giá' />
          <ItemSidebar isDouble={true} type='areaCode' content={areas} title='Xem theo diện tích' />
          <RelatedPost />
        </div>
      </div>
      
    </div>
  )
}

export default RentalHouse