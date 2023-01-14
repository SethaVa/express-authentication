import axios from "axios"

export async function authenticate(username){
    try {
        return await axios.post("/api/authenticate", {username});
    } catch (error) {
        return {error: "Username doesn't exist...!"}
    }
/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}


export async function generateOTP(username){
    try {
        const {data: {code}, status} = await axios.get("/api/generateOTP", {params: username});

        // send mail with OTP
        if(status === 201){
            const {data: {email}} = await getUser({username});
            const text = `Your Password Recovery OTP is ${code}. Verify and recovery your password.`;
            await axios.get("/api/registerMail", {username, userEmail: email, text, subject: "Password Recovery OTP"})
        }

        return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function verityOTP({username, code}){
    try {
        const {data, status} = await axios.get("/api/verifyOTP", {params: {username, code}});
        return {data, status};
    } catch (error) {
        return Promise.reject(error)
    }
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