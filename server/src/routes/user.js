import express from 'express'
import verifyToken from '../middlewares/verifyToken'
import { isAdmin } from '../middlewares/verifyRole'
import * as userController from '../controllers/user'

const router = express.Router()
router.get('/get-current', verifyToken, userController.getCurrent)
router.put('/update-user', verifyToken, userController.updateUser)
router.get('/get-all-users', verifyToken, isAdmin, userController.getAllUsers)
router.put('/change-password',verifyToken, userController.changePassword)

export default router