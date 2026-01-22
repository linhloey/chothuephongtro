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
router.get('/user-all', verifyToken, postController.getPostsUser)
router.delete('/delete-post', verifyToken, postController.deletePost)
router.post('/create-new', verifyToken, postController.createNewPost)
router.post('/save-post', verifyToken, postController.savePost);
router.get('/get-saved-posts', verifyToken, postController.getSavedPosts);
router.put('/update', verifyToken, postController.updatePost)

export default router;