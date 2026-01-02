import db from '../models'

export const getOne = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id },
            raw: true,
            attributes: { exclude: ['password'] } // Không gửi mật khẩu về client
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'User not found.',
            response
        })
    } catch (error) {
        reject(error)
    }
})