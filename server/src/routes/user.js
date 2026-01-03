import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import * as userController from '../controllers/user'

const router = express.Router()
router.get('/get-current', verifyToken, userController.getCurrent)

export default router