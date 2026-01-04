import React, { useCallback, useEffect, useRef, useState} from 'react'
import logo from '../../assets/logo-removebg.png'
import { Button } from '../../components'
import icons from '../../ultils/icons'
import { Link, useNavigate, useSearchParams} from 'react-router-dom'
import { path } from '../../ultils/constant'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/actions'
import menuManage from '../../ultils/menuManage'

const { AiOutlinePlusCircle, GrNext, AiOutlineLogout, AiOutlineUsergroupAdd, MdOutlineLibraryBooks } = icons

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowMenu, setIsShowMenu] = useState(false)

  const [searchParams] = useSearchParams()
  const headerRef = useRef()

  const { isLoggedIn, token } = useSelector(state => state.auth)
  const { userData } = useSelector(state => state.user)

  const goLogin = useCallback((flag) => {
    navigate(path.LOGIN, {state: { flag } })
  },[navigate])

  useEffect(() => {
    headerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'}) //Moi lan chuyen trang se scroll len lai Header o tren cung
  },[searchParams.get('page')])

  useEffect(() => {
    const isUserDataEmpty = !userData || Object.keys(userData).length === 0;

    if (isLoggedIn && token?.length > 30 && isUserDataEmpty) {
        const delay = setTimeout(() => {
            dispatch(actions.getCurrentUser(token));
        }, 100);
        return () => clearTimeout(delay); 
    }
}, [isLoggedIn, token, userData]);

  return (
    <div ref={headerRef} className='w-3/5'>
      <div className='w-full flex items-center justify-between'>
        <Link to={'/'} >
          <img src={logo} alt="logo" className='w-[240px] h-[70px] object-contain'/>
        </Link>
        <div className='flex items-center gap-1'>
          {!isLoggedIn && 
            <div className='flex items-center gap-1'>
              <small>Phongtro.vn xin chào!</small>
              <Button 
                text={'Đăng nhập'} 
                textColor='text-white' 
                bgColor='bg-[#3961fb]' 
                onClick={() => goLogin(false)}
              />
              <Button 
                text={'Đăng ký'} 
                textColor='text-white' 
                bgColor='bg-[#3961fb]'
                onClick={() => goLogin(true)} 
              />
            </div>}
          {isLoggedIn && 
            <div className='flex items-center gap-3 relative'>
              <div className='flex flex-col'>
                  <span className='text-sm'>Xin chào, <span className='font-semibold'>{userData?.name}</span></span>
                  <span className='text-[12px]'>Mã tài khoản: <span className='font-semibold'>{userData?.id?.split('-')[0]}</span></span>
              </div>
              <div className='relative'>
                  <Button 
                      text={'Quản lý tài khoản'} 
                      textColor='text-white' 
                      bgColor='bg-blue-600' 
                      IcAfter={GrNext}
                      onClick={() => setIsShowMenu(prev => !prev)}
                  />
                  {isShowMenu && (
                    <div className='absolute right-0 top-full bg-white shadow-lg border rounded-md min-w-[200px] flex flex-col z-50 mt-2 py-2 text-black'>
                      {/* Cac muc chung cho tat ca user */}
                      {menuManage.map(item => (
                        <Link 
                            key={item.id} 
                            to={item.path}
                            className='px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100 last:border-none'
                            onClick={() => setIsShowMenu(false)}
                        >
                            {item.icon}
                            <span className='text-sm'>{item.value}</span>
                        </Link>
                      ))}
                      {/* Cac muc them cho Admin */}
                      {userData?.roleCode === 'R1' && (
                          <>
                            <div className='px-4 py-2 text-[11px] font-bold text-blue-600 uppercase bg-blue-50'>
                                Quản trị hệ thống
                            </div>
                            <Link
                                to='/he-thong/quan-ly-nguoi-dung'
                                className='px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-50'
                                onClick={() => setIsShowMenu(false)}
                            >
                                <AiOutlineUsergroupAdd size={18} />
                                <span className='text-sm'>Quản lý người dùng</span>
                            </Link>
                            <Link
                                to='/he-thong/quan-ly-tat-ca-bai-dang'
                                className='px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-50'
                                onClick={() => setIsShowMenu(false)}
                            >
                                <MdOutlineLibraryBooks size={18} />
                                <span className='text-sm'>Quản lý tất cả tin</span>
                            </Link>
                          </>
                      )}
                      <div 
                        className='px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-red-600'
                        onClick={() => {
                            setIsShowMenu(false)
                            dispatch(actions.logout())
                        }}
                      >
                        <AiOutlineLogout size={18} />
                        <span className='text-sm font-medium'>Thoát</span>
                      </div>
                    </div>
                  )}
              </div>
            </div> 
          }
          <Button 
              text={'Đăng tin mới'} 
              textColor='text-white' 
              bgColor='bg-secondary2' 
              IcAfter={AiOutlinePlusCircle}
              onClick={() => navigate(isLoggedIn ? '/he-thong/tao-moi-bai-dang' : path.LOGIN)}
          />
        </div>
      </div>
    </div>
  )
}

export default Header 