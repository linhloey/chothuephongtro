import axiosConfig from '../axiosConfig'

export const apiGetPosts = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/post/all',
        })
        resolve(response)
        
    } catch (error) {
        reject(error)
    }
}) 

export const apiGetPostsLimit = (query) => new Promise(async(resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/limit`,
            params: query
        })
        resolve(response)
        
    } catch (error) {
        reject(error)
    }
}) 

export const apiGetNewPosts = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/new-post`,
        })
        resolve(response)
        
    } catch (error) {
        reject(error)
    }
}) 

export const apiGetOnePost = (postId) => axiosConfig({
    method: 'get',
    url: `/api/v1/post/detail`,
    params: { postId }
})

export const apiGetPostsAdmin = () => axiosConfig({
    method: 'get',
    url: '/api/v1/post/admin-all'
})

export const apiDeletePost = (postId) => axiosConfig({
    method: 'delete',
    url: '/api/v1/post/delete-post',
    params: { postId } 
})

export const apiCreatePost = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/post/create-new',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetPostsUser = (query) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/post/user-all`, // Đảm bảo route này khớp với BE
            params: query
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});