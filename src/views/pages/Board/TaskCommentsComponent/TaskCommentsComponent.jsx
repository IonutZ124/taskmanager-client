import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateCommentMutation } from "../../../../state/tasks/api";
import { useGetTaskCommentsQuery } from "../../../../state/tasks/api";
import { setPanelStatus } from "../../../../state/Reducers/displayTaskComments/displayTaskComments";
import LoadingSpinner from "../../../utils/LoadingSpinner/LoadingSpinner";
import { FiClock } from "react-icons/fi";
import classes from "./TaskComponent.module.scss";
import { useDeleteTaskCommentsMutation } from "../../../../state/tasks/api";
import DropDown from "./DropDown";
import { useParams } from "react-router-dom";
import { generateMessage } from "./TaskCommments.logic";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import TaskCommentsFakeInterfaceLoading from "../../../utils/TaskCommentsFakeInterfaceLoading/TaskCommentsFakeInterfaceLoading";

const TaskCommentsComponent = ({ boardID, userRole }) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const [requestDelete, setRequestDelete] = useState();
  const [comment, setComment] = useState("");
  const [getTaskComments, setTaskComments] = useState([]);
  const [fetchedPages, setFetchedPages] = useState({});
  const [isDropDownActive, setDropDownActive] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [hasUserClickOnAutoComplete, setAutoCompleteClick] = useState("");
  const [appError, setAppError] = useState();
  const { taskComments } = useSelector((state) => state.taskComments);
  const { user } = useSelector((state) => state.user);
  const [echo, setEcho] = useState(null);

  useEffect(() => {
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "pusher",
      key: process.env.REACT_APP_WEBSOCKETS_KEY,
      wsHost: process.env.REACT_APP_WEBSOCKETS_SERVER,
      wsPort: 6001,
      forceTLS: false,
      disableStatus: true,
      enabledTransports: ["ws", "wss"],
    });
    setEcho(echo);
  }, []);

  useEffect(() => {
    echo?.channel(`user.${user.id}`).listen("SendEventToClient", (e) => {
      if (e.action === "comments") {
        if (e.content.task_id === taskComments.payload.taskID) {
          const commentExists = getTaskComments.some(
            (comment) => comment.id === e.content.id
          );
          if (!commentExists) {
            setTaskComments([e.content, ...getTaskComments]);
          }
        }
      }
      if (
        e.action === "delete_comment" &&
        taskComments.payload.taskID === e.content.task_id
      ) {
        setTaskComments((prev) =>
          prev.filter((comment) => comment.id !== +e.content.comment_id)
        );
      }
    });
  }, [echo, user, getTaskComments, taskComments]);

  const [
    createComment,
    {
      isLoading: isLoadingCreateTask,
      isSuccess: commentCreated,
      isError: createCommentError,
      error,
    },
  ] = useCreateCommentMutation();
  const {
    data,
    isLoading: commentsLoading,
    isFetching: dataFetching,
  } = useGetTaskCommentsQuery({
    id: taskComments.payload.taskID,
    page,
  });
  const [deleteTaskComment, { isLoading: isDeletingCommentLoading }] =
    useDeleteTaskCommentsMutation();

  function closePanelTab() {
    dispatch(
      setPanelStatus({
        isPanelActive: false,
      })
    );
  }
  function createNewComment() {
    const payload = {
      comment: comment,
      task_id: taskComments.payload.taskID,
      board_id: boardID,
      tagged_user_email: searchUser,
    };
    createComment(payload);
    setComment("");
  }
  function deleteComment(id) {
    setRequestDelete(id);
    deleteTaskComment(id);
  }
  const _scrollHandler = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      return data?.data.hasMorePages && setPage((page) => page + 1);
    }
  };
  useEffect(() => {
    const result = comment.match(/\@[^\s\.]+/);
    if (result) {
      const getUser = result[0].slice(1);
      const getEmailFromResult = result.input.match(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
      );
      if (getEmailFromResult) {
        setSearchUser(getEmailFromResult[0]);
      }
      if (getUser) {
        if (
          (getEmailFromResult &&
            getEmailFromResult[0] === hasUserClickOnAutoComplete) ||
          getEmailFromResult
        ) {
          return setDropDownActive(false);
        } else {
          setSearchUser(getUser);
          setDropDownActive(true);
        }
      }
    } else {
      setSearchUser("");
    }
  }, [comment]);

  useEffect(() => {
    if (commentCreated) {
      setAppError("");
    }
  }, [commentCreated]);

  useEffect(() => {
    if (createCommentError) {
      setAppError(error.data.message);
    }
  }, [createCommentError]);
  useEffect(() => {
    if (data) {
      if (!fetchedPages[page] && data.data.hasMorePages) {
        const seenPageObj = {};
        seenPageObj[page] = true;
        setFetchedPages(Object.assign(fetchedPages, seenPageObj));
        const displayData = [];

        const tmpData = [...getTaskComments, ...data?.data?.comments];
        tmpData.forEach((comment) => {
          const commentExists = displayData.some(
            (displayDataComment) => displayDataComment.id === comment.id
          );
          if (!commentExists) {
            displayData.push(comment);
          }
        });
        setTaskComments(displayData);
      } else {
        if (data.data.comments.length && getTaskComments.length === 0) {
          setTaskComments(data.data.comments);
        }
      }
    }
  }, [JSON.stringify(data), JSON.stringify(getTaskComments)]);
  return (
    <div className={classes.mainContainer}>
      <div
        className={classes.commentsPanel}
        onClick={() => setDropDownActive(false)}
      >
        <div className={classes.closeTab} onClick={closePanelTab}>
          <button>✖</button>
        </div>
        <div className={classes.panelHeader}>
          <h2>Comments</h2>
        </div>
        {isDropDownActive ? (
          <DropDown
            boardSlug={slug}
            searchUser={searchUser}
            setComment={setComment}
            comment={comment}
            setDropDownActive={setDropDownActive}
            setAutoCompleteClick={setAutoCompleteClick}
          />
        ) : null}
        <div className={classes.addComentMainContainer}>
          <div className={classes.addCommentContainer}>
            <input
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment"
              value={comment}
            />
            {isLoadingCreateTask ? (
              <div className={classes.createTaskLoading}>
                <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
              </div>
            ) : (
              <button onClick={createNewComment}>✚</button>
            )}
          </div>
          {appError && (
            <div className={classes.appError}>
              <p>{appError}</p>
            </div>
          )}
        </div>

        <div className={classes.commentsPanel}>
          {commentsLoading ? (
            <div className={classes.loadingContainer}>
              <TaskCommentsFakeInterfaceLoading />
            </div>
          ) : (
            <>
              {getTaskComments && getTaskComments.length === 0 ? (
                <div className={classes.noContent}>
                  <h3>Nothing to display</h3>
                </div>
              ) : (
                <div
                  onScroll={(e) => _scrollHandler(e)}
                  className={classes.commentsContainer}
                >
                  {getTaskComments &&
                    getTaskComments.map((comment) => {
                      return (
                        <div key={comment.id} className={classes.comment}>
                          {comment.id === requestDelete &&
                          isDeletingCommentLoading ? (
                            <div className={classes.deleteCommentLoading}>
                              <LoadingSpinner
                                width={"1.5rem"}
                                height={"1.5rem"}
                              />
                            </div>
                          ) : (
                            <>
                              {(comment.user_email === user.email ||
                                userRole === "Admin") && (
                                <div className={classes.removeComment}>
                                  <button
                                    onClick={() => deleteComment(comment.id)}
                                  >
                                    ✖
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          <div className={classes.commentCreatedBy}>
                            <p>
                              <strong>Created by:</strong> {comment.user_email}
                            </p>
                          </div>

                          <p>
                            <strong>Message:</strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: generateMessage(comment.comment),
                              }}
                            />
                          </p>
                          <div className={classes.created_at}>
                            <FiClock />
                            <p>
                              {new Date(comment.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  <div>
                    {dataFetching && (
                      <LoadingSpinner width={"2rem"} height={"2rem"} />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCommentsComponent;
