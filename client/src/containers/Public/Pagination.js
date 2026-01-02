import React, { useEffect, useState, useMemo } from 'react'
import { PageNumber } from '../../components'
import { useSelector } from 'react-redux'
import icons from '../../ultils/icons'
import { useSearchParams } from 'react-router-dom'

const { GrLinkNext, GrLinkPrevious } = icons

const Pagination = ({ }) => {
    const { count, posts } = useSelector(state => state.post)
    const [arrPage, setArrPage] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchParams] = useSearchParams()

    const maxPage = useMemo(() => {
        const limit = +process.env.REACT_APP_LIMIT_POSTS || 10
        return Math.ceil(count / limit)
    }, [count])

    useEffect(() => {
        let page = searchParams.get('page')
        if (page && +page !== currentPage) setCurrentPage(+page)
        if (!page) setCurrentPage(1)
    }, [searchParams])

    useEffect(() => {
        let start = Math.max(currentPage - 1, 1)
        let end = Math.min(currentPage + 1, maxPage)

        if (currentPage === 1) end = Math.min(3, maxPage)
        if (currentPage === maxPage) start = Math.max(maxPage - 2, 1)

        let temp = []
        for (let i = start; i <= end; i++) temp.push(i)
        setArrPage(temp)
    }, [maxPage, currentPage])

    return  (
        <div className='flex items-center justify-center gap-2 py-5'>
            {currentPage > 1 && (
                <PageNumber 
                    icon={<GrLinkPrevious size={20} />} 
                    text={1} 
                    setCurrentPage={setCurrentPage} 
                />
            )}

            {currentPage > 2 && (
                <>
                    {currentPage > 3 && <PageNumber text={'...'} />}
                </>
            )}

            {arrPage.length > 0 && arrPage.map(item => (
                <PageNumber 
                    key={item} 
                    text={item} 
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                />
            ))}

            {currentPage < maxPage - 1 && (
                <>
                    {currentPage < maxPage - 2 && <PageNumber text={'...'} />}
                </>
            )}

            {currentPage < maxPage && (
                <PageNumber 
                    icon={<GrLinkNext size={20} />} 
                    text={maxPage} 
                    setCurrentPage={setCurrentPage} 
                />
            )}
        </div>
    )
}

export default Pagination