import React from "react";
import FakeLeftPanel from "../LeftPanelFaker/FakeLeftPanel";
import classes from "./ProfilePageLoading.module.scss";

const ProfilePageLoading = () => {
  return (
    <div className={classes.panel}>
      <FakeLeftPanel />
      <div className={classes.container}>
        <div className={classes.panelContent}>
          <div className={classes.panelHeader}>
            <div className={classes.uploadDialog}>
              <span></span>
            </div>
            <h2>Profile page</h2>
          </div>
          <div className={classes.userContainer}>
            <div className={classes.userName}>
              <span></span>
            </div>
            <div className={classes.userImage}>
              <span></span>
            </div>
            <div className={classes.info}>
              <div className={classes.userInfo}>
                <span></span>
              </div>
              <div className={classes.userInfo}>
                <span></span>
              </div>
              <div className={classes.userInfo}>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLoading;
