import React from "react";
import classes from "./BoardLoadingSkeleton.module.scss";

const BoardLoadingScreen = () => {
  return (
    <div className={classes.boardLoadingContainer}>
      <div className={classes.board}>
        <span></span>
      </div>
      <div className={classes.board}>
        <span></span>
      </div>
      <div className={classes.board}>
        <span></span>
      </div>
      <div className={classes.board}>
        <span></span>
      </div>
    </div>
  );
};

export default BoardLoadingScreen;
