import express from 'express';
import * as postController from '../controllers/post';
import verifyToken from '../middlewares/verifyToken'
import { isAdmin } from '../middlewares/verifyRole'

const router = express.Router();

router.get('/all', postController.getPosts);
router.get('/limit', postController.getPostsLimit);
router.get('/new-post', postController.getNewPosts);
router.get('/detail', postController.getOnePost);
router.get('/admin-all', verifyToken, isAdmin, postController.getPostsAdmin)
router.delete('/admin-delete/:postId', verifyToken, isAdmin, postController.deletePost)
router.post('/create-new', verifyToken, postController.createNewPost)

export default router;