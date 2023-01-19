import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAuthUserQuery } from "../../../state/user/api";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../state/user/user";
import LeftPanel from "../Home/LeftPanel/LeftPanel";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./UserNotifications.module.scss";
import reusable from "../../resources/css/reusable.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import { setHasUserNewNotifications } from "../../../state/Reducers/userNotifications/hasUserNotifications";
import { useLazyGetUserNotificationsQuery } from "../../../state/notifications/api";
import { useDeleteNotifiactionMutation } from "../../../state/notifications/api";
import { useMarkNotificationAsSeenMutation } from "../../../state/notifications/api";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

const UserNotification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestChange, setRequestChange] = useState();
  const [userNotifications, setUserNotifications] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [
    getUser,
    {
      data: userFromRequest,
      isSuccess: isGetUserSucces,
      isError: getUserError,
    },
  ] = useLazyGetAuthUserQuery();
  const [deleteNotification, { isLoading: isDeletingNotificationLoading }] =
    useDeleteNotifiactionMutation();
  const [getNotifications, { data: result, isLoading: notificationsLoading }] =
    useLazyGetUserNotificationsQuery();

  const [
    markNotification,
    { isLoading: markNotificationLoading, isSuccess: notificationMarked },
  ] = useMarkNotificationAsSeenMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(user).length) {
      getUser();
    } else {
      setIsLoading(false);
    }
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
    getNotifications(currentPage);
  }, []);

  if (window?.Echo) {
    window.Echo.channel(`user.${user.id}`).listen("SendEventToClient", (e) => {
      if (e.action === "notification") {
        setUserNotifications([e.content, ...userNotifications]);
        dispatch(setHasUserNewNotifications({ value: true }));
      } else if (e.action === "delete_notification") {
        setUserNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.id !== e.content.notification_id
          )
        );
      }
    });
  }

  useEffect(() => {
    if (getUserError) {
      return navigate("/login");
    }
    if (isGetUserSucces) {
      dispatch(addUser(userFromRequest.data.user));
      setIsLoading(false);
    }
  }, [getUserError, isGetUserSucces]);

  useEffect(() => {
    if (result) {
      setUserNotifications(result.data.notifications);
    }
  }, [result]);

  useEffect(() => {
    if (notificationMarked) {
      let unseenNotifications = false;
      userNotifications.forEach((notification) => {
        if (notification.id !== requestChange && notification.seen === 0) {
          return (unseenNotifications = true);
        }
      });
      if (!unseenNotifications) {
        dispatch(setHasUserNewNotifications({ value: false }));
      }
    }
  }, [notificationMarked]);

  function _handleDeleteNotification(id) {
    setRequestChange(id);
    deleteNotification(id);
    let unseenNotifications = false;
    userNotifications.forEach((notification) => {
      if (notification.id !== id && notification.seen === 0) {
        return (unseenNotifications = true);
      }
    });
    if (!unseenNotifications) {
      dispatch(setHasUserNewNotifications({ value: false }));
    }
  }

  function _handleMarkTaskAsSeen(notificationID) {
    const payload = {
      id: notificationID,
    };
    setRequestChange(notificationID);
    markNotification(payload);
  }

  function nextPage() {
    setCurrentPage((page) => page + 1);
  }

  function prevPage() {
    setCurrentPage((page) => page - 1);
  }

  return (
    <div className={classes.mainContainer}>
      {!isLoading ? (
        <>
          <LeftPanel user={user} />
          <div className={reusable.main_container_shape}>
            <img alt="shape" src={mainPageShape} />
          </div>
          <div className={classes.container}>
            <div className={classes.mainPanel}>
              <div className={classes.panelHeader}>
                <h1>Notifications</h1>
              </div>
              <div className={classes.notificationsContainer}>
                {!notificationsLoading && userNotifications.length === 0 ? (
                  <div className={classes.anno}>
                    <h3>Nothing to display</h3>
                  </div>
                ) : null}
                {notificationsLoading ? (
                  <div className={classes.loadingContainer}>
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    {userNotifications &&
                      userNotifications.map((notif) => {
                        return (
                          <div key={notif.id} className={classes.notification}>
                            <p>{notif.message}</p>
                            <div className={classes.btns}>
                              {notif.seen === 0 ? (
                                markNotificationLoading &&
                                requestChange === notif.id ? (
                                  requestChange === notif.id && (
                                    <LoadingSpinner
                                      width={"1.5rem"}
                                      height={"1.5rem"}
                                    />
                                  )
                                ) : (
                                  <button
                                    className={classes.markNotification}
                                    onClick={() =>
                                      _handleMarkTaskAsSeen(notif.id)
                                    }
                                  >
                                    Mark
                                  </button>
                                )
                              ) : null}
                              {isDeletingNotificationLoading &&
                              requestChange === notif.id ? (
                                <LoadingSpinner
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              ) : (
                                <button
                                  className={classes.deleteNotification}
                                  onClick={() =>
                                    _handleDeleteNotification(notif.id)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
              {result && result.data.notifications.length > 0 && (
                <div className={classes.pagination}>
                  <p>
                    {result.data.currentPage} / {result.data.lastPage}
                  </p>
                  {result.data.hasMorePages && (
                    <button onClick={nextPage}>Next page</button>
                  )}
                  {result.data.currentPage > 1 && (
                    <button onClick={prevPage}>Prev page</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default UserNotification;
