import * as userService from '../services/user'

export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user // id này lấy từ token sau khi qua middleware verifyToken
        const response = await userService.getOne(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at user controller: ' + error
        })
    }
}