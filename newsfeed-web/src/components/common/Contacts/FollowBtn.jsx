import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from './index.css';
import {
  followGroup,
  // getGroupDetails,
} from '../../../models/groupInfo/actions';
import { followUser } from '../../../models/users/actions';
const { confirm } = Modal;
function FollowBtn(props) {
  const {
    changeFollow,
    followed,
    isGroupDetails,
    buttonClassName,
    name,
    groupId,
    dispatch,
    followAndJoin,
  } = props;
  const [followLock, setFollowLock] = useState(false);
  const btnClassName = classnames({
    [styles.button]: true,
    [styles.followed]: followed,
    [buttonClassName]: Boolean(buttonClassName),
    [styles.isGroupDetails]: isGroupDetails,
  });
  const onClick = (e) => {
    e.stopPropagation();

    if (followed) {
      confirm({
        title: '取消追蹤',
        content: `確認取消追蹤 ${name} 嗎？`,
        okText: '取消追蹤',
        cancelText: '取消',
        onOk() {
          setFollowLock(true);
          changeFollow().finally(() => {
            if (groupId) {
              dispatch({
                type: 'groupInfo/getGroupDetails',
                payload: { groupId },
              });
            }
            setFollowLock(false);
          });
        },
        onCancel() {
          console.info('Cancel');
        },
      });
      return;
    }
    setFollowLock(true);
    changeFollow().finally(() => {
      if (groupId) {
        dispatch({
          type: 'groupInfo/getGroupDetails',
          payload: { groupId },
        });
      }
      setFollowLock(false);
    });
  };
  return followAndJoin ? (
    <span onClick={followLock ? null : onClick}>
      {followed ? '追蹤中' : '追蹤'}
    </span>
  ) : (
    <button className={btnClassName} onClick={onClick} disabled={followLock}>
      {followed ? '追蹤中' : '追蹤'}
    </button>
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  const { followed, userId, groupId, type } = ownProps;
  return {
    dispatch,
    changeFollow: () => {
      if (type === 'group') {
        return dispatch(followGroup(groupId, !followed));
      } else {
        return dispatch(followUser(userId, !followed));
      }
    },
  };
}

FollowBtn.propTypes = {
  followed: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['group', 'user']).isRequired,
  buttonClassName: PropTypes.string,
  userId: PropTypes.string,
  groupId: PropTypes.string,
};

FollowBtn.defaultProps = {
  buttonClassName: '',
  userId: '',
  groupId: '',
};

export default connect(
  null,
  mapDispatchToProps
)(FollowBtn);
