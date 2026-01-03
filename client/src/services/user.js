import axiosConfig from '../axiosConfig'

export const apiGetCurrent = (token) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/user/get-current',
            headers: token ? { authorization: `Bearer ${token}` } : {}
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiUpdateUser = (payload) => axiosConfig({
    method: 'put',
    url: '/api/v1/user/update-user',
    data: payload
})