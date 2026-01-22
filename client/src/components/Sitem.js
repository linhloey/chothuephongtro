import React from 'react'
import moment from 'moment'
import 'moment/locale/vi'
import { useNavigate } from 'react-router-dom'
import { formatVNToString } from '../ultils/common/formatVNToString' 

const Sitem = ({ title, price, image, createdAt, id }) => { 
  const navigate = useNavigate()

  const formatTime = (createdAt) => {
    return moment(createdAt).fromNow()
  }

  const handleNavigate = () => {
    navigate(`/chi-tiet/${id}`)
  }

  return (
    <div 
      onClick={handleNavigate} 
      className='w-full flex items-center gap-2 py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-50'
    >
        <img
            src={image[0]}
            alt="anh"
            className='w-[65px] h-[65px] object-cover flex-none rounded-md'
        />
        <div className='w-full flex-auto flex flex-col justify-between gap-1'>
            <h4 className='text-blue-600 text-[14px] font-medium leading-tight'>
                {title?.length > 45 ? `${title?.slice(0, 45)}...` : title}
            </h4>
            <div className='flex items-center justify-between w-full'>
                <span className='text-[12px] font-medium text-green-500'>{price}</span>
                <span className='text-[12px] text-gray-400'>{formatTime(createdAt)}</span>
            </div>
        </div>
    </div>
  )
}

export default Sitem