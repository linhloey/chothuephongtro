import icons from './icons'

const { BsPostcard, BiUserPin, AiOutlineHeart } = icons

const menuManage = [
    {
        id: 1,
        value: 'Đăng tin cho thuê',
        path: '/he-thong/tao-moi-bai-dang',
        icon: <BsPostcard size={18} />
    },
    {
        id: 2,
        value: 'Quản lý tin đăng',
        path: '/he-thong/quan-ly-bai-dang',
        icon: <BsPostcard size={18} />
    },
    {
        id: 3,
        value: 'Thông tin cá nhân',
        path: '/he-thong/sua-thong-tin-ca-nhan',
        icon: <BiUserPin size={18} />
    },
    {
        id: 4,
        value: 'Tin đã lưu',
        path: '/tin-da-luu',
        icon: <AiOutlineHeart size={18} />
    },
]

export default menuManage