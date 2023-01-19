import React from "react";
import { useArctiveTaskMutation } from "../../../../state/tasks/api";
import LoadingSpinner from "../../../utils/LoadingSpinner/LoadingSpinner";
import classes from "./ArchiveTask.module.scss";
const ArchiveTask = ({ name, taskID }) => {
  const [archiveTask, { isLoading }] = useArctiveTaskMutation();
  const unarchiveTask = () => {
    archiveTask(taskID);
  };
  return (
    <div className={classes.archiveTaskContaner}>
      <p>{name}</p>
      {isLoading ? (
        <LoadingSpinner width={"1rem"} height={"1rem"} />
      ) : (
        <button onClick={unarchiveTask}>Unarchive</button>
      )}
    </div>
  );
};

export default ArchiveTask;
