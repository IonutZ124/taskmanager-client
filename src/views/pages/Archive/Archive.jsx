import React, { useEffect, useState } from "react";
import LeftPanel from "../Home/LeftPanel/LeftPanel";
import classes from "../Archive/Archive.module.scss";
import reusable from "../../resources/css/reusable.module.scss";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import { addUser } from "../../../state/user/user";
import { useLazyGetAuthUserQuery } from "../../../state/user/api";
import Board from "../Home/CenterPanel/components/Board/Board";
import Pagination from "../Home/CenterPanel/components/Pagination";
import { useGetUserArchivedBoardsQuery } from "../../../state/boards/api";
import { useNavigate } from "react-router-dom";
import { useGetUserArchivedTasksQuery } from "../../../state/tasks/api";
import ArchiveTask from "./ArchiveTaskComponent";

const Archive = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userBoardsPage, setUserBoardsPage] = useState(1);
  const [archivedTasksPage, setArchivedBoardsPage] = useState(1);
  const { data: result, isLoading: isUserBoardsLoading } =
    useGetUserArchivedBoardsQuery(userBoardsPage);
  const { data: userArchivedTasks, isLoading: isArchivedTasksLoading } =
    useGetUserArchivedTasksQuery(archivedTasksPage);

  const navigate = useNavigate;
  const { user } = useSelector((state) => state.user);
  const [
    getUser,
    {
      data: userFromRequest,
      isSuccess: isGetUserSucces,
      isError: getUserError,
    },
  ] = useLazyGetAuthUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(user).length) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getUserError) {
      return navigate("/login");
    }
    if (isGetUserSucces) {
      dispatch(addUser(userFromRequest.data.user));
      setIsLoading(false);
    }
  }, [getUserError, isGetUserSucces]);

  return (
    <div className={classes.mainContainer}>
      <div className={reusable.main_container_shape}>
        <img src={mainPageShape} />
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <LeftPanel user={user} />
          <div className={classes.container}>
            <div className={classes.mainPanel}>
              <div className={classes.panelHeader}>
                <h1>Archive</h1>
              </div>
              <div className={classes.boards}>
                <h2>Boards</h2>
                <div className={classes.boardsContainer}>
                  {isUserBoardsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {result.data.boards.length ? (
                        result.data.boards.map((board) => {
                          return <Board key={board.id} board={board} />;
                        })
                      ) : (
                        <h3>Nothing to display</h3>
                      )}
                    </>
                  )}
                </div>
                {result && result.data.lastPage > 1 ? (
                  <Pagination
                    currentPage={userBoardsPage}
                    result={result}
                    setPage={setUserBoardsPage}
                  />
                ) : null}

                <h2>Tasks</h2>
                <div className={classes.boardsContainer}>
                  {isArchivedTasksLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {userArchivedTasks &&
                      userArchivedTasks.data.tasks.length ? (
                        userArchivedTasks.data.tasks.map((task) => {
                          return (
                            <ArchiveTask
                              key={task.id}
                              name={task.name}
                              taskID={task.id}
                            />
                          );
                        })
                      ) : (
                        <h3>Nothing to display</h3>
                      )}
                    </>
                  )}
                </div>
                {userArchivedTasks && userArchivedTasks.data.lastPage > 1 ? (
                  <Pagination
                    currentPage={archivedTasksPage}
                    result={userArchivedTasks}
                    setPage={setArchivedBoardsPage}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Archive;
