import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';
import { message, Modal } from 'antd';
import styles from './index.scss';
import { leaveGroup } from '../../../models/groupInfo/actions';
import FormattedText from '../../common/FormattedText';
import { injectIntl } from 'react-intl';
import GroupOperate from './GroupOperate';
import FollowBtn from '../../common/Contacts/FollowBtn';

const { confirm } = Modal;

class GroupButton extends React.PureComponent {
  addMembers = (e) => {
    e.stopPropagation();
    const { openInviteMember } = this.props;
    openInviteMember();
  };

  // 判断群组权限
  isGroupAdmin = () => {
    const { group } = this.props;
    return group.isGroupAdmin;
  };
  leaveGroup = (e) => {
    e.stopPropagation();
    const _this = this;
    const {
      group,
      leaveGroup,
      intl,
      delGroup,
      updateData,
      // delGroupMember,
    } = this.props;
    const { isPreset, name, groupId, groupMemberCount } = group;
    const lastMemberConfirmText = intl.formatMessage({ id: 'Group.content' });
    const normalConfirmText = intl.formatMessage(
      { id: 'Group.exitGroupConfirm' },
      { name }
    );
    if (isPreset) {
      message.info(
        intl.formatMessage({
          id: 'Group.defaultGroupCannotExit',
          defaultMessage: '預設群組不能退出',
        })
      );
      return;
    }

    confirm({
      title: intl.formatMessage({
        id: 'Group.exitGroup',
        defaultMessage: '退出群組',
      }),
      // 判斷群組是否有成員來顯示退出提示
      content:
        groupMemberCount <= 1 ? lastMemberConfirmText : normalConfirmText,
      okText: intl.formatMessage({
        id: 'Group.definiteExit',
        defaultMessage: '確定退出',
      }),
      cancelText: intl.formatMessage({
        id: 'base.cancel',
        defaultMessage: '取消',
      }),
      onOk() {
        leaveGroup(groupId).then((res) => {
          console.log(_this.isGroupAdmin());
          if (res) {
            // 當群組只剩1個人的時候必然是管理員，所以就判斷成員有多少人就可以刪除群組了
            if (_this.isGroupAdmin() && groupMemberCount <= 1) {
              delGroup(groupId);
            }
            if (!!updateData) {
              updateData();
            }
            // delGroupMember()
          }
        });
      },
      onCancel() {},
    });
  };

  render() {
    const {
      group,
      className,
      disableInvite,
      isGroupDetails,
      searchGroup,
    } = this.props;
    const {
      // identity,
      // isPublic,
      permissionEditMember,
      isGroupFans,
      isGroupMember,
      groupId,
      name,
      getGroupDetails,
    } = group;

    if (!isGroupMember) {
      if (searchGroup) {
        return (
          <FollowBtn
            followed={isGroupFans}
            groupId={groupId}
            name={name}
            isGroupDetails={isGroupDetails}
            getGroupDetails={getGroupDetails}
            // buttonClassName={`${styles.btn} ${className}`}
            type="group"
          />
        );
      } else {
        return (
          <GroupOperate
            followed={isGroupFans}
            groupId={groupId}
            name={name}
            isGroupDetails={isGroupDetails}
            getGroupDetails={getGroupDetails}
            // buttonClassName={`${styles.btn} ${className}`}
            type="group"
          />
        );
      }
    }
    if (!disableInvite && permissionEditMember) {
      return (
        <button
          className={`${styles.btn} ${className}`}
          onClick={this.addMembers}
        >
          <FormattedText id="Group.invitation" defaultMessage="邀請" />
        </button>
      );
    }
    return (
      <button
        className={`${styles.btn} ${className}`}
        onClick={this.leaveGroup}
      >
        <FormattedText id="Group.leave" defaultMessage="退出" />
      </button>
    );
  }
}

GroupButton.propTypes = {
  group: PropTypes.shape({
    groupId: PropTypes.string,
    identity: PropTypes.number,
    isPublic: PropTypes.bool,
    isPreset: PropTypes.bool,
    permissionEditMember: PropTypes.bool,
    isGroupMember: PropTypes.bool,
    isFollowed: PropTypes.bool,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    leaveGroup: (groupId) => dispatch(leaveGroup(groupId)),
    delGroup: (groupId) =>
      dispatch({
        type: 'groupInfo/delGroup',
        payload: {
          groupId,
        },
      }),
    delGroupMember: (payload) => {
      return dispatch({
        type: 'groupInfo/delGroupMember',
        payload: {
          ...payload,
        },
      });
    },
  };
}

export default injectIntl(
  connect(
    null,
    mapDispatchToProps
  )(GroupButton)
);
