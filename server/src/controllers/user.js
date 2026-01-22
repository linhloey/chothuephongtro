import * as services from '../services/user'
import db from '../models'

export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user // id này lấy từ middleware verifyToken
        const response = await services.getOne(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at user controller: ' + error
        })
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.user
    const payload = req.body
    try {
        if (!payload || !id) return res.status(400).json({ err: 1, msg: 'Thiếu dữ liệu' })
        
        const response = await db.User.update(payload, { where: { id } })
        
        return res.status(200).json({
            err: response[0] > 0 ? 0 : 1,
            msg: response[0] > 0 ? 'Cập nhật thành công' : 'Không có thay đổi nào được thực hiện'
        })
    } catch (error) {
        console.log(error) 
        return res.status(500).json({ err: -1, msg: 'Lỗi server controller user' })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const response = await services.getAllUsers()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at user controller: ' + error
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { id } = req.user 
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) return res.status(400).json({
            err: 1,
            msg: 'Thiếu thông tin mật khẩu'
        })

        const response = await services.changePasswordService(id, req.body)
        
        return res.status(200).json(response)
    } catch (error) {
        console.log("LỖI TẠI CONTROLLER:", error) 
        return res.status(500).json({ err: -1, msg: 'Lỗi server' })
    }
}