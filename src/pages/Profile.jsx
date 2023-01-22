import { toast, Toaster } from "react-hot-toast";
import style from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch";
import { useState } from "react";
import { updateUser } from "../helper/helper";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";

const ProfilePage = () => {
    const [file, setFile] = useState();
    const navigate = useNavigate();
    const [{apiData, isLoading, serverError}] = useFetch()

    const formik = useFormik({
        initialValues: {
            firstName: apiData?.firstName || "",
            lastName: apiData?.lastName || "",
            mobile: apiData?.mobile || "",
            email: apiData?.email || "",
            address: apiData?.address || ""
        },
        enableReinitialize: true,
        validate: profileValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, {profile: file || apiData?.profile || ""});
            const updatePromiss = updateUser(values); 

            toast.promise(updatePromiss, {
                loading: 'Updating...',
                success: <b>Update Successfully!</b>,
                error: <b>Could Not Update!</b>,
            })
       }
    });

    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    const userLogout = () => {
        localStorage.removeItem("token");
        navigate("/")
    }

    // if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    // if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
        <div className="container mx-auto">

            <Toaster reverseOrder={false} position="top-center"></Toaster>

            <div className="flex items-center justify-center my-10">
                <div className={`${style.glass}`} style={{width: "45%"}}>
                    <div className="flex flex-col title items-center">
                        <h4 className="text-5xl font-bold">Profile</h4>
                        <span className="p-4 text-xl w-2/3 text-center text-gray-500">You can update the details.</span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile justify-center flex py-4">
                            <label htmlFor="profile">
                                <img src={apiData?.profile || file || avatar} alt="profile" className={`${style.profile_img} ${extend.profile_img}`}/>
                            </label>

                            <input onChange={onUpload} type="file" id='profile' name='profile' />
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="name flex w-3/4 gap-10">
                                <input {...formik.getFieldProps("firstName")} className={`${style.textbox} ${extend.textbox}`} type="text" placeholder="FirstName"></input>
                                <input {...formik.getFieldProps("lastName")} className={`${style.textbox} ${extend.textbox}`} type="text" placeholder="LastName"></input>    
                            </div>

                            <div className="name flex w-3/4 gap-10">
                                <input {...formik.getFieldProps("mobile")} className={`${style.textbox} ${extend.textbox}`} type="text" placeholder="Mobile No."></input>
                                <input {...formik.getFieldProps("email")} className={`${style.textbox} ${extend.textbox}`} type="text" placeholder="Email*"></input>    
                            </div>

                            <input {...formik.getFieldProps("address")} className={`${style.textbox} ${extend.textbox}`} type="text" placeholder="Address"></input>
                            <button className={style.btn} type="submit">Update</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500">come back later? <button onClick={userLogout} className="text-red-500" to="/">Logout</button></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;