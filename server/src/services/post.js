import { where } from 'sequelize';
import db from '../models';
import { v4 } from 'uuid'
import moment from 'moment'
import 'moment/locale/vi'

export const getPostsService = () => new Promise(async(resolve, reject) => {
    try {       
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                {model: db.Image, as: 'images', attributes: ['image']},
                {model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published']},
                {model: db.User, as: 'user', attributes: ['name', 'phone','zalo']},
                {model: db.Overview, as: 'overview', attributes: ['address']},
            ],
            attributes: ['id', 'title', 'star', 'description'],
        });
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Get posts successfully' : 'Cannot get posts',
            response,
        })
    } catch (error) {
        reject(error);
    }
});

export const getPostsLimitService = (page, query) => new Promise(async (resolve, reject) => {
    try {
        const { order, ...filters } = query;
        let offset = (!page || +page <= 1) ? 0 : (+page - 1);

        const sqlOrder = order === 'createdAt' 
            ? [['createdAt', 'DESC']] 
            : [['id', 'DESC']];

        const response = await db.Post.findAndCountAll({
            where: filters, 
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            order: sqlOrder, 
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published'] },
                { model: db.User, as: 'user', attributes: ['name', 'phone', 'zalo'] },
                { model: db.Overview, as: 'overview', attributes: ['address'] },
            ],
            attributes: ['id', 'title', 'star', 'description', 'createdAt'], // Thêm createdAt để kiểm tra nếu cần
        });

        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Get posts successfully' : 'Cannot get posts',
            response,
        });
    } catch (error) {
        reject(error);
    }
});

export const getNewPostService = () => new Promise(async(resolve, reject) => {
    try {      
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt','DESC']],
            limit: +process.env.LIMIT,
            include: [
                {model: db.Image, as: 'images', attributes: ['image']},
                {model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published']},
            ],
            attributes: ['id', 'title', 'star','createdAt'],
        });
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Get posts successfully' : 'Cannot get posts',
            response,
        })
    } catch (error) {
        reject(error);
    }
});

export const getOnePostService = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findOne({
            where: { id: postId },
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published'] },
                { model: db.User, as: 'user', attributes: ['name', 'phone', 'zalo', 'avatar'] },
                { model: db.Overview, as: 'overview', attributes: ['code', 'address', 'created', 'expired'] },
                { model: db.Label, as: 'label', attributes: ['value'] },
            ],
            attributes: ['id', 'title', 'star', 'description'],
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get post detail',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getPostsAdminService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published'] },
                { model: db.User, as: 'user', attributes: ['name', 'phone'] },
                { model: db.Overview, as: 'overview' },
                { model: db.Label, as: 'label', attributes: ['value'] } 
            ],
            order: [['createdAt', 'DESC']]
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get posts.',
            response
        })
    } catch (error) { reject(error) }
})

export const deletePostService = (postId, userId, roleCode) => new Promise(async (resolve, reject) => {
    try {
        const condition = roleCode === 'R1' ? { id: postId } : { id: postId, userId }

        const response = await db.Post.destroy({
            where: condition
        });

        resolve({
            err: response > 0 ? 0 : 1,
            msg: response > 0 ? 'Xóa bài đăng thành công' : 'Không tìm thấy bài hoặc bạn không có quyền xóa bài này',
        });
    } catch (error) {
        reject(error);
    }
});

