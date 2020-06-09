import React from 'react';
import { Link } from 'dva/router';
import styles from './index.scss';
import { connect } from 'dva';
import { Avatar } from 'antd';
import { getUrl } from 'utils/utils';
// import { getOwnGroup } from '../../../models/groupInfo/selectors';
// import { sortGroupByIndexSymbol } from '../../../utils/sort';
import {
  getMemberGroupList,
  getAdminGroupList,
  getFollowGroupList,
} from '../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../utils/sort';
function openMoadle(dispatch) {
  dispatch({
    type: 'updatePersonalGroupInfo/showExploreCreateGroupActive',
    payload: 'Group.YouGroup',
  });
}
function Yourgroup({
  // ownGroup,
  dispatch,
  memberGroupList,
  adminGroupList,
  followGroupList,
}) {
  const yourGroupFollowGroupList = [
    ...memberGroupList.values(),
    ...adminGroupList.values(),
    ...followGroupList.values(),
  ];
  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>你的群組</span>
        {yourGroupFollowGroupList && (
          <div
            className={styles.headerTitle}
            onClick={() => openMoadle(dispatch)}
          >
            <span className={styles.showMore}>查看更多</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {yourGroupFollowGroupList &&
          // [...ownGroup.values()]
          //   .sort(sortGroupByIndexSymbol)
          yourGroupFollowGroupList
            .sort(sortGroupByIndexSymbol)
            .slice(0, 5)
            .map((item) => {
              return (
                <Link key={item.groupId} to={`/groups/${item.groupId}`}>
                  <Avatar
                    alt={item.indexSymbol}
                    size={126}
                    shape="square"
                    src={getUrl(item.avatarUrl)}
                  >
                    {item.avatarUrl ? '' : item.indexSymbol}
                  </Avatar>
                  <span className={styles.groupName}>{item.name}</span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    // ownGroup: getOwnGroup(state),
    yourGroupFollowGroupList: state.groupInfo.get('yourGroupFollowGroupList'),
    memberGroupList: getMemberGroupList(state),
    adminGroupList: getAdminGroupList(state),
    followGroupList: getFollowGroupList(state),
  };
}
export default connect(mapStateToProps)(Yourgroup);
