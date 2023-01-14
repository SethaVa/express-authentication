import { useFormik } from "formik";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { generateOTP, verityOTP } from "../helper/helper";
import { usernameValidate } from "../helper/validate";
import style from "../styles/Username.module.css";

const RecoveryPage = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {status} = await verityOTP({username, code: otp});

            if(status === 201){
                toast.success("Verify Successfully!")
                navigate("/reset");
            }   
        } catch (error) {
            return toast.error("Wrong OTP! check mail again!")
        }
    }

    const resendOTP = (e) => {
        e.preventDefault();
        const sentPromise = generateOTP(username);

        toast.promise(sentPromise, {
            loading: 'Sending...',
            success: <b>OTP has been send to your email!</b>,
            error: <b>Could not Send it!</b>,
        })

        sentPromise.then((OTP) => {
            console.log(OTP);
        })
    }
    return (
        <div className="container mx-auto">

            <Toaster reverseOrder={false} position="top-center"></Toaster>

            <div className="flex items-center justify-center h-screen">
                <div className={style.glass}>
                    <div className="flex flex-col title items-center">
                        <h4 className="text-5xl font-bold">Recovery</h4>
                        <span className="p-4 text-xl w-2/3 text-center text-gray-500">Enter OTP to recover password.</span>
                    </div>

                    <form className="pt-20" onSubmit={handleSubmit}>

                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="input text-center">
                                <span className="p-4 text-sm text-left text-gray-500">Enter 6 digit OTP sent to your email address.</span>
                                <input onChange={e => setOtp(e.target.value)} className={style.textbox} type="text" placeholder="OTP"></input>
                            </div>

                            <button className={style.btn} type="submit">Recover</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500">Can not get OTP? <button onClick={resendOTP} className="text-red-500" to="/register">Resend</button></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RecoveryPage;