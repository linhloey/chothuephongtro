import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(' ')[1]
    console.log('--- Check Token ---')
    console.log('Token nhận được:', token)
    console.log('Secret Key dùng để giải mã:', process.env.SECRET_KEY)
    
    if (!token) return res.status(401).json({
        err: 1,
        msg: 'Missing token'
    })

    // Dùng SECRET_KEY từ file .env
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({
            err: 2,
            msg: 'Token expired or invalid' 
        })
        req.user = user
        next()
    })
}
export default verifyToken