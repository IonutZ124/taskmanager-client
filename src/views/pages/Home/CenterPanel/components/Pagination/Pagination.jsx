import React from 'react'
import classes from "./Pagination.module.scss";

const Pagination = ({currentPage, result, setPage}) => {
    const nextPage = () => {
        return setPage(page => page + 1);
    }
    const prevPage = () => {
        return setPage(page => page - 1);
    }
  return (
    <div className={classes.paginationContainer}>
        <p>Page {currentPage}/{result.data.lastPage}</p>
        <div className={classes.paginationButtons}>
            {currentPage > 1 && <button onClick={prevPage}>Prev page</button>}
            {currentPage < result.data.lastPage && <button onClick={nextPage}>Next page</button>}
        </div>
   </div>
  )
}

export default Pagination