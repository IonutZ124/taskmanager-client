import React, { useState } from "react";
import { useEffect } from "react";
import { useCreateNewStatusMutation } from "../../../../state/boards/api";
import LoadingSpinner from "../../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./CreateStatuses.module.scss";

const CreateStatuses = ({ boardID, boardStatuses, setBoardStatuses }) => {
  const [inputValue, setInputValue] = useState("");
  const [createStatus, { data: status, isLoading, isSuccess }] =
    useCreateNewStatusMutation();

  function createBoardStatus() {
    const payload = {
      name: inputValue,
      board_id: boardID,
    };
    createStatus(payload);
    setInputValue("");
  }
  useEffect(() => {
    if (isSuccess) {
      setBoardStatuses([...boardStatuses, status.data]);
    }
  }, [isSuccess]);
  return (
    <div className={classes.mainContainer}>
      <input
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a status name"
        value={inputValue}
      />
      {isLoading ? (
        <LoadingSpinner width={"1.3rem"} height={"1.3rem"} />
      ) : (
        <div className={classes.addStatusesContainer}>
          <button onClick={createBoardStatus}>✚</button>
        </div>
      )}
    </div>
  );
};

export default CreateStatuses;
