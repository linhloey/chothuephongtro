export const isAdmin = (req, res, next) => {
    const { roleCode } = req.user // Thông tin lấy từ verifyToken trước đó
    if (roleCode !== 'R1') {
        return res.status(401).json({
            err: 1,
            msg: 'Bạn không có quyền truy cập (Yêu cầu quyền Admin)'
        })
    }
    next()
}