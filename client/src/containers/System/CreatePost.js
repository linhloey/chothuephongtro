import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
import * as ELG from 'esri-leaflet-geocoder'
import Swal from 'sweetalert2'

import * as actions from '../../store/actions'
import generateCode from '../../ultils/common/generateCode.js'
// Đảm bảo file data.js đã được cập nhật các mã như OU1N, 1U2N...
import { dataPrice, dataArea } from '../../ultils/common/data.js'
import { apiCreatePost } from '../../services/post'

// Cấu hình Icon cho Bản đồ
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const MapController = ({ center }) => {
    const map = useMap()
    useEffect(() => { if (center) map.setView(center, 16, { animate: true }) }, [center])
    return null
}

const CreatePost = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    const categories = [
        { name: 'Phòng trọ', code: 'PT' },
        { name: 'Nhà nguyên căn', code: 'NNC' },
        { name: 'Căn hộ chung cư', code: 'CHCC' },
        { name: 'Căn hộ dịch vụ', code: 'CHDV' },
        { name: 'Căn hộ mini', code: 'CHMN' },
        { name: 'Ở ghép', code: 'OG' },
        { name: 'Mặt bằng', code: 'MB' }
    ]

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [coords, setCoords] = useState([10.7769, 106.7009])
    const [payload, setPayload] = useState({
        category: 'Phòng trọ',
        title: '',
        description: '',
        priceNumber: 0,
        areaNumber: 0,
        province: '',
        district: '',
        ward: '',
        street: '',
        houseNumber: '',
        fullAddress: '',
        images: ["https://phongtro123.com/images/default.jpg"]
    })

    useEffect(() => {
        if (!userData || Object.keys(userData).length === 0) dispatch(actions.getCurrentUser())
    }, [dispatch, userData])

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://provinces.open-api.vn/api/p/')
                setProvinces(res.data)
            } catch (error) { console.log(error) }
        }
        fetchProvinces()
    }, [])

    useEffect(() => {
        const { houseNumber, street, ward, district, province } = payload
        const addressArray = [houseNumber, street, ward, district, province].filter(i => i)
        const exactAddress = addressArray.join(', ')
        setPayload(prev => ({ ...prev, fullAddress: exactAddress }))

        if (addressArray.length >= 3) {
            const delay = setTimeout(() => {
                ELG.geocode().text(exactAddress).run((err, results) => {
                    if (results?.results?.length > 0) {
                        setCoords([results.results[0].latlng.lat, results.results[0].latlng.lng])
                    }
                })
            }, 800)
            return () => clearTimeout(delay)
        }
    }, [payload.province, payload.district, payload.ward, payload.street, payload.houseNumber])

    const handleSubmit = async () => {
        const { priceNumber, areaNumber, category, district, province, title, description, fullAddress, images } = payload

        // 1. Sinh LabelCode (Vẫn dùng generateCode cho Label vì đây là chuỗi biến thiên)
        const labelValue = `Cho thuê ${category.toLowerCase()} ${district}`
        const labelCode = generateCode(labelValue)
        
        // 2. LẤY MÃ CỐ ĐỊNH TỪ DB (Thông qua file data.js)
        // Dùng số người dùng nhập để tìm object tương ứng
        const priceObj = dataPrice.find(p => priceNumber >= p.min && priceNumber < p.max)
        const areaObj = dataArea.find(a => areaNumber >= a.min && areaNumber < a.max)

        const finalBody = {
            title,
            label: labelValue,
            labelCode,
            categoryCode: categories.find(c => c.name === category)?.code || 'PT',
            priceNumber: priceNumber * 1000000, 
            areaNumber,
            // Gửi trực tiếp mã từ data.js (Ví dụ: '1U2N' hoặc '2UMD')
            priceCode: priceObj?.code || '',
            areaCode: areaObj?.code || '',
            priceString: priceNumber >= 1 ? `${priceNumber} triệu/tháng` : `${priceNumber * 1000000} đồng/tháng`,
            areaString: `${areaNumber} m2`,
            address: fullAddress,
            description: description,
            userId: userData?.id,
            images: images,
            district: district,
            province: province 
        }

        if (!finalBody.title || priceNumber === 0 || areaNumber === 0 || !district) {
            return Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ tiêu đề, địa chỉ, giá và diện tích', 'warning')
        }

        const response = await apiCreatePost(finalBody)
        if (response?.data?.err === 0) {
            Swal.fire('Thành công', 'Đã đăng bài thành công!', 'success')
        } else {
            Swal.fire('Lỗi', response?.data?.msg || 'Đăng bài thất bại', 'error')
        }
    }

    return (
        <div className='p-8 bg-white min-h-screen font-sans'>
            <h1 className='text-3xl font-bold border-b pb-4 mb-8 text-blue-800 uppercase'>Đăng bài mới</h1>
            
            <div className='flex flex-col lg:flex-row gap-10'>
                <div className='flex-[2] flex flex-col gap-8'>
                    {/* Phần 1: Địa chỉ */}
                    <section className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                        <h2 className='text-sm font-bold mb-4 text-gray-700 uppercase'>1. Địa chỉ cho thuê</h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                            <select className='border p-2 rounded bg-white' value={provinces.find(i => i.name === payload.province)?.code || ''} onChange={async (e) => {
                                const p = provinces.find(i => i.code === +e.target.value)
                                setPayload(prev => ({ ...prev, province: p?.name || '', district: '', ward: '' }))
                                const res = await axios.get(`https://provinces.open-api.vn/api/p/${e.target.value}?depth=2`)
                                setDistricts(res.data.districts)
                            }}>
                                <option value="">-- Tỉnh/Thành phố --</option>
                                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>

                            <select className='border p-2 rounded bg-white' value={districts.find(i => i.name === payload.district)?.code || ''} onChange={async (e) => {
                                const d = districts.find(i => i.code === +e.target.value)
                                setPayload(prev => ({ ...prev, district: d?.name || '', ward: '' }))
                                const res = await axios.get(`https://provinces.open-api.vn/api/d/${e.target.value}?depth=2`)
                                setWards(res.data.wards)
                            }}>
                                <option value="">-- Quận/Huyện --</option>
                                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                            </select>

                            <select className='border p-2 rounded bg-white' value={wards.find(i => i.name === payload.ward)?.code || ''} onChange={(e) => {
                                const w = wards.find(i => i.code === +e.target.value)
                                setPayload(prev => ({ ...prev, ward: w?.name || '' }))
                            }}>
                                <option value="">-- Phường/Xã --</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>
                        </div>
                        <div className='grid grid-cols-4 gap-4'>
                            <div className='col-span-3'>
                                <input placeholder='Đường/Phố' className='w-full border p-2 rounded' value={payload.street} onChange={e => setPayload({...payload, street: e.target.value})} />
                            </div>
                            <div>
                                <input placeholder='Số nhà' className='w-full border p-2 rounded' value={payload.houseNumber} onChange={e => setPayload({...payload, houseNumber: e.target.value})} />
                            </div>
                        </div>
                        <input className='w-full border p-2 rounded mt-4 bg-gray-100 italic outline-none' value={payload.fullAddress} readOnly />
                    </section>

                    {/* Phần 2: Mô tả */}
                    <section className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                        <h2 className='text-sm font-bold mb-4 text-gray-700 uppercase'>2. Thông tin mô tả</h2>
                        <div className='mb-4 w-full md:w-1/2'>
                            <label className='text-xs font-bold uppercase text-gray-500'>Loại chuyên mục</label>
                            <select className='w-full border p-2 rounded mt-1' value={payload.category} onChange={e => setPayload({...payload, category: e.target.value})}>
                                {categories.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <input placeholder='Tiêu đề bài đăng' className='w-full border p-2 rounded mb-4' value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} />
                        <textarea placeholder='Nội dung mô tả' className='w-full border p-2 rounded h-32 mb-4' value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} />
                        
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs font-bold'>Giá thuê (Triệu/tháng)</label>
                                <input type="number" step="0.1" placeholder='VD: 1.5' className='w-full border p-2 rounded' value={payload.priceNumber} onChange={e => setPayload({...payload, priceNumber: +e.target.value})} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs font-bold'>Diện tích (m²)</label>
                                <input type="number" placeholder='VD: 25' className='w-full border p-2 rounded' value={payload.areaNumber} onChange={e => setPayload({...payload, areaNumber: +e.target.value})} />
                            </div>
                        </div>
                    </section>

                    {/* Phần 3: Liên hệ */}
                    <section className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                        <h2 className='text-sm font-bold mb-4 text-gray-700 uppercase'>3. Thông tin liên hệ</h2>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs text-gray-400'>Tên liên hệ</label>
                                <input className='w-full border p-2 rounded bg-gray-200 outline-none' value={userData?.name || ''} readOnly />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs text-gray-400'>Số điện thoại</label>
                                <input className='w-full border p-2 rounded bg-gray-200 outline-none' value={userData?.phone || ''} readOnly />
                            </div>
                        </div>
                    </section>

                    <button onClick={handleSubmit} className='bg-orange-600 text-white py-4 rounded-lg font-bold text-xl uppercase hover:bg-orange-700 transition-all shadow-lg active:scale-[0.98]'>
                        Xác nhận & Đăng bài
                    </button>
                </div>

                {/* Bản đồ */}
                <div className='flex-1 lg:sticky lg:top-4 h-[450px] border-4 border-white shadow-2xl rounded-2xl overflow-hidden'>
                    <MapContainer center={coords} zoom={16} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={coords} />
                        <MapController center={coords} />
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default CreatePost