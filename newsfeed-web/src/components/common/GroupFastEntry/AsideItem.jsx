import React from 'react';
// import { connect } from 'dva';
import { Avatar } from 'antd';
import styles from './GroupFastEntry.css';
// import { setCurrentGroup } from '../../../models/groupInfo/actions';
// 複用組件
const AsideItem = (props) => {
  const { itemContent, avatarUrl, indexSymbol } = props;
  return (
    <div className={`${styles.asideItemContainer}`}>
      {avatarUrl ? (
        <Avatar src={avatarUrl} size={30}></Avatar>
      ) : (
        <div className={styles.noAvatar}>{indexSymbol ? indexSymbol : ''}</div>
      )}
      <span className={styles.text}>{itemContent}</span>
    </div>
  );
};

export default AsideItem;
