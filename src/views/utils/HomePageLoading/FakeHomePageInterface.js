import React from 'react'
import FakeLeftPanel from '../LeftPanelFaker/FakeLeftPanel';
import classes from "./FakeHomePageInterface.module.scss";
import BoardLoadingSkeleton from "../BoardLoadingSkeleton";
const FakeHomePageInterface = () => {
  return (
    <div className={classes.panel}>
        <FakeLeftPanel/>
        <div className={classes.container}>
            <div className={classes.mainPanel}>
            <div className={classes.panelHeader}>
               <h1>Panel</h1>
             </div>
             <div className={classes.boardsContainer}>
                 <h2>Your boards</h2>
                 <div className={classes.skeletonBoardContainer}>
                 <BoardLoadingSkeleton/>
                 </div>
                
                <h2>Joined boards</h2>
                <div className={classes.skeletonBoardContainer}>
                 <BoardLoadingSkeleton/>
                 </div>
             </div>
            </div>
        </div>
    </div>
  )
}

export default FakeHomePageInterface