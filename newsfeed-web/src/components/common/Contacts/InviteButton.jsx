import React from 'react';
import { connect } from 'dva';
// import { Modal, Button } from 'antd';
import classnames from 'classnames';
import styles from './index.css';
import { Modal } from 'antd';

import { inviteUsers } from '../../../models/groupInfo/actions';
const { confirm } = Modal;
function InviteButton(props) {
  const { onClick, inviting } = props;
  const btnClassName = classnames({
    [styles.button]: true,
    [styles.followed]: inviting,
  });
  return (
    <button
      className={`${btnClassName} ${inviting ? '' : 'cursor-pointer'}`}
      onClick={onClick}
    >
      {inviting ? '邀請中' : '邀請'}
    </button>
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  const { inviting, userId, groupId, name } = ownProps;

  return {
    onClick: (e) => {
      e.stopPropagation();
      if (inviting) {
        confirm({
          okText: '取消邀请',
          title: '取消邀请',
          content: `取消邀请${name}加入群组吗?`,
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'groupInfo/cancel_inactive_users',
              payload: {
                cancelUserIds: [userId],
                groupId,
              },
            });
          },
        });
        return;
      }
      dispatch(inviteUsers(groupId, [userId]));
    },
  };
}

export default connect(
  null,
  mapDispatchToProps
)(InviteButton);
