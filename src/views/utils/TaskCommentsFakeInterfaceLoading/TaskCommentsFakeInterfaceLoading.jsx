import React from "react";
import classes from "./TaskCommentsFakeInterface.module.scss";

const TaskCommentsFakeInterfaceLoading = () => {
  return (
    <div className={classes.container}>
      <div className={classes.fakeComment}>
        <span></span>
      </div>
      <div className={classes.fakeComment}>
        <span></span>
      </div>
      <div className={classes.fakeComment}>
        <span></span>
      </div>
    </div>
  );
};

export default TaskCommentsFakeInterfaceLoading;
