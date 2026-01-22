import hcmImg from '../assets/thanh-pho-ho-chi-minh.jpg'
import hnImg from '../assets/thanh-pho-ha-noi.jpg'
import dnImg from '../assets/thanh-pho-da-nang.jpg'

export const path = {
    HOME: '/',
    HOME_PAGE: ':page',
    LOGIN: 'login',
    PHONG_TRO: 'phong-tro',
    NHA_NGUYEN_CAN: 'nha-nguyen-can',
    CAN_HO_CHUNG_CU: 'can-ho-chung-cu',
    CAN_HO_MINI: 'can-ho-mini',
    CAN_HO_DICH_VU: 'can-ho-dich-vu',
    O_GHEP: 'o-ghep',
    MAT_BANG: 'mat-bang',
    DETAIL_POST__TITLE__POSTID: 'chi-tiet/:postId',
    THONG_TIN_CA_NHAN: 'thong-tin-ca-nhan',
    SYSTEM: 'he-thong',
    QUAN_LY_NGUOI_DUNG: 'quan-ly-nguoi-dung',
    QUAN_LY_TAT_CA_BAI_DANG: 'quan-ly-tat-ca-bai-dang',
    TAO_MOI_BAI_DANG: 'tao-moi-bai-dang',
    QUAN_LY_BAI_DANG: 'quan-ly-bai-dang',
    TIN_DA_LUU: 'tin-da-luu'
}

export const text = {
    HOME_TITLE: 'Kênh thông tin Phòng Trọ số 1 Việt Nam',
    HOME_DESCRIPTION: 'Cho thuê phòng trọ - Kênh thông tin số 1 về phòng trọ giá rẻ, phòng trọ sinh viên, phòng trọ cao cấp mới nhất năm 2025. Tất cả phòng trọ cho thuê giá tốt nhất tại Việt Nam.',
}

export const location = [
    {   
        id: 'hcm',
        name: 'Phòng trọ Hồ Chí Minh',
        image: hcmImg,
    },
    {
        id: 'hn',
        name: 'Phòng trọ Hà Nội',
        image: hnImg,
    },
    {
        id: 'dn',
        name: 'Phòng trọ Đà Nẵng',
        image: dnImg,
    }
]