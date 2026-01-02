import React, { useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'


const notActive = 'hover:bg-secondary2 bg-secondary1 h-full flex items-center px-4'
const active = 'hover:bg-secondary2 bg-secondary2 h-full flex items-center px-4'

const Navigation = () => {

  const dispatch = useDispatch()
  const { categories } = useSelector(state => state.app)

  useEffect(() => {
    dispatch(actions.getCategories())
  },[dispatch])
  
  return (
    <div className='w-full flex justify-center items-center h-[40px] bg-secondary1 text-white'>
        <div className='w-3/5 flex h-full text-sm font-medium'>
            <div className='h-full'>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? active : notActive}
                end 
              >
                Trang chủ
              </NavLink>
            </div>
            {categories?.length > 0 && categories.map(item => {
                return (
                  <div key={item.code} className='h-full'>
                    <NavLink to={item.path} className={({ isActive }) => isActive ? active : notActive}>
                        {item.value}
                    </NavLink>
                  </div>
                )
            })}
        </div>
    </div>
  )
}

export default Navigation