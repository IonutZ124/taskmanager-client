import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import emailImg from "../../resources/imgs/mail.png";
import codeImg from "../../resources/imgs/smartphone.png";
import passwordImg from "../../resources/imgs/padlock.png";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import classes from "./ChangePassword.module.scss";
import reusable from "./../../resources/css/reusable.module.scss";
import { useChangePasswordMutation } from "../../../state/user/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";

const ChangePassword = () => {
  const [appError, setAppError] = useState();
  const schema = yup.object().shape({
    Email: yup.string().email().required(),
    Token: yup.string().required(),
    Password: yup.string().required(),
    ConfirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("Password")]),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [changePassword, { isSuccess, isLoading, isError, error }] =
    useChangePasswordMutation();

  const navigate = useNavigate();

  const submitForm = (data) => {
    const payload = {
      email: data.Email,
      token: data.Token,
      password: data.Password,
      password_confirmation: data.ConfirmPassword,
    };
    changePassword(payload);
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

  return (
    <div className={reusable.main_container}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shape" />
      </div>
      <div className={reusable.center_panel}>
        <div className={reusable.panelContent}>
          <h1>Change Password</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="user" src={emailImg} width="20px" />
              </div>
              <input name="Email" placeholder="Email" {...register("Email")} />
            </div>
            {errors.Email && (
              <p className={classes.val_error}>{errors.Email.message}</p>
            )}
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="mailImg" src={codeImg} width="20px" />
              </div>
              <input name="Token" placeholder="Code" {...register("Token")} />
            </div>
            {errors.Code && (
              <p className={classes.val_error}>{errors.Code.message}</p>
            )}
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="user" src={passwordImg} width="20px" />
              </div>
              <input
                type="password"
                name="Password"
                placeholder="Password"
                {...register("Password")}
              />
            </div>
            {errors.Password && (
              <p className={classes.val_error}>{errors.Password.message}</p>
            )}
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="user" src={passwordImg} width="20px" />
              </div>
              <input
                type="password"
                name="ConfirmPassword"
                placeholder="Password confirmation"
                {...register("ConfirmPassword")}
              />
            </div>
            {errors.ConfirmPassword && (
              <p className={classes.val_error}>Passwords must match</p>
            )}
            {appError && (
              <p className={reusable.form_response_error}>{appError}</p>
            )}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={reusable.form_btn_container}>
                <button>Change</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
