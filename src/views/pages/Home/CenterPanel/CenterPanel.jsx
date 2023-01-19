import React, { useState } from "react";
import classes from "./CenterPanel.module.scss";
import {
  useGetUserBoardsQuery,
  useGetBoardsWhereUserIsMemberQuery,
} from "../../../../state/boards/api";
import Pagination from "./components/Pagination";
import Board from "./components/Board/Board";
import BoardLoadingSkeleton from "../../../utils/BoardLoadingSkeleton";

const CenterPanel = () => {
  const [userBoardsPage, setUserBoardsPage] = useState(1);
  const { data: result, isLoading: isUserBoardsLoading } =
    useGetUserBoardsQuery(userBoardsPage);

  const [joinedBoardsPage, setJoinedBoardsPage] = useState(1);
  const {
    data: joinedBoards,
    isLoading: isJoinedBoardsLoading,
    isSuccess: isJoinedBoarSucces,
  } = useGetBoardsWhereUserIsMemberQuery(joinedBoardsPage);
  return (
    <div className={classes.container}>
      <div className={classes.mainPanel}>
        <div className={classes.panelHeader}>
          <h1>Panel</h1>
        </div>
        <div className={classes.boards}>
          <h2>Your boards</h2>
          <div className={classes.boardsContainer}>
            {isUserBoardsLoading ? (
              <BoardLoadingSkeleton />
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
          <h2>Joined boards</h2>
          <div className={classes.boardsContainer}>
            {isJoinedBoardsLoading ? (
              <BoardLoadingSkeleton />
            ) : (
              <>
                {joinedBoards.data.boards.length ? (
                  joinedBoards.data.boards.map((board) => {
                    return <Board key={board.id} board={board} />;
                  })
                ) : (
                  <h3>Nothing to display</h3>
                )}
              </>
            )}
          </div>
          {joinedBoards && joinedBoards.data.lastPage > 1 ? (
            <Pagination
              currentPage={joinedBoardsPage}
              result={joinedBoards}
              setPage={setJoinedBoardsPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CenterPanel;
