import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLoginUserMutation } from "../../../state/user/api";
import emailImg from "../../resources/imgs/mail.png";
import passwordImg from "../../resources/imgs/padlock.png";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import reusable from "./../../resources/css/reusable.module.scss";
import classes from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import { useDispatch } from "react-redux";
import { addUser } from "../../../state/user/user";

const Login = () => {
  const [appError, setAppError] = useState();
  const schema = yup.object().shape({
    Email: yup.string().email().required(),
    Password: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginUser, { data: result, isSuccess, isLoading, isError, error }] =
    useLoginUserMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitForm = (data) => {
    const payload = {
      email: data.Email,
      password: data.Password,
    };
    loginUser(payload);
  };
  useEffect(() => {
    if (isLoading) {
      setAppError("");
    }
    if (isError) {
      return setAppError(error.data.message);
    }
    if (isSuccess) {
      dispatch(addUser(result.data.user));
      sessionStorage.setItem("token", result.data.token);
      return navigate("/");
    }
  }, [isError, isSuccess]);

  const _register = () => {
    return navigate("/register");
  };

  return (
    <div className={reusable.main_container}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="img" />
      </div>
      <div className={reusable.center_panel}>
        <div className={reusable.panelContent}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className={reusable.form_div}>
              <div className={reusable.form_img_container}>
                <img alt="user" src={emailImg} width="20px" />
              </div>
              <input
                name="Email"
                placeholder="Email"
                {...register("Email")}
                autoFocus={true}
              />
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
            {appError && (
              <p className={reusable.form_response_error}>{appError}</p>
            )}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={reusable.form_btn_container}>
                <button>Login</button>
              </div>
            )}
          </form>
          <div className={reusable.form_anno}>
            <p>Don't have an account?</p>
            <p onClick={_register}>
              <strong>Register now!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
