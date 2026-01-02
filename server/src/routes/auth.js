import express from 'express'
import * as authController from '../controllers/auth.js'


const router = express.Router()

router.post('/register', authController.register)       //Khi goi API co link /register --> ham register cua authController
router.post('/login', authController.login)

export default router