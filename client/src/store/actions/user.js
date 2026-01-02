import actionTypes from './actionTypes'
import { apiGetCurrent } from '../../services/user' // Đảm bảo import đúng hàm này

export const getCurrentUser = () => async (dispatch) => {
    try {
        const response = await apiGetCurrent()
        if (response?.data.err === 0) {
            dispatch({
                type: actionTypes.GET_CURRENT,
                data: response.data.response
            })
        } else {
            // Nếu token hết hạn (Server trả về err != 0)
            dispatch({
                type: actionTypes.GET_CURRENT,
                data: null
            })
            // Tự động logout nếu không lấy được user (do token hỏng/hết hạn)
            dispatch({ type: actionTypes.LOGOUT })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.GET_CURRENT,
            data: null
        })
        dispatch({ type: actionTypes.LOGOUT })
    }
}