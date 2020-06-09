import React from 'react';
import classnames from 'classnames';
import styles from './index.css';
// 複用組件
const AsideItem = (props) => {
  const avatarIcon = classnames({
    [styles.tagAvatar]: true,
    [styles.groupAvatar]: props.type === 'group',
    [styles.allAvatar]: props.type === 'all',
  });
  return (
    <div
      className={`${styles.asideItemContainer} ${
        props.isActive ? styles.activeItme : ''
      }`}
    >
      <div className={avatarIcon}></div>
      <span>{props.itemContent}</span>
    </div>
  );
};

export default AsideItem;
