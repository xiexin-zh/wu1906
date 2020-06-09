import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Input } from 'antd';
import styles from './FansFollow.scss';
import AddressBook from '../Address/AddressBook';
import Group from '../Contacts/Group';
import { withRouter } from 'dva/router';
// import Member from '../Contacts/Member';
import {
  getFansListFromStore,
  getFollowListFromStore,
  getFollowGroupFromStore,
} from '../../../models/users/selectors';
import { getFansAndFollow } from '../../../models/users/actions';
// import { isShow } from '../Address/utils';
import ExploreGroup from '../ExploreGroup';
const { TabPane } = Tabs;

const tabBarStyle = {
  height: '50px',
};
// 获取筛选追踪的群组
function getGroupList({ groupMap, followGroupList, searchValue }) {
  let newlist = [
    ...groupMap.filter((group) => followGroupList.has(group.groupId)).values(),
  ];
  if (searchValue) {
    searchValue = searchValue.toLowerCase();

    newlist = newlist.filter((item) => {
      if (Object.prototype.toString.call(item.name) !== '[object String]') {
        return false;
      }
      return item.name.toLowerCase().indexOf(searchValue) !== -1;
    });
  }
  return newlist;
}

function FansFollow(props) {
  const {
    defaultActive,
    userId,
    visible,
    getFansAndFollowData,
    fansList,
    followUserList,
    ownFollowUserList,
    groupMap,
    followGroupList,
    openUserDetail,
    openGroupDetail,
    // createExplorationGroupFun,
    closeMoadle,
  } = props;
  // 改变追踪中搜索值
  let [searchValue, setsearchValue] = useState('');
  // 点击改变相应的key切换tabs
  let [activeKey, setActiveKey] = useState(defaultActive);
  // 粉丝的搜索和改变搜索值
  let [fanValue, setfanValue] = useState('');
  // let [fansCount, setFansCount] = useState(0);
  let [followNum, setfollowNum] = useState(0);
  let [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    getFansAndFollowData(userId);
    setActiveKey(defaultActive);
    //   getFollowUserList()
  }, [userId, defaultActive]);
  // 改变追踪中搜索值
  function changeGroypValue(e) {
    setsearchValue(e.target.value);
  }
  // 改变粉丝搜索值
  function changeUserSearch(e) {
    setfanValue(e.target.value);
  }

  function followMore() {
    setIsOpen(true);
    // createExplorationGroupFun('Group.ExploreGroup');
  }
  function onCancel() {
    closeMoadle();
  }

  function onChangeTabs(value) {
    setActiveKey(value);
  }
  function cancelExploreGroup() {
    setIsOpen(false);
  }

  function afterClose() {
    setsearchValue('');
    setfanValue('');
  }

  const groupList = getGroupList({ groupMap, followGroupList, searchValue });

  const count = groupList.length + followNum;
  return (
    <Modal
      className={styles.createpost}
      title="粉絲 /追蹤中 人數"
      visible={visible}
      maskStyle={{
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
      footer={null}
      destroyOnClose={true}
      confirmLoading={false}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      <div className={styles.wrapper}>
        <Tabs
          type="card"
          tabBarStyle={tabBarStyle}
          activeKey={activeKey}
          onChange={onChangeTabs}
        >
          <TabPane tab={`${fansList.size} 位粉絲`} key="fans">
            <Input
              placeholder="搜索被追蹤的用戶"
              onChange={changeUserSearch}
            ></Input>
            <div className={styles.scrollBox}>
              <AddressBook
                showList={fansList}
                followUserMap={ownFollowUserList}
                onClick={openUserDetail}
                searchValue={fanValue}
                renderHeader={(count) => {
                  // setFansCount(count);
                  return (
                    <p className={styles.resultCount}>合共{count}條結果</p>
                  );
                }}
              />
            </div>
          </TabPane>
          <TabPane
            tab={`${followUserList.size + followGroupList.size} 位追蹤中`}
            key="follow"
          >
            {/* 群組和用戶搜索等功能 */}
            <div className={styles.groupAndUser}>
              <Input
                placeholder="搜索追蹤中的用戶和組群"
                // onPressEnter={changeGroypValue}
                onChange={changeGroypValue}
              ></Input>
              <div className={styles.resultCount}>合共{count}條結果</div>
              <div>
                {!Object.is(groupList, 0) && (
                  <h2 className={styles.title}>
                    {`${groupList.length}個群組追蹤中`}
                  </h2>
                )}
                {/* 遍歷群組 */}
                <div className={styles.groupWrapper}>
                  {groupList.map((group) => {
                    const {
                      avatarUrl,
                      name,
                      indexSymbol,
                      itemHeight,
                      avatarSize,
                      groupId,
                      isGroupFans,
                    } = group;
                    return (
                      <Group
                        key={groupId}
                        avatarUrl={avatarUrl}
                        name={name}
                        indexSymbol={indexSymbol}
                        itemHeight={itemHeight}
                        avatarSize={avatarSize}
                        groupId={groupId}
                        followed={isGroupFans}
                        onClick={() => openGroupDetail(groupId)}
                      />
                    );
                  })}
                </div>
              </div>
              {/* 追踪的人 */}
              {!Object.is(followNum, 0) && (
                <h2 className={styles.title}>
                  {`${followNum}人追蹤中`}
                  {/* {`${followUserList.size}人追蹤中`} */}
                </h2>
              )}
              <AddressBook
                showList={followUserList}
                followUserMap={ownFollowUserList}
                searchValue={searchValue}
                onClick={openUserDetail}
                disableTip
                renderHeader={(count) => {
                  return setfollowNum(count);
                }}
              />
              <div className={styles.followMore} onClick={followMore}>
                追蹤更多
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <ExploreGroup isOpen={isOpen} onCancel={cancelExploreGroup} />
    </Modal>
  );
}

function mapStateToProps(state, ownprops) {
  const { userId } = ownprops;
  return {
    // memberMap: state.members.get('memberMap'),
    fansList: getFansListFromStore(state, userId),
    ownFollowUserList: state.users.get('ownFollowUserList'),
    followUserList: getFollowListFromStore(state, userId),
    followGroupList: getFollowGroupFromStore(state, userId),
    groupMap: state.groupInfo.get('groupMap'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { history, closeMoadle } = ownProps;
  return {
    getFansAndFollowData: (userId) => dispatch(getFansAndFollow(userId)),
    openUserDetail: (userId) => {
      history.push(`/user/${userId}`);
      closeMoadle();
    },
    openGroupDetail: (groupId) => {
      history.push(`/groups/${groupId}`);
      closeMoadle();
    },
    // createExplorationGroupFun: (title) => {
    //   dispatch({
    //     type: 'updatePersonalGroupInfo/showExploreCreateGroupActive',
    //     payload: title,
    //   });
    // },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FansFollow)
);
