import db from '../models'

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