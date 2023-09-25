import { useFormik } from "formik";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import style from "../styles/Username.module.css";
import avatar from "../assets/profile.png";
import convertToBase64 from "../helper/convert";
import { registerValidation } from "../helper/validate";
import { registerUser } from "../helper/helper";

const RegisterPage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    enableReinitialize: true,
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values = await Object.assign(values, { profile: file || "" });
      const registerPromiss = registerUser(values);

      toast.promise(registerPromiss, {
        loading: "Creating...",
        success: <b>Register Successfully!</b>,
        error: <b>Could Not Register!</b>,
      });

      registerPromiss
        .then(() => {
          setIsSubmitting(false);
          navigate("/");
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster reverseOrder={false} position="top-center"></Toaster>

      <div className="flex items-center justify-center h-screen">
        <div className={style.glass} style={{ width: "45%" }}>
          <div className="flex flex-col title items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="p-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join with you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile justify-center flex py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt="profile"
                  className={
                    !isSubmitting
                      ? style.profile_img
                      : style.profile_img_disabled
                  }
                />
              </label>

              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={
                  !isSubmitting ? style.textbox : style.textbox_disabled
                }
                type="text"
                placeholder="Email*"
                disabled={isSubmitting}
              ></input>
              <input
                {...formik.getFieldProps("username")}
                className={
                  !isSubmitting ? style.textbox : style.textbox_disabled
                }
                type="text"
                placeholder="Username*"
                disabled={isSubmitting}
              ></input>
              <input
                {...formik.getFieldProps("password")}
                className={
                  !isSubmitting ? style.textbox : style.textbox_disabled
                }
                type="text"
                placeholder="Password*"
                disabled={isSubmitting}
              ></input>
              <button
                className={!isSubmitting ? style.btn : style.btn_disabled}
                disabled={isSubmitting}
                type="submit"
              >
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Register?{" "}
                <Link
                  className={!isSubmitting ? style.link : style.link_disabled}
                  to="/"
                >
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