export const createNewPostService = (body) => new Promise(async (resolve, reject) => {
    try {
        const attributesId = v4()
        const imagesId = v4()
        const overviewId = v4()
        const postId = v4()
        const labelCode = body.labelCode

        moment.locale('vi')
        const formatVietnameseDate = (dateObj) => {
            const dayOfWeek = dateObj.format('E'); 
            const dayPrefix = dayOfWeek === '1' ? 'Chủ Nhật' : `Thứ ${parseInt(dayOfWeek) + 1}`;
            const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const dayName = days[dateObj.day()];
            return `${dayName}, ${dateObj.format('HH:mm DD/MM/YYYY')}`;
        };

        const currentDate = moment();
        const finalDate = formatVietnameseDate(currentDate); 
        const expireDate = formatVietnameseDate(moment(currentDate).add(30, 'days'));

        const provinceName = body.province 
            ? body.province.replace('Thành phố ', '').replace('Tỉnh ', '') 
            : body.district

        await db.Label.findOrCreate({
            where: { code: labelCode },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })

        await db.Post.create({
            id: postId,
            title: body.title,
            labelCode,
            address: body.address,
            attributesId,
            categoryCode: body.categoryCode,
            description: JSON.stringify([body.description]),
            userId: body.userId,
            overviewId,
            imagesId,
            areaCode: body.areaCode,
            priceCode: body.priceCode,
        })

        await db.Attribute.create({
            id: attributesId,
            price: body.priceString,
            acreage: body.areaString,
            published: finalDate,
        })

        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })

        await db.Overview.create({
            id: overviewId,
            code: `#${Math.floor(Math.random() * 100000)}`,
            district: provinceName, 
            address: body.address, 
            created: finalDate,  
            expired: expireDate,  
        })

        resolve({
            err: 0,
            msg: 'Đăng bài thành công với định dạng ngày tháng mới'
        })

    } catch (error) {
        console.log(error)
        reject(error)
    }
})

export const getPostsUserService = (page, query, userId) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1);
        const response = await db.Post.findAndCountAll({
            // Quan trọng: Kết hợp filter từ query và userId của người dùng
            where: { ...query, userId }, 
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published'] },
                { model: db.User, as: 'user', attributes: ['name', 'phone', 'zalo'] },
                { model: db.Overview, as: 'overview' },
            ],
        });
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Không thể lấy danh sách bài đăng.',
            response,
        });
    } catch (error) {
        reject(error);
    }
});

export const updatePostService = ({ postId, attributesId, imagesId, overviewId, ...body }) => new Promise(async (resolve, reject) => {
    try {
        await db.Post.update({
            title: body.title,
            labelCode: body.labelCode,
            categoryCode: body.categoryCode,
            address: body.address,
            description: JSON.stringify(body.description),
        }, { where: { id: postId } });

        await db.Attribute.update({
            price: body.price,
            acreage: body.acreage,
        }, { where: { id: attributesId } });

        await db.Image.update({
            image: JSON.stringify(body.images)
        }, { where: { id: imagesId } });

        await db.Overview.update({
            area: body.area,
            type: body.type,
            target: body.target,
        }, { where: { id: overviewId } });

        resolve({ err: 0, msg: 'Cập nhật thành công' });
    } catch (error) { reject(error) }
})

export const savePostService = (userId, postId) => new Promise(async (resolve, reject) => {
    try {
        // Kiểm tra xem user đã lưu bài này chưa
        const exist = await db.SavePost.findOne({ 
            where: { userId, postId }, 
            raw: true 
        });

        if (exist) {
            // Nếu đã lưu rồi thì Xóa (Bỏ lưu)
            await db.SavePost.destroy({ where: { userId, postId } });
            resolve({ err: 0, msg: 'Đã bỏ lưu tin đăng' });
        } else {
            // Nếu chưa lưu thì Thêm mới
            await db.SavePost.create({ userId, postId });
            resolve({ err: 0, msg: 'Lưu tin đăng thành công' });
        }
    } catch (error) { 
        reject(error); 
    }
});

// Lấy danh sách bài đăng đã lưu của User
export const getSavedPostsService = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.SavePost.findAll({
            where: { userId },
            raw: true,
            nest: true,
            include: [
                { 
                    model: db.Post, 
                    as: 'postData', // Phải khớp với "as" trong model SavePost
                    include: [
                        { model: db.Image, as: 'images', attributes: ['image'] },
                        { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage'] },
                        { model: db.User, as: 'user', attributes: ['name', 'avatar', 'phone'] },
                        { model: db.Overview, as: 'overview', attributes: ['address'] }
                    ]
                }
            ]
        });
        resolve({ 
            err: response ? 0 : 1, 
            msg: response ? 'OK' : 'Không tìm thấy tin đã lưu',
            response 
        });
    } catch (error) { 
        reject(error); 
    }
});