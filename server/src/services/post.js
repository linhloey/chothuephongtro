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

        // 1. XỬ LÝ ĐỊNH DẠNG THỜI GIAN: Thứ 4, 13:05 12/11/2025
        moment.locale('vi')
        const formatVietnameseDate = (dateObj) => {
            const dayOfWeek = dateObj.format('E'); // Lấy số thứ tự trong tuần (2-7, 8 cho CN)
            const dayPrefix = dayOfWeek === '1' ? 'Chủ Nhật' : `Thứ ${parseInt(dayOfWeek) + 1}`;
            // parseInt(dayOfWeek) + 1 vì moment 'E' trả về 1 (Thứ 2) -> 7 (CN) tùy cấu hình, 
            // Cách an toàn nhất cho tiếng Việt:
            const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const dayName = days[dateObj.day()];
            return `${dayName}, ${dateObj.format('HH:mm DD/MM/YYYY')}`;
        };

        const currentDate = moment();
        const finalDate = formatVietnameseDate(currentDate); // Thứ 4, 13:05 12/11/2025
        const expireDate = formatVietnameseDate(moment(currentDate).add(30, 'days'));

        // 2. Xử lý chuỗi "Hà Nội" (Lọc bỏ chữ "Thành phố" hoặc "Tỉnh")
        const provinceName = body.province 
            ? body.province.replace('Thành phố ', '').replace('Tỉnh ', '') 
            : body.district

        // 3. Tạo Label
        await db.Label.findOrCreate({
            where: { code: labelCode },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })

        // 4. Tạo Post
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

        // 5. Tạo các bảng phụ
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

        // 6. Tạo Overview (Lưu Hà Nội, Address và Ngày tháng đúng định dạng)
        await db.Overview.create({
            id: overviewId,
            code: `#${Math.floor(Math.random() * 100000)}`,
            district: provinceName, 
            address: body.address, 
            created: finalDate,   // Thứ 4, 13:05 12/11/2025
            expired: expireDate,  // Thứ..., 13:05 12/12/2025
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

// Thêm tham số userId vào hàm
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

export const updatePostService = ({ postId, ...payload }, userId, roleCode) => new Promise(async (resolve, reject) => {
    try {
        // CHẶN ADMIN: Nếu roleCode là R1 (Admin), trả về lỗi ngay lập tức
        if (roleCode === 'R1') {
            return resolve({
                err: 1,
                msg: 'Admin chỉ có quyền xóa, không có quyền sửa nội dung bài đăng của người dùng.'
            })
        }

        // Với User bình thường (R2): Chỉ cho phép sửa bài của chính mình
        const response = await db.Post.update(payload, {
            where: { id: postId, userId } // Bắt buộc phải khớp cả ID bài và ID người đăng
        })

        resolve({
            err: response[0] > 0 ? 0 : 1,
            msg: response[0] > 0 ? 'Cập nhật thành công' : 'Bạn không có quyền sửa bài này hoặc bài đăng không tồn tại.'
        })
    } catch (error) {
        reject(error)
    }
})