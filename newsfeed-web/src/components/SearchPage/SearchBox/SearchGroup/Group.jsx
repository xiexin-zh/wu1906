import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Avatar } from 'antd';
import styles from './SearchGroup.scss';
import {
  getAdminGroupList,
  getMemberGroupList,
  getFollowGroupList,
} from '../../../../models/groupInfo/selectors';
import GroupButton from '../../../GroupDetails/GroupInfo/GroupButton';
// import { connect } from 'dva';
// import styles from './Group.css';

function GroupItem(props) {
  const { group, isPublic, isMemberOrFans, onClick, updateData } = props;
  const { indexSymbol, avatarUrl, groupId, name, groupMemberCount } = group;
  return (
    <div onClick={() => onClick(groupId)} className={styles.group}>
      <Avatar size={60} src={avatarUrl}>
        {indexSymbol}
      </Avatar>
      <div className={styles.detail}>
        <p className={styles.groupName}>{name}</p>
        <p>
          {isPublic ? '公開群組' : '非公開群組'}
          {` | ${groupMemberCount}位成員`}
        </p>
      </div>
      <GroupButton
        className={`${styles.btn} ${
          isMemberOrFans.has(groupId) ? styles.followed : ''
        }`}
        group={group}
        disableInvite={true}
        openInviteMember={false}
        updateData={updateData}
        searchGroup={true}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const adminGroupList = getAdminGroupList(state);
  const memberGroupList = getMemberGroupList(state);
  const followGroupList = getFollowGroupList(state);
  return {
    isMemberOrFans: adminGroupList
      .merge(memberGroupList)
      .merge(followGroupList),
  };
}

export default connect(mapStateToProps)(GroupItem);
