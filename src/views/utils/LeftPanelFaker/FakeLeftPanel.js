import React from "react";
import classes from "./FakeLeftPanel.module.scss";

const FakeLeftPanel = () => {
  return (
    <div className={classes.mainPanel}>
      <div className={classes.userSection}>
        <div className={classes.Usershape}>
          <span></span>
        </div>
        <div className={classes.dialogHeader}>
          <span></span>
        </div>
      </div>
      <div className={classes.navSection}>
        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>
        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>
        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>

        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>

        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>

        <div className={classes.navListContainer}>
          <div className={classes.shape}>
            <span></span>
          </div>
          <div className={classes.dialog}>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeLeftPanel;
