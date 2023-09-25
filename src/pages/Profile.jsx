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
  const [{ apiData, isLoading, serverError }] = useFetch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      mobile: apiData?.mobile || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      const updatePromiss = updateUser(values);

      toast.promise(updatePromiss, {
        loading: "Updating...",
        success: <b>Update Successfully!</b>,
        error: <b>Could Not Update!</b>,
      });

      updatePromiss
        .then(() => {
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    },
  });

  const onUpload = async (e) => {
    if (isSubmitting) return;
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  // if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto ">
      <Toaster reverseOrder={false} position="top-center"></Toaster>

      <div className="flex items-center justify-center h-screen">
        <div className={`${style.glass}`} style={{ width: "45%" }}>
          <div className="flex flex-col title items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="p-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile justify-center flex py-4">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  alt="profile"
                  className={`${
                    !isSubmitting
                      ? style.profile_img
                      : style.profile_img_disabled
                  } ${extend.profile_img}`}
                  disabled={isSubmitting}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  className={`${
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  } ${extend.textbox}`}
                  type="text"
                  placeholder="FirstName"
                  disabled={isSubmitting}
                ></input>
                <input
                  {...formik.getFieldProps("lastName")}
                  className={`${
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  } ${extend.textbox}`}
                  type="text"
                  placeholder="LastName"
                  disabled={isSubmitting}
                ></input>
              </div>

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={`${
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  } ${extend.textbox}`}
                  type="text"
                  placeholder="Mobile No."
                  disabled={isSubmitting}
                ></input>
                <input
                  {...formik.getFieldProps("email")}
                  className={`${
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  } ${extend.textbox}`}
                  type="text"
                  placeholder="Email*"
                  disabled={isSubmitting}
                ></input>
              </div>

              <input
                {...formik.getFieldProps("address")}
                className={`${
                  !isSubmitting ? style.textbox : style.textbox_disabled
                } ${extend.textbox}`}
                type="text"
                placeholder="Address"
                disabled={isSubmitting}
              ></input>
              <button
                className={!isSubmitting ? style.btn : style.btn_disabled}
                disabled={isSubmitting}
                type="submit"
              >
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                come back later?{" "}
                <button
                  onClick={userLogout}
                  className={`${
                    !isSubmitting ? style.link : style.link_disabled
                  }`}
                  to="/"
                >
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
