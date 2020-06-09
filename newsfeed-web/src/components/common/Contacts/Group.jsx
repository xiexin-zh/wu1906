import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
// import { connect } from 'dva';

import styles from './index.css';
import FollowBtn from './FollowBtn';
function Group(props) {
  const {
    avatarUrl,
    name,
    indexSymbol,
    itemHeight,
    avatarSize,
    groupId,
    followed,
    onClick,
  } = props;
  return (
    <div
      className={styles.groups}
      style={{ height: `${itemHeight}px` }}
      onClick={onClick}
    >
      <span className={styles.avatar}>
        <Avatar size={avatarSize} src={avatarUrl}>
          {indexSymbol}
        </Avatar>
      </span>
      <div className={styles.memberInfo}>
        <h4 className={styles.nameAndPosition}>{name}</h4>
        <FollowBtn
          followed={followed}
          groupId={groupId}
          name={name}
          type="group"
        />
      </div>
    </div>
  );
}
Group.defaultProps = {
  avatarUrl: '',
  indexSymbol: '#',
  itemHeight: 50,
  avatarSize: 30,
};
Group.propTypes = {
  avatarUrl: PropTypes.string,
  indexSymbol: PropTypes.string,
  avatarSize: PropTypes.number,
  itemHeight: PropTypes.number,
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Group;
