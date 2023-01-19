import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import userImg from "../../resources/imgs/user.png";
import emailImg from "../../resources/imgs/mail.png";
import passwordImg from "../../resources/imgs/padlock.png";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import classes from "./Register.module.scss";
import reusable from "./../../resources/css/reusable.module.scss";
import { useRegisterUserMutation } from "../../../state/user/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";

const Register = () => {
  const [appError, setAppError] = useState();
  const schema = yup.object().shape({
    Name: yup.string().required(),
    Email: yup.string().email().required(),
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
  const [registerUser, { isSuccess, isLoading, isError, error }] =
    useRegisterUserMutation();

  const navigate = useNavigate();

  const submitForm = (data) => {
    const payload = {
      name: data.Name,
      email: data.Email,
      password: data.Password,
      password_confirmation: data.ConfirmPassword,
    };
    registerUser(payload);
  };
  useEffect(() => {
    if (isLoading) {
      setAppError("");
    }
    if (isError) {
      if (typeof error.data.message == "string") {
        return setAppError(error.data.message);
      } else {
        return setAppError(Object.values(error.data.errors)[0][0]);
      }
    }
    if (isSuccess) {
      return navigate("/verify-email");
    }
  }, [isError, isSuccess]);

  const _login = () => {
    return navigate("/login");
  };

  return (
    <div className={reusable.main_container}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shape" />
      </div>
      <div className={reusable.center_panel}>
        <div className={reusable.panelContent}>
          <h1>Register</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="user" src={userImg} width="20px" />
              </div>
              <input
                name="Name"
                placeholder="Name"
                {...register("Name")}
                autoFocus={true}
              />
            </div>
            {errors.Name && (
              <p className={classes.val_error}>{errors.Name.message}</p>
            )}
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
                <button>Register</button>
              </div>
            )}
          </form>
          <div className={reusable.form_anno}>
            <p>Already have an account?</p>
            <p onClick={_login}>
              <strong>Log in now!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
