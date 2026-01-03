// src/middlewares/verifyToken.js
import jwt from 'jsonwebtoken'

// src/middlewares/verifyToken.js
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    // Nếu FE gửi lên chữ "null" thì chặn luôn ở đây
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ err: 1, msg: 'Missing token' })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ err: 2, msg: 'Token expired' })
        req.user = user
        next()
    })
}

export default verifyToken