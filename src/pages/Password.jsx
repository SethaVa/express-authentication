import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch";
import style from "../styles/Username.module.css";
import avatar from "../assets/profile.png";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import { toast, Toaster } from "react-hot-toast";
import { verifyPassword } from "../helper/helper";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PasswordPage = () => {
  const navigate = useNavigate();
  const username = useSelector((state) => state.username);
  const [{ apiData, isLoading, serverError }] = useFetch(`/user/${username}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      let verifyPasswordPromise = verifyPassword({
        username,
        password: values.password,
      });

      toast.promise(verifyPasswordPromise, {
        loading: "Checking...",
        success: <b>Login Successfully!</b>,
        error: <b>Password not match!</b>,
      });

      verifyPasswordPromise
        .then((res) => {
          const { token } = res.data;
          localStorage.setItem("token", token);
          navigate("/profile");
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    },
  });

  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster reverseOrder={false} position="top-center"></Toaster>

      <div className="flex items-center justify-center h-screen">
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <div className={style.glass}>
            <div className="flex flex-col title items-center">
              <h4 className="text-5xl font-bold">
                Hello {apiData?.firstName || apiData?.username}
              </h4>
              <span className="p-4 text-xl w-2/3 text-center text-gray-500">
                Explore More by connecting with us.
              </span>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="profile justify-center flex py-4">
                <img
                  src={apiData?.profile || avatar}
                  alt="avatar"
                  className={
                    !isSubmitting
                      ? style.profile_img
                      : style.profile_img_disabled
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("password")}
                  className={`${
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  }`}
                  type="text"
                  placeholder="Password"
                  disabled={isSubmitting}
                ></input>
                <button
                  className={`${
                    !isSubmitting ? style.btn : style.btn_disabled
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Forget Password?{" "}
                  <Link
                    to="/recovery"
                    className={`${
                      !isSubmitting ? style.link : style.link_disabled
                    }`}
                  >
                    Recovery Now
                  </Link>
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className={style.glass}>
      <div className="flex flex-col title items-center">
        <Skeleton duration={1} height={42} width={250} baseColor="#e2e8f0" />
        <div className="p-4 flex flex-col items-center justify-center">
          <Skeleton height={25} width={150} baseColor="#e2e8f0" />
          <Skeleton height={25} width={200} baseColor="#e2e8f0" />
        </div>
      </div>
      <div className="profile justify-center flex py-4">
        <Skeleton
          height={125}
          width={125}
          baseColor="#e2e8f0"
          containerClassName="rounded-full"
        />
      </div>
      <div className="flex flex-col items-center gap-6">
        <Skeleton height={55} width={300} baseColor="#e2e8f0" />
        <Skeleton height={55} width={300} baseColor="#e2e8f0" />
      </div>
      <div className="text-center py-4">
        <Skeleton height={30} width={300} baseColor="#e2e8f0" />
      </div>
    </div>
  );
};

export default PasswordPage;
