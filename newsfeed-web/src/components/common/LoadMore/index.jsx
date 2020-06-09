import React, { Component } from 'react';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.scss';
import AsideItem from './components/AsideItem';

import {
  getMemberGroupList,
  getAdminGroupList,
  getFollowGroupList,
  getOtherGroupList,
} from '../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../utils/sort';

const { TabPane } = Tabs;
class LoadMore extends Component {
  constructor(props) {
    super(props);
    this.itemClick = this.itemClick.bind(this);
  }

  // componentDidMount() {
  //   const { refreshYourGroupData } = this.props;
  //   // refreshYourGroupData();
  // }

  itemClick(item) {
    const { openGroupDetail } = this.props;
    const { groupId } = item;
    if (groupId) {
      openGroupDetail(groupId);
    }
  }
  render() {
    const {
      memberGroupList,
      adminGroupList,
      followGroupList,
      notFollowGroupList,
    } = this.props;

    return (
      <div className={styles.loadMore}>
        <Tabs type="card">
          <TabPane tab="成員" key="1">
            <div>
              {adminGroupList.size > 0 && (
                <div
                  className={styles.listTitle}
                >
                  群組管理員
                </div>
              )}
              {[...adminGroupList.values()]
                .sort(sortGroupByIndexSymbol)
                .map((item, index) => {
                  return (
                    <AsideItem
                      key={item.groupId}
                      onClick={() => this.itemClick(item)}
                      item={item}
                      openDetail={this.openDetail}
                    ></AsideItem>
                  );
                })}
            </div>
            <div>
              <div
                className={styles.listTitle}
              >
                群組成員
              </div>
              {[...memberGroupList.values()]
                .sort(sortGroupByIndexSymbol)
                .map((item, index) => {
                  // const memberId = item.id;
                  return (
                    <AsideItem
                      onClick={() => this.itemClick(item)}
                      key={item.groupId}
                      item={item}
                      openDetail={this.openDetail}
                      // followed={followedUsers && followedUsers.get(memberId)}
                    ></AsideItem>
                  );
                })}
            </div>
            {/* <ScollLoading /> */}
          </TabPane>
          <TabPane tab="追蹤中" key="2">
            {[...followGroupList.values()]
              .sort(sortGroupByIndexSymbol)
              .map((item, index) => {
                return (
                  <AsideItem
                    onClick={() => this.itemClick(item)}
                    key={item.groupId}
                    item={item}
                  ></AsideItem>
                );
              })}
          </TabPane>
          <TabPane tab="其他" key="3">
            {[...notFollowGroupList.values()]
              .sort(sortGroupByIndexSymbol)
              .map((item, index) => {
                return (
                  <AsideItem
                    onClick={() => this.itemClick(item)}
                    // key={index}
                    key={item.groupId}
                    item={item}
                  ></AsideItem>
                );
              })}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    memberGroupList: getMemberGroupList(state),
    adminGroupList: getAdminGroupList(state),
    followGroupList: getFollowGroupList(state),
    notFollowGroupList: getOtherGroupList(state),

    // followedUsers: state.users.get('ownFollowUserList'),
  };
}
function mapDispatchToProps(dispatch, ownProps) {
  const { history } = ownProps;
  return {
    openGroupDetail: (groupId) => {
      history.push(`/groups/${groupId}`);
      dispatch({
        type: 'updatePersonalGroupInfo/hideExploreCreateGroupActive',
      });
    },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoadMore)
);
