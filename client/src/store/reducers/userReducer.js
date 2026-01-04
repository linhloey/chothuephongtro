const initState = { 
    userData: {},
    users: [] 
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GET_CURRENT':
            return { ...state, userData: action.data || {} }
        case 'GET_ALL_USERS':
            return { ...state, users: action.users || [] }
        case 'LOGOUT':
            return { ...state, userData: {} }
        default:
            return state
    }
}
export default userReducer