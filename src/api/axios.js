import axios from "axios";

const API = axios.create({
    baseURL: "https://nishananazar.pythonanywhere.com"
})

// token attach
API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("access")

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})

// refresh token
API.interceptors.response.use(
    (response)=>response,
    async (error) => {
        const orginalRequest = error.config

        if (error.response?.status == 401){
            const refresh = localStorage.getItem("refresh");
            const res = await axios.post(
                "https://nishananazar.pythonanywhere.com/api/token/refresh/", {refresh:refresh}
            )
            const newToken = res.data.access;
            localStorage.setItem("access", newToken)
            API.defaults.headers.Authorization = `Bearer ${newToken}`
            orginalRequest.headers.Authorization = `Bearer ${newToken}`
            return API(orginalRequest)
        }

        return Promise.reject(error)
    }
)


export default API;