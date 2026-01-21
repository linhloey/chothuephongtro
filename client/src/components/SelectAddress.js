import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SelectAddress = ({ setPayload, setFullAddress }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await axios.get('https://provinces.open-api.vn/api/p/');
            if (res.status === 200) setProvinces(res.data);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (province) {
            const fetchDistricts = async () => {
                const res = await axios.get(`https://provinces.open-api.vn/api/p/${province}?depth=2`);
                setDistricts(res.data.districts);
            };
            fetchDistricts();
        }
    }, [province]);

    // Cập nhật địa chỉ đầy đủ mỗi khi chọn xong
    const handleProvinceChange = (e) => {
        const selected = provinces.find(p => p.code === +e.target.value);
        setProvince(e.target.value);
        setFullAddress(prev => `${selected ? selected.name : ''}`);
    };

    return (
        <div className='flex gap-4 mb-4'>
            <select className='border p-2 flex-1 rounded' onChange={handleProvinceChange}>
                <option value="">--Chọn Tỉnh/TP--</option>
                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
            <select className='border p-2 flex-1 rounded' onChange={(e) => setDistrict(e.target.value)}>
                <option value="">--Chọn Quận/Huyện--</option>
                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
            </select>
        </div>
    );
};
export default SelectAddress;