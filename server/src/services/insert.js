import db from '../models'
import bcrypt from 'bcryptjs'
import { v4} from 'uuid'
import phongtro from '../../data/phongtro.json'
import canhochungcu from '../../data/canhochungcu.json'
import canhodichvu from '../../data/canhodichvu.json'
import canhomini from '../../data/canhomini.json'
import nhanguyencan from '../../data/nhanguyencan.json'
import oghep from '../../data/oghep.json'
import matbang from '../../data/matbang.json'
import generateCode from '../ultis/generateCode'
import { dataPrice, dataArea } from '../ultis/data.js'
import { getNumberFromString } from '../ultis/common.js'
require('dotenv').config()
const dataBody = canhodichvu.body

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12)) //Ham bam mat khau

export const insertService = () => new Promise(async(resolve, reject) => {
    try {
        for (const item of dataBody) {
            let postId = v4()
            let labelCode = generateCode(item?.header?.class?.classType)
            let attributesId = v4()
            let userId = v4()
            let imagesId = v4()
            let overviewId = v4()
            let desc = JSON.stringify(item?.mainContent?.content)
            let currentArea = getNumberFromString(item?.header?.attributes?.acreage)
            let currentPrice = getNumberFromString(item?.header?.attributes?.price)
            await db.Post.create({
                id: postId,
                title: item?.header?.title,
                star: item?.header?.star,
                type: item?.header?.type,
                labelCode,
                attributesId,
                categoryCode: 'CHDV',
                description: desc,
                userId,
                overviewId,
                imagesId,
                areaCode: dataArea.find(area => currentArea >= area.min && currentArea < area.max)?.code || '',
                priceCode: dataPrice.find(price => currentPrice >= price.min && currentPrice < price.max)?.code || '',
            })
            await db.Attribute.create({
                id: attributesId,
                price: item?.header?.attributes?.price,
                acreage: item?.header?.attributes?.acreage,
                published: item?.header?.attributes?.published, 
            })
            await db.Image.create({
                id: imagesId,
                image: JSON.stringify(item?.images)
            })
            await db.Label.findOrCreate({
                where: { code: labelCode },
                defaults: {
                    code: labelCode,
                    value: item?.header?.class?.classType
                }
            })
            await db.Overview.create({
                id: overviewId,
                district: item?.overview?.find(i => i.name === "Tỉnh thành:")?.content,
                address: item?.overview?.find(i => i.name === "Địa chỉ:")?.content,
                code: item?.overview?.find(i => i.name === "Mã tin:")?.content,
                created: item?.overview?.find(i => i.name === "Ngày đăng:")?.content,
                expired: item?.overview?.find(i => i.name === "Ngày hết hạn:")?.content,
            })
            await db.User.create({
                id: userId,
                name: item?.contact?.content?.name ?? null,
                password: hashPassword('123456'),
                phone: item?.contact?.content?.phone ?? null,
                zalo: item?.contact?.content?.zalo ?? null,
                avatar: item?.contact?.content?.image ?? null,
                post: item?.contact?.content?.post ?? null,
                join: item?.contact?.content?.join ?? null,
            })
        }
        resolve('Done.')
    } catch (error) {                                                                                                                             
        reject(error)
    }
})

export const createPriceAndAreas = () => new Promise((resolve, reject) => {
    try {
        dataPrice.forEach(async(item, index) => {
            await db.Price.create({
                code: item.code,
                value: item.value,
                order: index + 1,
            })
        })
        dataArea.forEach(async(item, index) => {
            await db.Area.create({
                code: item.code,
                value: item.value,
                order: index + 1,
            })
        })
        resolve('OK')
    } catch (error) {
        reject(error)
    }
})