import React, { Component } from 'react';
import styles from './index.scss';

import { Avatar } from 'antd';
import GroupButton from '../../../../GroupDetails/GroupInfo/GroupButton';

// const getInitialData = () => {
//   return {
//     loding: false,
//   };
// };
class AsideItem extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = getInitialData();
  // }

  render() {
    const { item, onClick } = this.props;
    const { avatarUrl, indexSymbol } = item;
    return (
      <div onClick={onClick} className={styles.item}>
        <div className={styles.contnet}>
          <div className={styles.userinfo}>
            <Avatar size={30} src={avatarUrl}>
              {indexSymbol}
            </Avatar>
            <span className={styles.text}>{item.name}</span>
          </div>
          <GroupButton
            isFollowed={item.isFollowed}
            isGroupMember={item.isGroupMember}
            className={styles.button}
            group={item}
            disableInvite
          />
        </div>
      </div>
    );
  }
}

export default AsideItem;
