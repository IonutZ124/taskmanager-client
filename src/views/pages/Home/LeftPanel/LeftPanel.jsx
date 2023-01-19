import React, { useState, useEffect } from "react";
import classes from "./LeftPanel.module.scss";
import { useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { setHasUserNewNotifications } from "../../../../state/Reducers/userNotifications/hasUserNotifications";
import { useCheckUserNotificationsQuery } from "../../../../state/notifications/api";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { useDispatch, useSelector } from "react-redux";

const LeftPanel = ({ user }) => {
  const navigate = useNavigate();
  const { data: hasUserNotifications } = useCheckUserNotificationsQuery();
  const dispatch = useDispatch();
  const { userNotifications } = useSelector((state) => state.userNotifications);

  const logOut = () => {
    sessionStorage.removeItem("token");
    return window.location.replace("/login");
  };

  function _handleBellClick() {
    return navigate("/user-notifications");
  }
  useEffect(() => {
    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: process.env.REACT_APP_WEBSOCKETS_KEY,
      wsHost: process.env.REACT_APP_WEBSOCKETS_SERVER,
      wsPort: 6001,
      forceTLS: false,
      disableStatus: true,
      enabledTransports: ["ws", "wss"],
    });
  }, []);
  if (window?.Echo) {
    window.Echo.channel(`user.${user.id}`).listen("SendEventToClient", (e) => {
      if (e.action === "notification") {
        if (!userNotifications.value) {
          dispatch(setHasUserNewNotifications({ value: true }));
        }
      }
    });
  }
  useEffect(() => {
    if (hasUserNotifications) {
      dispatch(
        setHasUserNewNotifications({
          value: hasUserNotifications.data.data,
        })
      );
    }
  }, [hasUserNotifications]);
  return (
    <div className={classes.mainPanel}>
      <div
        className={classes.notificationBellContainer}
        onClick={_handleBellClick}
      >
        <div className={classes.notify}>
          {userNotifications && userNotifications.value && (
            <>
              <span className={classes.bellNotification} />
            </>
          )}
          <BiBell />
        </div>
      </div>
      <div className={classes.userSection}>
        <div className={classes.Usershape}>
          <p>{user.name[0].toUpperCase()}</p>
        </div>
        <div>
          <p>{user.name}</p>
        </div>
      </div>
      <div className={classes.navSection}>
        <div className={classes.navListContainer} onClick={() => navigate("/")}>
          <div className={classes.shape} />
          <div>
            <p>Home</p>
          </div>
        </div>
        <div
          className={classes.navListContainer}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <div className={classes.shape} />
          <div>
            <p>Profile</p>
          </div>
        </div>
        <div
          className={classes.navListContainer}
          onClick={() => navigate("/create-board")}
        >
          <div className={classes.shape} />
          <div>
            <p>Create Board</p>
          </div>
        </div>

        <div
          className={classes.navListContainer}
          onClick={() => navigate("/join-board")}
        >
          <div className={classes.shape} />
          <div>
            <p>Join board</p>
          </div>
        </div>

        <div
          className={classes.navListContainer}
          onClick={() => navigate("/archive")}
        >
          <div className={classes.shape} />
          <div>
            <p>Archive</p>
          </div>
        </div>

        <div className={classes.navListContainer} onClick={logOut}>
          <div className={classes.shape} />
          <div>
            <p>Log out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
