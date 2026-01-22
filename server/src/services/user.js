import db from '../models'
import bcrypt from 'bcryptjs'

export const getOne = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id },
            raw: true,
            attributes: { exclude: ['password'] } // Không trả về password
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'User not found',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getAllUsers = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findAll({
            attributes: { exclude: ['password'] },
            raw: true
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get users',
            users: response
        })
    } catch (error) { reject(error) }
})

export const changePasswordService = (id, { oldPassword, newPassword }) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({ where: { id }, raw: true })
        if (!user) return resolve({ err: 1, msg: 'Người dùng không tồn tại' })

        const isChecked = bcrypt.compareSync(oldPassword, user.password)
        
        if (!isChecked) resolve({
            err: 1,
            msg: 'Mật khẩu cũ không chính xác'
        })
        else {
            const hashPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(12))
            await db.User.update({ password: hashPassword }, { where: { id } })
            resolve({
                err: 0,
                msg: 'Đổi mật khẩu thành công'
            })
        }
    } catch (error) { 
        console.log("LỖI TẠI SERVICE:", error)
        reject(error) 
    }
})