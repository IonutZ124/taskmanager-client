import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHistoryPanel } from "../../../../../state/Reducers/displayTaskHistoryPanel/displayTaskHistoryPanel";
import { useGetTaskHistoryQuery } from "../../../../../state/tasks/api";
import { FiClock } from "react-icons/fi";
import classes from "./TaskHistoryPanel.module.scss";
import LoadingSpinner from "../../../../utils/LoadingSpinner/LoadingSpinner";

const TaskHistoryPanel = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { taskHistory } = useSelector((state) => state.taskHistory);
  const { data, isLoading } = useGetTaskHistoryQuery({
    id: taskHistory.payload.taskID,
    page: currentPage,
  });
  function closeTab() {
    dispatch(
      setHistoryPanel({
        isPanelActive: false,
      })
    );
  }
  function nextPage() {
    setCurrentPage((page) => page + 1);
  }
  function prevPage() {
    setCurrentPage((page) => page - 1);
  }
  return (
    <div className={classes.mainContainer}>
      <div className={classes.historyPanel}>
        <div className={classes.closeTab} onClick={closeTab}>
          <button>✖</button>
        </div>
        <div className={classes.panelHeader}>
          <h2>Task history</h2>
        </div>
        <div className={classes.history}>
          {isLoading ? (
            <div className={classes.loadingContainer}>
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {data &&
                data.data.task_history.map((action) => {
                  return (
                    <div className={classes.action} key={action.id}>
                      <div className={classes.action_time}>
                        <FiClock />
                        <p>{new Date(action.created_at).toLocaleString()}</p>
                      </div>
                      <p className={classes.action_text}>{action.action}</p>
                    </div>
                  );
                })}
            </>
          )}
        </div>
        {data && data.data.task_history.length > 0 && (
          <div className={classes.pagination}>
            <p>
              {data.data.currentPage} / {data.data.lastPage}
            </p>
            {data.data.hasMorePages && (
              <button onClick={nextPage}>Next page</button>
            )}
            {data.data.currentPage > 1 && (
              <button onClick={prevPage}>Prev page</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistoryPanel;
