import axios from "axios";
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

export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.newPassword !== values.confirmPWD){
        errors.exist = toast.error("Password not match...1")
    }

    return errors;
}

export async function registerValidation(values){
    const errors = usernameVerify({}, values);
    passwordVerify({}, values);
    emailVerify({}, values);

    return errors;
}

export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors;
}

export async function profileValidation(values){
    const errors = emailVerify({}, values);

    return errors;
}

function passwordVerify(errors = {}, values){
    const specialChar = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    }else if(values.password === " "){
        errors.password = toast.error("Wrong password...!")
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long")
    }else if(specialChar.test(values.password)){
        errors.password = toast.error("Password must have special character")
    }

    return errors;
}

function usernameVerify(error = {}, values){
    const {username} = values
    if(!username){
        error.username = toast.error("Username required...!");
    }else if(username.includes(" ")){
        error.username = toast.error("Invalid username...!")
    }

    return error;
}

/** validate email */
function emailVerify(error ={}, values){
    if(!values.email){
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}