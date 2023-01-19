import React from 'react'
import { useNavigate } from 'react-router-dom';
import classes from "./Board.module.scss";
const Board = ({board}) => {

  const navigate = useNavigate();
  function gotToBoard(){
    return navigate(`/board/${board.slug}`);
  }
  return (
    <div key={board.id} className={classes.boardComponent} onClick={gotToBoard}>
        <p>{board.name}</p>
    </div>
  )
}

export default Board