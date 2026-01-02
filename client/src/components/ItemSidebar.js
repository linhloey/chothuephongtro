import React, { memo } from 'react'
import icons from '../ultils/icons'
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import * as actions from '../store/actions'
import { useDispatch } from 'react-redux'

const { GrNext, IoMdCloseCircleOutline } = icons

const ItemSidebar = ({ title, content, isDouble, type }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)
    const activeCode = queryParams.get(type)

    const formatContent = () => {
        const oddEl = content.filter((item, index) => index % 2 !== 0)
        const evenEl = content.filter((item, index) => index % 2 === 0)
        const formatContent = oddEl?.map((item, index) => {
            return {
                right: item,
                left: evenEl?.find((item2, index2) => index2 === index)
            }
        })
        return formatContent
    }

    const handleFilterPosts = (code) => {
        const params = Object.fromEntries([...queryParams])
        params[type] = code
        if (params.page) delete params.page 
        navigate({
            pathname: location.pathname,
            search: createSearchParams(params).toString()
        });
    }

    const handleClearFilter = (e) => {
        e.stopPropagation()
        const params = Object.fromEntries([...queryParams])
        delete params[type]
        navigate({
            pathname: location.pathname,
            search: createSearchParams(params).toString()
        })
    }

    return (
        <div className='p-4 rounded-md bg-white w-full'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>{title}</h3>
                {activeCode && (
                    <span 
                        onClick={handleClearFilter}
                        className='text-[10px] text-red-500 cursor-pointer hover:underline flex items-center gap-1'
                    >
                        Xóa lọc
                    </span>
                )}
            </div>
            { !isDouble && <div className='flex flex-col gap-2'>
                {content?.length > 0 && content.map(item => {
                    return (
                        <Link 
                            to={item.path}
                            key={item.code} 
                            className='text-sm flex flex-1 gap-1 items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 pb-1 border-dashed'
                            >
                            <GrNext size={10} color='#ccc' />
                            <p>{item.value}</p>
                        </Link>
                    )
                })}
            </div>}
            { isDouble && <div className='flex flex-col gap-2'>
                {content?.length > 0 && formatContent(content).map((item, index) => {
                    return (
                        <div key={index}>
                            <div className='flex items-center justify-around'>
                                <div 
                                    onClick={() => handleFilterPosts(item.left.code)}
                                    className={`text-sm flex flex-1 gap-1 items-center cursor-pointer border-b border-gray-200 pb-1 border-dashed 
                                    ${activeCode === item.left.code ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                >
                                    <GrNext size={10} color={activeCode === item.left.code ? '#f97316' : '#ccc'} />
                                    <p>{item.left.value}</p>
                                </div>
                                <div 
                                    onClick={() => handleFilterPosts(item.right.code)}
                                    className={`text-sm flex flex-1 gap-1 items-center cursor-pointer border-b border-gray-200 pb-1 border-dashed 
                                    ${activeCode === item.right.code ? 'text-orange-600 font-bold' : 'hover:text-orange-600'}`}
                                >
                                    <GrNext size={10} color={activeCode === item.right.code ? '#f97316' : '#ccc'} />
                                    <p>{item.right.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>}
        </div>
    )
}

export default memo(ItemSidebar)