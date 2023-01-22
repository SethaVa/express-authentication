import style from "../styles/Username.module.css";
import { useFormik } from 'formik';
import avatar from "../assets/profile.png"
import { usernameValidate } from "../helper/validate";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsername } from "../store";

const UsernamePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues : {
          username : 'example123'
        },
        validate : usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
          dispatch(setUsername({username: values.username}));
          navigate('/password')
        }
      })
    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-center h-screen">
                <div className={style.glass}>
                    <div className="flex flex-col title items-center">
                        <h4 className="text-5xl font-bold">Hello Again!</h4>
                        <span className="p-4 text-xl w-2/3 text-center text-gray-500">Explore more by connecting with us</span>
                    </div>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className="profile justify-center flex py-4">
                            <img src={avatar} alt="profile" className={style.profile_img}/>
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <input {...formik.getFieldProps("username")} className={style.textbox} type="text" placeholder="Username"></input>
                            <button className={style.btn} type='submit'>Let's Go</button>
                        </div>

                        <div className="text-center py-4">
                            <span className="text-gray-500">Not a Member <Link className="text-red-500" to="/register">Register Now</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UsernamePage;