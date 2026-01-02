import db from '../models';

// Get all categories
export const getCategoriesService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Category.findAll({
            raw: true,
            attributes: ['code', 'value', 'path'],
        });  
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'Get categories successfully' : 'Failed to get categories',
            response
        });
    } catch (error) {
        reject(error);
    }
})