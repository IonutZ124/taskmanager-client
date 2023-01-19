import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import reusable from "./../../resources/css/reusable.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import mailImg from "../../resources/imgs/mail.png";
import codeImg from "../../resources/imgs/smartphone.png";
import { useVerifyEmailMutation } from "./../../../state/user/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./VerifyEmail.module.scss";

const VerifyEmail = () => {
  const [appError, setAppError] = useState();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    Email: yup.string().email().required(),
    Code: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [verifyEmail, { isSuccess, isLoading, isError, error }] =
    useVerifyEmailMutation();
  const submitForm = (data) => {
    const payload = {
      email: data.Email,
      code: data.Code,
    };
    verifyEmail(payload);
  };
  useEffect(() => {
    if (isLoading) {
      setAppError("");
    }
    if (isError) {
      setAppError(error.data.message);
    }
    if (isSuccess) {
      return navigate("/login");
    }
  }, [isError, isSuccess]);

  const _resendVerifyEmail = () => {
    return navigate("/resend-verify-email");
  };

  return (
    <div className={reusable.main_container}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shape" />
      </div>
      <div className={reusable.center_panel}>
        <div className={reusable.panelContent}>
          <h1>Verify Email</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="mailImg" src={mailImg} width="20px" />
              </div>
              <input
                name="Email"
                placeholder="Email address"
                autoFocus={true}
                {...register("Email")}
              />
            </div>
            {errors.Email && (
              <p className={classes.val_error}>{errors.Email.message}</p>
            )}
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="mailImg" src={codeImg} width="20px" />
              </div>
              <input name="Code" placeholder="Code" {...register("Code")} />
            </div>
            {errors.Code && (
              <p className={classes.val_error}>{errors.Code.message}</p>
            )}
            {appError && (
              <p className={reusable.form_response_error}>{appError}</p>
            )}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={reusable.form_btn_container}>
                <button>Verify Email</button>
              </div>
            )}
          </form>
          <div className={reusable.form_anno}>
            <p>Didn't received any code?</p>
            <p onClick={_resendVerifyEmail}>
              <strong>Resend email</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
