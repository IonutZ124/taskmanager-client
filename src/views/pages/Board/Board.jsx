import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Board.module.scss";
import reusable from "../../resources/css/reusable.module.scss";
import mainPageShape from "../../resources/shapes/mainPageShape.png";
import LeftPanel from "../Home/LeftPanel/LeftPanel";
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAuthUserQuery } from "../../../state/user/api";
import { addUser } from "../../../state/user/user";
import { useLazyGetBoardContentQuery } from "../../../state/boards/api";
import Status from "./StatusComponent/Status";
import { FaUserFriends } from "react-icons/fa";
import BoardMembers from "./BoardMembersComponent/BoardMembers";
import CreateStatuses from "./CreateStatusesComponent/CreateStatuses";
import TaskPanel from "./TaskPanelComponent/TaskPanel";
import { setPanelActive } from "../../../state/Reducers/displayTaskPanel/displayTaskPanel";
import BoardInviteMembersPanel from "./BoardInviteMembersPanel/BoardInviteMembersPanel";
import { setBoardInvitePanelActive } from "../../../state/Reducers/displayInviteUserPanel/displayInviteUserPanel";
import { useDeleteUserBoardMutation } from "../../../state/boards/api";
import { useArchiveBoardMutation } from "../../../state/boards/api";
import TaskCommentsComponent from "./TaskCommentsComponent";
import { setPanelStatus } from "../../../state/Reducers/displayTaskComments/displayTaskComments";
import TaskHistoryPanel from "./TaskComponent/TaskHistoryPanel/TaskHistoryPanel";
import { setHistoryPanel } from "../../../state/Reducers/displayTaskHistoryPanel/displayTaskHistoryPanel";

