import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import LeftPanel from '../Home/LeftPanel/LeftPanel';
import classes from "./CreateBoards.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png"
import reusable from "../../resources/css/reusable.module.scss";
import { useSelector } from 'react-redux';
import smartPhone from "../../resources/imgs/smartphone.png"
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import { useCreateBoardMutation } from '../../../state/boards/api';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';

const CreateBoards = () => {

  const {user} = useSelector((state) => state.user);

  const schema = yup.object().shape({
    boardName: yup.string().min(3).required(),
  })
  const {register, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(schema)
 });
 const [appError, setAppError] = useState();
 const [isUserAuth, setIsUserAuth] = useState();

 const [createBoard, {isLoading, isSuccess, isError, error}] = useCreateBoardMutation();

 const navigate = useNavigate();

 const submitForm = (data) => {
   const payload = {
        name: data.boardName
    }
    createBoard(payload);
  }

  useEffect(() => {
        if(Object.keys(user).length === 0) return navigate("/");
        setIsUserAuth(true);
  }, []);

  useEffect(() => {

    if(isError){
       return setAppError(error.data.message);
    }
    if(isSuccess){
        return navigate("/");
    }
  }, [isSuccess, isError]);

  return (
    <div className={classes.mainContainer}>
        <div className={reusable.main_container_shape}>
            <img src={mainPageShape}/>
        </div>
        {isUserAuth && 
        <>
         <LeftPanel user={user}/>
        <div className={classes.container}>
                <div className={classes.joinBordContainer}>
                    <h2>Create board</h2>
                    <form onSubmit={handleSubmit(submitForm)} className={classes.createBoardForm}>
                        <div className={classes.inputContainer}>
                            <div className={reusable.form_img_container}>
                                <img alt='user' src={smartPhone} width="20px"/>
                            </div>
                        <input name='boardName' placeholder='Name your board' autoFocus={true} {...(register('boardName'))}/>
                        </div>
                        {errors.boardName && <p className={classes.appError}>{errors.boardName.message}</p>}
                        {appError && <p className={classes.appError}>{appError}</p>}
                        <div className={classes.btnContainer}>
                            {isLoading ? <LoadingSpinner/> : <button>Create board</button>}
                        </div>
                    </form>
                </div>
        </div>
        </>}
    </div>
  )
}

export default CreateBoards