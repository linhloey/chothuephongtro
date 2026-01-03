import * as apis from '../../services'

export const getCurrentUser = (persistToken) => async (dispatch) => {
    try {
        const response = await apis.apiGetCurrent(persistToken)
        console.log('Check response API:', response)
        if (response?.data.err === 0) {
            dispatch({
                type: 'GET_CURRENT',
                data: response.data.response
            })
        } else {
            dispatch({ type: 'GET_CURRENT', data: null })
        }
    } catch (error) {
        dispatch({ type: 'GET_CURRENT', data: null })
        console.log('Lỗi action getCurrentUser:', error)
    }
}

export const updateUser = (payload) => async (dispatch) => {
    try {
        const response = await apis.apiUpdateUser(payload) 
        if (response?.data.err === 0) {
            dispatch(getCurrentUser())
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}