const Board = () => {
  const { slug } = useParams();
  const { user } = useSelector((state) => state.user);
  const [boardStatuses, setBoardStatuses] = useState([]);
  const [displayBoardMembers, setDisplayBoardMembers] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [trigger, { data: result, isError, isSuccess }] =
    useLazyGetAuthUserQuery();
  const [
    getBoardContent,
    {
      data: boardContent,
      isLoading: isBoardContentLoading,
      isError: getBoardContentError,
    },
  ] = useLazyGetBoardContentQuery();
  const [
    deleteBoardMut,
    { isSuccess: hasBoardDeleted, isLoading: isBoardDeleting },
  ] = useDeleteUserBoardMutation();
  const [
    archiveBoard,
    { isSuccess: hasBoardArchived, isLoading: isBoardArchiving },
  ] = useArchiveBoardMutation();
  const { taskPanel } = useSelector((state) => state.taskPanel);
  const { taskComments } = useSelector((state) => state.taskComments);
  const { inviteBoardMembers } = useSelector(
    (state) => state.inviteBoardMembers
  );
  const { taskHistory } = useSelector((state) => state.taskHistory);

  const deleteBoard = () => {
    deleteBoardMut(boardContent.data.board_id);
  };
  const archiveBoardForUser = () => {
    archiveBoard(boardContent.data.board_id);
  };

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      trigger();
    } else {
      getBoardContent(slug);
    }
  }, [user]);
  useEffect(() => {
    if (isError) {
      return navigate("/login");
    }
    if (isSuccess && result) {
      dispatch(addUser(result.data.user));
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (getBoardContentError) {
      return navigate("/");
    }
    if (taskPanel.isPanelActive) {
      dispatch(
        setPanelActive({
          isPanelActive: false,
          payload: {},
        })
      );
    }
    if (inviteBoardMembers.isPanelActive) {
      dispatch(setBoardInvitePanelActive({ isPanelActive: false }));
    }
    if (taskComments.isPanelActive) {
      dispatch(setPanelStatus({ isPanelActive: false }));
    }
    if (taskHistory.isPanelActive) {
      dispatch(setHistoryPanel({ isPanelActive: false }));
    }
  }, [getBoardContentError, boardContent]);

  useEffect(() => {
    if (hasBoardDeleted) {
      return navigate("/");
    }
  }, [hasBoardDeleted]);

  useEffect(() => {
    if (hasBoardArchived) {
      return navigate("/");
    }
  }, [hasBoardArchived]);

  useEffect(() => {
    if (boardContent) {
      setBoardStatuses(boardContent.data.statuses);
    }
  }, [boardContent]);
  return (
    <div className={classes.mainContainer}>
      {Object.keys(user).length && (
        <>
          <div className={reusable.main_container_shape}>
            <img alt="shape" src={mainPageShape} />
          </div>
          <LeftPanel user={user} />
          <div className={classes.container}>
            <div className={classes.mainPanel}>
              {isBoardContentLoading ? (
                <div className={classes.loadingContent}>
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div className={classes.panelHeader}>
                    {boardContent && boardContent.data.userRole === "Admin" && (
                      <div className={classes.inviteUserContainer}>
                        <p>Invite user</p>
                        <button
                          onClick={() =>
                            dispatch(
                              setBoardInvitePanelActive({ isPanelActive: true })
                            )
                          }
                        >
                          Invite
                        </button>
                      </div>
                    )}
                    {boardContent && boardContent.data.isBoardOwner ? (
                      <>
                        {boardContent.data.isArchived ? (
                          <div className={classes.unarchiveBoardContainer}>
                            <p>Unarchive board</p>
                            {isBoardArchiving ? (
                              <div
                                className={classes.panelHeaderLoadingButtons}
                              >
                                <LoadingSpinner
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              </div>
                            ) : (
                              <button onClick={archiveBoardForUser}>
                                Unarchive
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className={classes.archiveBoardContainer}>
                            <p>Archive board</p>
                            {isBoardArchiving ? (
                              <div
                                className={classes.panelHeaderLoadingButtons}
                              >
                                <LoadingSpinner
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              </div>
                            ) : (
                              <button onClick={archiveBoardForUser}>
                                Archive
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : null}
                    {boardContent &&
                    (boardContent.data.isBoardOwner || user.isSuperAdmin) ? (
                      <div className={classes.deleteBoardContainer}>
                        <p>Delete board</p>
                        {isBoardDeleting ? (
                          <div className={classes.panelHeaderLoadingButtons}>
                            <LoadingSpinner
                              width={"1.5rem"}
                              height={"1.5rem"}
                            />
                          </div>
                        ) : (
                          <button onClick={deleteBoard}>Delete</button>
                        )}
                      </div>
                    ) : null}
                    <div
                      className={classes.boardMembersContainer}
                      onClick={() => setDisplayBoardMembers(true)}
                    >
                      <p>Members</p>
                      <div>
                        <FaUserFriends size={25} />
                      </div>
                    </div>
                  </div>
                  {boardContent && boardContent.data.userRole === "Admin" ? (
                    <CreateStatuses
                      boardID={boardContent.data.board_id}
                      boardStatuses={boardStatuses}
                      setBoardStatuses={setBoardStatuses}
                    />
                  ) : null}
                  {boardContent && boardStatuses.length === 0 ? (
                    <div className={classes.noContent}>
                      <h3>This board has no content</h3>
                    </div>
                  ) : (
                    <div className={classes.statusesContainer}>
                      {boardStatuses.map((statuses) => {
                        return (
                          <Status
                            key={statuses.id}
                            userRole={boardContent.data.userRole}
                            statusID={statuses.id}
                            name={statuses.name}
                            tasks={statuses.tasks}
                            setBoardStatuses={setBoardStatuses}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {boardContent && displayBoardMembers && (
                <BoardMembers
                  boardID={boardContent.data.board_id}
                  user={user}
                  userRole={boardContent.data.userRole}
                  setDisplayBoardMembers={setDisplayBoardMembers}
                />
              )}
              {boardContent && taskPanel.isPanelActive && (
                <TaskPanel
                  boardID={boardContent.data.board_id}
                  userRole={boardContent.data.userRole}
                  isBoardOwner={boardContent.data.isBoardOwner}
                />
              )}

              {boardContent && taskComments.isPanelActive && (
                <TaskCommentsComponent
                  boardID={boardContent.data.board_id}
                  userRole={boardContent.data.userRole}
                />
              )}
              {boardContent && taskHistory.isPanelActive && (
                <TaskHistoryPanel />
              )}

              {boardContent && inviteBoardMembers.isPanelActive && (
                <BoardInviteMembersPanel boardID={boardContent.data.board_id} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
