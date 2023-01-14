import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch";
import style from "../styles/Username.module.css";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { passwordValidate, verifyPassword } from "../helper/validate";
import { toast, Toaster } from "react-hot-toast";

const PasswordPage = () => {
    const navigate = useNavigate();
    const username = useSelector(state => state.username);
    const [{apiData, isLoading, serverError}] = useFetch(`/user/${username}`)

    const formik = useFormik({
        initialValues: {
            password: ""
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let loginPromiss = verifyPassword({username, password: values.password});

            toast.promise(loginPromiss, {
                loading: 'Checking...',
                success: <b>Login Successfully!</b>,
                error: <b>Password not match!</b>,
            })

            loginPromiss.then((res) => {
                const token = res.data;
                localStorage.setItem('token', token);
                navigate("/profile");
            });
       }
    });

    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
        <div className="container mx-auto">

            <Toaster reverseOrder={false} position="top-center"></Toaster>

            <div className="flex items-center justify-center h-screen">
                <div className={style.glass}>
                    <div className="flex flex-col title items-center">
                        <h4 className="text-5xl font-bold">Hello {apiData?.firstName || apiData?.username}</h4>
                        <span className="p-4 text-xl w-2/3 text-center text-gray-500">Explore More by connecting with us.</span>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="profile justify-center flex py-4">
                            <img src={apiData?.profile || avatar} alt="avatar" className={style.profile_img}/>
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <input {...formik.getFieldProps("password")} className={style.textbox} type="text" placeholder="Password"></input>
                            <button className={style.btn} type="submit">Sign IN</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500">Forget Password? <Link to="/recovery" className="text-red-500">Recovery Now</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PasswordPage;