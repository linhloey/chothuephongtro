import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // gan token vao header
    const localStorageData = window.localStorage.getItem('persist:auth');
    if (localStorageData) {
        const authData = JSON.parse(localStorageData);
        const token = authData?.token?.replace(/^"|"$/g, ''); 
        
        if (token && token !== 'null' && token.length > 10) {
            config.headers.authorization = `Bearer ${token}`;
        } else {
            delete config.headers.authorization;
        }
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // refresh token
    return response;
  }, function (error) {
    return Promise.reject(error);
  });


export default instance