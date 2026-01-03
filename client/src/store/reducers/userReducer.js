const initState = { userData: {} }

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GET_CURRENT':
            return { ...state, userData: action.data || {} }
        case 'LOGOUT':
            return { ...state, userData: {} }
        default:
            return state
    }
}
export default userReducer