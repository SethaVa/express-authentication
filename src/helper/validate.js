import { toast } from "react-hot-toast"
import { authenticate } from "./helper";

// Validate login screen
export async function usernameValidate(values){
    const error = usernameValidate({}, values);

    if(values.username){
        // check user exist or not
        const status = await authenticate(values.username);

        if(status !== 200){
            error.exist = toast.error("User doesn't exist...!")
        }
    }

    return error;
}

function usernameVerify(error = {}, values){
    const {username} = values
    if(username){
        error.username = toast.error("Username required...!");
    }else if(username.includes(" ")){
        error.username = toast.error("Invalid username...!")
    }

    return error;
}