import React, { Component } from 'react';
import styles from './index.scss';
import LoadingIcon from '../../LoadingIcon';
class ModalLoading extends Component {
  render() {
    return (
      <div className={styles.modalContainer}>
        <LoadingIcon />
      </div>
    );
  }
}
export default ModalLoading;
