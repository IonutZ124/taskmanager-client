import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import reusable from "./../../resources/css/reusable.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import mailImg from "../../resources/imgs/mail.png";
import { useForgotPasswordMutation } from "./../../../state/user/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
  const [appError, setAppError] = useState();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    Email: yup.string().email().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [forgotPassword, { isSuccess, isLoading, isError, error }] =
    useForgotPasswordMutation();
  const submitForm = (data) => {
    const payload = {
      email: data.Email,
    };
    forgotPassword(payload);
  };
  useEffect(() => {
    if (isLoading) {
      setAppError("");
    }
    if (isError) {
      setAppError(error.data.message);
    }
    if (isSuccess) {
      return navigate("/change-password");
    }
  }, [isError, isSuccess]);

  return (
    <div className={reusable.main_container}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shapes" />
      </div>
      <div className={reusable.center_panel}>
        <div className={reusable.panelContent}>
          <h1>Forgot Password</h1>
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
            {appError && (
              <p className={reusable.form_response_error}>{appError}</p>
            )}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={reusable.form_btn_container}>
                <button>Send code</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
