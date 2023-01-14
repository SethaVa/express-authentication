import axios from "axios"

export async function authenticate(username){
    try {
        return await axios.post("/api/authenticate", {username});
    } catch (error) {
        return {error: "Username doesn't exist...!"}
    }
export async function resetPassword({username, password}){
    try {
        const {data, status} = await axios.get("/api/resetPassword", {username, password});
        return Promise.resolve({data, status})
    } catch (error) {
        return Promise.reject({error})
    }

}

export async function verifyPassword({username, password}){
    try {
        const {data} = await axios.get(`/api/login`, {username, password});
        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({error: "Password doesn't match...!"});
    }
}