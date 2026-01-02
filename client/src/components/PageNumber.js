import React, {memo} from 'react'
import { createSearchParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'

const notActive = 'w-[46px] h-[48px] flex justify-center items-center bg-white hover:bg-gray-300 rounded-md'
const active = 'w-[46px] h-[48px] flex justify-center items-center bg-[#E13427] text-white hover:opacity-90 rounded-md cursor-pointer'

const PageNumber = ({text, currentPage, icon, setCurrentPage}) => {
  const navigate = useNavigate()
  const [paramsSearch] = useSearchParams()
  const location = useLocation()

  const handleChangePage = () => {
    if (text !== '...') {
        setCurrentPage(+text)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        let paramsObj = Object.fromEntries([...paramsSearch])
        paramsObj.page = text

        navigate({
            pathname: location.pathname,
            search: createSearchParams(paramsObj).toString()
        });
    }
  }
  
  return (
    <div 
      className={+text === +currentPage ? active : `${notActive} ${text==='...' ? 'cursor-text':'cursor-pointer'}`}
      onClick={handleChangePage}
    >
        {icon || text}
    </div>
  )
}

export default memo(PageNumber)