import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4} from 'uuid'
require('dotenv').config()

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12)) //Ham bam mat khau

export const registerService = ({phone, password, name}) => new Promise(async(resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({ // Tra ve 1 mang, phan tu dau tien la 1 object {phone, password, name, id}
            where: {phone},                           // phan tu thu 2 la true(tao moi tai khoan) hoac false(tai khoan da ton tai)
            defaults: {
                phone,
                name,
                password: hashPassword(password),
                id: v4()
            }
        })
        const token = response[1] && jwt.sign({id: response[0].id, phone: response[0].phone}, process.env.SECRET_KEY, {expiresIn: '2d'})          // Ham sign nhan doi so 1 la object muon ma hoa thanh token
        resolve({                                                                                                                                 // doi so 2 la secret_key. Neu response[1] tra ve true (tao moi tai khoan) thi gan cho token
            err: token ? 0 : 2,
            msg: token ? 'Register is successfully' : 'Phone number has been already used',
            token: token || null
        })
        
    } catch (error) {                                                                                                                             
        reject(error)
    }
})

export const loginService = ({phone, password}) => new Promise(async(resolve, reject) => {
    try {
        const response = await db.User.findOne({ // Tra ve 1 object {phone, password, id} neu co sdt, neu khong thi null
            where: {phone},                           
            raw: true
        })
        const isCorrectPassword = response && bcrypt.compareSync(password, response.password)           // Ham so sanh password nguoi dung nhap voi password da duoc bam trong response
        const token = isCorrectPassword && jwt.sign({id: response.id, phone: response.phone}, process.env.SECRET_KEY, {expiresIn: '2d'})          
        resolve({                                                                                                                                 
            err: token ? 0 : 2,
            msg: token ? 'Login is successfully' : response ? 'Password is wrong' : 'Phone number not found',
            token: token || null
        })
        
    } catch (error) {                                                                                                                             
        reject(error)
    }
})