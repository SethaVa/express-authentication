import { useFormik } from "formik";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { generateOTP, verityOTP } from "../helper/helper";
import { usernameValidate } from "../helper/validate";
import style from "../styles/Username.module.css";

const RecoveryPage = () => {
  const username = useSelector((state) => state.username);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { status } = await verityOTP({ username, code: otp });

      if (status === 201) {
        toast.success("Verify Successfully!");
        navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP! check mail again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const sentPromise = generateOTP(username);

    toast.promise(sentPromise, {
      loading: "Sending...",
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    });

    sentPromise
      .then((OTP) => {
        setIsSubmitting(false);
        console.log(OTP);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };
  return (
    <div className="container mx-auto">
      <Toaster reverseOrder={false} position="top-center"></Toaster>

      <div className="flex items-center justify-center h-screen">
        <div className={style.glass}>
          <div className="flex flex-col title items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="p-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>

          <form className="pt-20" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="p-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  className={
                    !isSubmitting ? style.textbox : style.textbox_disabled
                  }
                  type="text"
                  placeholder="OTP"
                  disabled={isSubmitting}
                ></input>
              </div>

              <button
                className={!isSubmitting ? style.btn : style.btn_disabled}
                disabled={isSubmitting}
                type="submit"
              >
                Recover
              </button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button
                onClick={resendOTP}
                className={!isSubmitting ? style.link : style.link_disabled}
              >
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPage;
