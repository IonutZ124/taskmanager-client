import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBoardInvitePanelActive } from "../../../../state/Reducers/displayInviteUserPanel/displayInviteUserPanel";
import { useSendBoardInviteMutation } from "../../../../state/boards/api";
import LoadingSpinner from "../../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./BoardInviteMembers.module.scss";

const BoardInviteMembersPanel = ({ boardID }) => {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState();
  const [sendInviteMsg, setSendInviteMsg] = useState();
  const [
    sendBoardInvite,
    {
      isLoading: isBoardInviteLoading,
      isSuccess: hasBoardInviteSended,
      isError: sendBoardInviteError,
      error,
    },
  ] = useSendBoardInviteMutation();
  const closePanel = () => {
    dispatch(
      setBoardInvitePanelActive({
        isPanelActive: false,
      })
    );
  };
  const sendInvite = () => {
    setSendInviteMsg("");
    const payload = {
      board_id: boardID,
      email: userEmail,
    };
    sendBoardInvite(payload);
  };
  useEffect(() => {
    if (hasBoardInviteSended) {
      setSendInviteMsg("Invite sent");
    }
    if (sendBoardInviteError) {
      if (typeof error.data.message == "object") {
        return setSendInviteMsg(error.data.message.email);
      } else {
        return setSendInviteMsg(error.data.message);
      }
    }
  }, [hasBoardInviteSended, sendBoardInviteError]);
  return (
    <div className={classes.mainContainer}>
      <div className={classes.boardInviteMembersPanel}>
        <div className={classes.closeTab}>
          <button onClick={closePanel}>✖</button>
        </div>
        <div className={classes.content}>
          <div className={classes.panelHeader}>
            <h2>Invite user</h2>
          </div>
          <div className={classes.inviteUserContainer}>
            <input
              placeholder="Enter user email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <div>
              {isBoardInviteLoading ? (
                <LoadingSpinner width={"1.5rem"} height={"1.5rem"} />
              ) : (
                <button onClick={sendInvite}>Send invite</button>
              )}
            </div>
          </div>
          {sendInviteMsg && <p className={classes.appMsg}>{sendInviteMsg}</p>}
          <div className={classes.anno}>
            <p>
              <strong>Note:</strong> Invited users don't neccesary need an
              account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardInviteMembersPanel;
