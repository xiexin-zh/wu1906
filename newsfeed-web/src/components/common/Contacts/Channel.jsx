import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';

import styles from './index.css';
import { Avatar } from 'antd';
function Channel(props) {
  const {
    avatarUrl,
    name,
    indexSymbol,
    itemHeight,
    avatarSize,
    // channelId,
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
      </div>
    </div>
  );
}
Channel.defaultProps = {
  avatarUrl: '',
  indexSymbol: '#',
  itemHeight: 50,
  avatarSize: 30,
};
Channel.propTypes = {
  avatarUrl: PropTypes.string,
  indexSymbol: PropTypes.string,
  avatarSize: PropTypes.number,
  itemHeight: PropTypes.number,
  name: PropTypes.string.isRequired,
  channelId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Channel;
