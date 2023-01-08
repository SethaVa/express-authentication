import axios from "axios"

export async function authenticate(username){
    try {
        return await axios.post("/api/authenticate", {username});
    } catch (error) {
        return {error: "Username doesn't exist...!"}
    }
}