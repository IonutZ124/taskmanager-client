import React, { useState, useEffect, useRef } from "react";
import classes from "./Profile.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import reusable from "../../resources/css/reusable.module.scss";
import LeftPanel from "../Home/LeftPanel/LeftPanel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserByIDQuery,
  useLazyGetAuthUserQuery,
  useUploadImageProfileMutation,
} from "../../../state/user/api";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import { addUser } from "../../../state/user/user";
import ProfilePageLoading from "../../utils/ProfilePageLoading/ProfilePageLoading";

const Profile = () => {
  const [isUserAuth, setIsUserAuth] = useState();
  const [userImageProfile, setUserImageProfileBool] = useState(false);
  const [
    getUser,
    {
      data: userFromRequest,
      isSuccess: isGetUserSucces,
      isError: getUserError,
    },
  ] = useLazyGetAuthUserQuery();
  const [uploadImage] = useUploadImageProfileMutation();
  const [IsLoading, setIsLoading] = useState(true);
  const hiddenFileInput = useRef(null);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const {
    data,
    isLoading,
    isError: getUserByIDError,
  } = useGetUserByIDQuery(id);
  const dispatch = useDispatch();

  const handleClickFileInput = () => {
    hiddenFileInput.current.click();
  };
  const getFileInputContent = (e) => {
    const fileUploaded = e.target.files[0];
    const formData = new FormData();
    formData.append("image", fileUploaded);
    uploadImage(formData);
  };
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      setIsUserAuth(true);
    } else {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (getUserError) {
      return navigate("/login");
    }
    if (isGetUserSucces) {
      dispatch(addUser(userFromRequest.data.user));
      setIsLoading(false);
      setIsUserAuth(true);
    }
  }, [getUserError, isGetUserSucces]);

  useEffect(() => {
    if (data && data.data.profile_image?.length > 0) {
      setUserImageProfileBool(true);
    }
  }, [data]);
  useEffect(() => {
    if (getUserByIDError) {
      return navigate("/");
    }
  }, [getUserByIDError]);
  return (
    <div className={classes.mainContainer}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} alt="shape" />
      </div>
      {isLoading || !isUserAuth ? (
        <ProfilePageLoading />
      ) : (
        <>
          <LeftPanel user={user} />
          <div className={classes.container}>
            <div className={classes.panelContent}>
              <div className={classes.panelHeader}>
                {user.id == id && (
                  <div className={classes.uploadImageContainer}>
                    <input
                      type="button"
                      value="Upload new image"
                      onClick={handleClickFileInput}
                    />
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={hiddenFileInput}
                      onChange={getFileInputContent}
                    />
                  </div>
                )}
                <h2>Profile page</h2>
              </div>

              {isLoading ? (
                <div className={classes.loadingUserContainer}>
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {data ? (
                    <div className={classes.userContainer}>
                      <h2>{data.data.user.name}</h2>
                      <div className={classes.profile}>
                        {data && (
                          <>
                            {userImageProfile ? (
                              <img
                                src={
                                  "http://localhost:8000/" +
                                  data.data.profile_image
                                }
                                alt="profile_img"
                              />
                            ) : (
                              <div className={classes.noUserImage}>
                                <p>{data.data.user.name[0].toUpperCase()}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <p className={classes.userEmail}>
                        <strong>Email: </strong>
                        {data.data.user.email}
                      </p>
                      <p>
                        <strong>Super-Admin:</strong>{" "}
                        {data.data.user.isSuperAdmin ? "True" : "False"}
                      </p>
                      <p>
                        <strong>Joined at:</strong>{" "}
                        {data.data.user.email_verified_at &&
                          new Date(
                            data.data.user.email_verified_at
                          ).toLocaleDateString()}
                      </p>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
