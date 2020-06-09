import React from 'react';
// import { connect } from 'dva';
import styles from './index.scss';
import Header from './Header';
import Body from './Body';
import SliderLink from './SliderLink';

const Main = (props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Header />
        <Body />
        <SliderLink />
      </div>
    </div>
  );
};

export default Main;
