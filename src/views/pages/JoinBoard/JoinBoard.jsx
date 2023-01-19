import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useJoinBoardMutation } from "../../../state/boards/api";
import passImg from "../../resources/imgs/padlock.png";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import reusable from "./../../resources/css/reusable.module.scss";
import classes from "./JoinBoard.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import { useSelector } from "react-redux";
import LeftPanel from "../Home/LeftPanel/LeftPanel";

const JoinBoard = () => {
  const { user } = useSelector((state) => state.user);
  const [appError, setAppError] = useState();
  const [isUserAuth, setIsUserAuth] = useState();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    Code: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [joinBoard, { isSuccess, isLoading, isError, error }] =
    useJoinBoardMutation();
  const submitForm = (data) => {
    const payload = {
      code: data.Code,
    };
    joinBoard(payload);
  };
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      setIsUserAuth(true);
    } else {
      return navigate("/");
    }
  }, []);
  useEffect(() => {
    if (isLoading) {
      setAppError("");
    }
    if (isError) {
      setAppError(error.data.message);
    }
    if (isSuccess) {
      return navigate("/");
    }
  }, [isError, isSuccess]);

  return (
    <div className={classes.mainContainer}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shape" />
      </div>
      {isUserAuth && (
        <>
          <LeftPanel user={user} />
          <div className={classes.container}>
            <div className={classes.panelContent}>
              <h1>Join board</h1>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className={reusable.form_div}>
                  <div className={reusable.form_img_container}>
                    <img alt="codeImg" src={passImg} width="20px" />
                  </div>
                  <input
                    autoFocus={true}
                    name="Code"
                    placeholder="Code received"
                    {...register("Code")}
                  />
                </div>
                {errors.Code && (
                  <p className={classes.valError}>{errors.Code.message}</p>
                )}
                {appError && (
                  <p className={reusable.form_response_error}>{appError}</p>
                )}
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className={classes.submitBtn}>
                    <button>Join board</button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JoinBoard;
