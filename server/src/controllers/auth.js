import * as authService from '../services/auth.js'

export const register = async (req, res) => {
    const { name, phone, password} = req.body
    try {
        if(!name || !phone || !password) return res.status(400).json({          // Neu gui thieu thong tin thi gui res Missing inputs
            err: 1,
            msg: 'Missing inputs'
        })
        const response = await authService.registerService(req.body)            // Neu du thong tin thi goi ham registerService cua authServices va truyen vao req.body
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: '+error
        })
    }
}
export const login = async (req, res) => {
    const { phone, password} = req.body
    try {
        if(!phone || !password) return res.status(400).json({                // Neu gui thieu thong tin thi gui res Missing inputs
            err: 1,
            msg: 'Missing inputs'
        })
        const response = await authService.loginService(req.body)            // Neu du thong tin thi goi ham loginService cua authServices va truyen vao req.body
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: '+error
        })
    }
}