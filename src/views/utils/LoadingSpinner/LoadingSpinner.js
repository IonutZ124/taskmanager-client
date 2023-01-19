import React from 'react'
import classes from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({width, height}) => {
  return (
    <div className={classes.spinner_container}>
        <span className={classes.loader} style={{width, height}}></span>
    </div>
  )
}

export default LoadingSpinner