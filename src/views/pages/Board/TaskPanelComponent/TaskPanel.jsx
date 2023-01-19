import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useArctiveTaskMutation } from "../../../../state/tasks/api";
import { useAssignUserToTaskMutation } from "../../../../state/tasks/api";
import { useChangeTaskStatusMutation } from "../../../../state/tasks/api";
import { useDeleteTaskMutation } from "../../../../state/tasks/api";
import { useGetTaskAssignedQuery } from "../../../../state/tasks/api";
import { setPanelActive } from "../../../../state/Reducers/displayTaskPanel/displayTaskPanel";
import LoadingSpinner from "../../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./TaskPanel.module.scss";

const TaskPanel = ({ boardID, userRole, isBoardOwner }) => {
  const dispatch = useDispatch();
  const { taskPanel } = useSelector((state) => state.taskPanel);
  const [userEmail, setUserEmail] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [canUserChangeTaskStatus, setUserCanChangeTaskStatus] = useState(
    userRole === "Admin" ? true : false
  );
  const [appError, setAppError] = useState();
  const [
    assignUserToTask,
    { isLoading: isAssignedUserToTaskLoading, isError: assignUserError, error },
  ] = useAssignUserToTaskMutation();
  const {
    data: members,
    isLoading: isGetMembersLoading,
    isSuccess: isGetMembersSucces,
  } = useGetTaskAssignedQuery({
    id: taskPanel.payload.taskID,
    page: currentPage,
  });
  const [
    setTaskStatus,
    { isLoading: isChangeTaskStatusLoading, isSuccess: isStatusChanged },
  ] = useChangeTaskStatusMutation();
  const [deleteTaskMut, { isLoading: isTaskDeleteLoading }] =
    useDeleteTaskMutation();
  const [archiveTask, { isLoading: isTaskArchiving }] =
    useArctiveTaskMutation();
  function closePanelTab() {
    dispatch(
      setPanelActive({
        isPanelActive: false,
        payload: {},
      })
    );
  }
  function assignUser() {
    setAppError("");
    const payload = {
      task_id: taskPanel.payload.taskID,
      board_id: boardID,
      email: userEmail,
    };
    assignUserToTask(payload);
  }
  const nextPage = () => {
    setCurrentPage((page) => page + 1);
  };
  const prevPage = () => {
    setCurrentPage((page) => page - 1);
  };
  const changeTaskStatus = (newstatus) => {
    const payload = {
      board_id: boardID,
      task_id: taskPanel.payload.taskID,
      status: newstatus,
    };
    setTaskStatus(payload);
  };
  const deleteTask = () => {
    deleteTaskMut(taskPanel.payload.taskID);
  };
  const archiveTasKForUser = () => {
    archiveTask(taskPanel.payload.taskID);
  };
  useEffect(() => {
    if (isGetMembersSucces && userRole !== "Admin") {
      setUserCanChangeTaskStatus(members.data.isCurrentUserAssigned);
    }
  }, [isGetMembersSucces]);
  useEffect(() => {
    if (assignUserError) {
      if (error.data.message?.email) {
        return setAppError(error.data.message.email[0]);
      }
      return setAppError(error.data.message);
    }
  }, [assignUserError]);
  return (
    <div className={classes.mainContainer}>
      <div className={classes.taskPanel}>
        <div className={classes.closeTab} onClick={closePanelTab}>
          <button>✖</button>
        </div>
        <div className={classes.isTaskActiveContainer}>
          <div className={classes.taskStatus}>
            {taskPanel.payload.isActive ? <p>Active</p> : <p>Completed</p>}
          </div>
          <div className={classes.taskStatusButtons}>
            {canUserChangeTaskStatus && (
              <>
                {isChangeTaskStatusLoading ? (
                  <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
                ) : (
                  <>
                    {taskPanel.payload.isActive ? (
                      <button onClick={() => changeTaskStatus(0)}>
                        Mark as Inactive
                      </button>
                    ) : (
                      <button onClick={() => changeTaskStatus(1)}>
                        Mark as Active
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {userRole === "Admin" && (
            <div className={classes.delete}>
              {isTaskDeleteLoading ? (
                <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
              ) : (
                <button onClick={deleteTask}>Delete Task</button>
              )}
            </div>
          )}
          {isBoardOwner ? (
            <div className={classes.archiveTask}>
              {isTaskArchiving ? (
                <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
              ) : (
                <button onClick={archiveTasKForUser}>Archive task</button>
              )}
            </div>
          ) : null}
        </div>
        <div className={classes.panelHeader}>
          <h2>Task Panel</h2>
        </div>
        <div className={classes.assignUserContainer}>
          <input
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter member board email"
          />
          {isAssignedUserToTaskLoading ? (
            <div className={classes.assignUserLoading}>
              <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
            </div>
          ) : (
            <button onClick={assignUser}>Assign</button>
          )}
        </div>
        {appError && <p className={classes.appError}>{appError}</p>}
        <div className={classes.assignedUsersContainer}>
          <h2>Assigned users</h2>
          {members && members.data.users.length === 0 ? (
            <div className={classes.noContent}>
              <h4>Nothing to display</h4>
            </div>
          ) : (
            <div className={classes.usersMainContainer}>
              {isGetMembersLoading ? (
                <div className={classes.loading}>
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {members &&
                    members.data.users.map((user) => {
                      return (
                        <div className={classes.user} key={user.id}>
                          <p>{user.email}</p>
                          <div>
                            <p>Assigned</p>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          )}
        </div>
        {members && members.data.users.length && (
          <div className={classes.paginate}>
            <p>
              {members.data.currentPage}/{members.data.lastPage}
            </p>
            <div className={classes.paginateBtns}>
              {members.data.currentPage > 1 && (
                <button onClick={prevPage}>Prev</button>
              )}
              {members.data.lastPage > 1 && (
                <button onClick={nextPage}>Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPanel;
