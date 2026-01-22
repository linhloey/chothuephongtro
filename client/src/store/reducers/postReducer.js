import actionTypes from "../actions/actionTypes";
const initState = {
  posts: [],
  msg: '',
  count: 0,
  newPosts: [],
  savedIds: [],
  savedPosts: [],
};

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_POSTS_LIMIT:
        case actionTypes.GET_POSTS:
            return {
                ...state,
                posts: action.posts || [],
                msg: action.msg || '',
                count: action.count || 0
            };     
        case actionTypes.GET_NEW_POSTS:
            return {
                ...state,
                msg: action.msg || '',
                newPosts: action.newPosts || []
            };   
        case 'GET_SAVED_POSTS':
            return {
                ...state,
                savedPosts: action.posts || [], 
                savedIds: action.posts?.map(item => String(item.postId)) || [],
                msg: action.msg || ''
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                savedIds: [] 
            };
        default:
            return state;
    }
}

export default postReducer;