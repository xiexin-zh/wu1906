import React from 'react';
import styles from './index.css';

const LoadingIcon = (props) => {
  return (
    <div className={styles.loadEffect}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default LoadingIcon;
