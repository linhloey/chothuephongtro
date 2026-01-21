import * as postService from '../services/post.js';
import { v4 } from 'uuid'

export const getPosts = async (req, res) => {
    try {
        const response = await postService.getPostsService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller: ' + error,
        });
    }
};

export const getPostsLimit = async (req, res) => {
    const { page, ...query } = req.query;
    try {
        const response = await postService.getPostsLimitService(page, query);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller: ' + error,
        });
    }
};

export const getNewPosts = async (req, res) => {
    try {
        const response = await postService.getNewPostService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at post controller: ' + error,
        });
    }
};

export const getOnePost = async (req, res) => {
    const { postId } = req.query
    try {
        const response = await postService.getOnePostService(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ 
            err: -1, 
            msg: error.message || 'Fail at post controller' 
        })
    }
}

export const getPostsAdmin = async (req, res) => {
    try {
        const response = await postService.getPostsAdminService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Lỗi server' })
    }
}

export const getPostsUser = async (req, res) => {
    try {
        const { page, ...query } = req.query;
        const { id } = req.user; // ID người dùng đăng nhập
        if (!id) return res.status(400).json({ err: 1, msg: "Thiếu ID người dùng" });

        const response = await postService.getPostsUserService(page, query, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Lỗi controller: ' + error });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.query; 
        const { id: userId, roleCode } = req.user; 

        if (!postId) return res.status(400).json({ err: 1, msg: "Thiếu ID bài đăng" });

        const response = await postService.deletePostService(postId, userId, roleCode);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Lỗi controller: ' + error });
    }
};

export const createNewPost = async (req, res) => {
    try {
        const { categoryCode, title, priceNumber, areaNumber, label } = req.body
        const { id } = req.user // Lấy từ middleware verifyToken gán vào

        // Kiểm tra sơ bộ dữ liệu đầu vào
        if (!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu thông tin đầu vào (title, giá, diện tích hoặc danh mục...)'
            })
        }

        // Gọi service để xử lý lưu vào DB
        const response = await postService.createNewPostService(req.body, id)
        
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Lỗi tại controller post: ' + error
        })
    }
}