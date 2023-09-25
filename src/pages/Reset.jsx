import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { resetPassword } from "../helper/helper";
import { resetPasswordValidation } from "../helper/validate";
import useFetch from "../hooks/fetch";
import style from "../styles/Username.module.css";
import { useState } from "react";

const ResetPage = () => {
  const username = useSelector((state) => state.username);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPWD: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      let resetPasswordPromise = resetPassword({
        username,
        password: values.password,
      });

      toast.promise(resetPasswordPromise, {
        loading: "Updating...",
        success: <b>Reset Successfully!</b>,
        error: <b>Could Not Reset!</b>,
      });

      resetPasswordPromise
        .then(() => {
          navigate("/password");
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>;

  return (
    <div className="container mx-auto">
      <Toaster reverseOrder={false} position="top-center"></Toaster>

      <div className="flex items-center justify-center h-screen">
        <div className={style.glass}>
          <div className="flex flex-col title items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="p-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password.
            </span>
          </div>

          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={
                  !isSubmitting ? style.textbox : style.textbox_disabled
                }
                type="text"
                placeholder="New Password"
                disabled={isSubmitting}
              ></input>
              <input
                {...formik.getFieldProps("confirmPWD")}
                className={
                  !isSubmitting ? style.textbox : style.textbox_disabled
                }
                type="text"
                placeholder="Confirm Password"
                disabled={isSubmitting}
              ></input>
              <button
                className={!isSubmitting ? style.btn : style.btn_disabled}
                disabled={isSubmitting}
                type="submit"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;
