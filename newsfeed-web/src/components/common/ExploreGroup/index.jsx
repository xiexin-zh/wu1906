import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.scss';
import { Tabs, Input, Modal, Button } from 'antd';
import AddressBook from '../../common/Address';
import Immutable from 'immutable';
import AsideItem from '../LoadMore/components/AsideItem';
import { withRouter } from 'dva/router';
import {
  getFollowGroupList,
  getOtherGroupList,
} from '../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../utils/sort';
import propTypes from 'prop-types';

const { TabPane } = Tabs;
const initState = () => {
  return {
    searchValue: '',
    checkIndex: null,
    officeMap: null, //筛选地区的数量
    checkbox: Immutable.List(),
    showlist: [],
    openMoadl: false,
    searchType: 'user',
    searchGroupList: null,
    exploreNum: null,
    disabled: false,
  };
};

class ExploreGroup extends PureComponent {
  constructor(props) {
    super(props);

    this.state = initState();
    this.changeValue = this.changeValue.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.checked = this.checked.bind(this);
    this.changeStata = this.changeStata.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  changeValue(e) {
    if (this.state.searchType === 'user') {
      this.setState({
        searchValue: e.target.value,
      });
    } else {
      this.setState({
        searchGroupList: e.target.value,
      });
    }
  }
  getlist = () => {
    const { followGroupList, notFollowGroupList } = this.props;
    let list = followGroupList.merge(notFollowGroupList);
    if (this.state.searchGroupList) {
      const reg = new RegExp(this.state.searchGroupList, 'g');
      list = list.filter((item) => {
        return reg.test(item.name);
      });
    }
    return list;
  };
  showMoadl = () => {
    this.setState({
      openMoadl: true,
    });
  };
  onCancel() {
    this.setState({
      openMoadl: false,
    });
  }
  getFilterList() {
    if (this.state.officeMap) {
      let { memberMap } = this.props;
      let newlist = [];
      const list = [...this.state.officeMap]
        .filter((item, index) => {
          return this.state.checkbox.includes(index);
        })
        .map((item) => {
          return item[0];
        });
      list.unshift(this.state.region);
      memberMap = [...memberMap.values()];
      memberMap = memberMap.filter((member) => member.region === list[0]);
      if (list.length > 1) {
        list.forEach((item) => {
          newlist.push(...memberMap.filter((member) => member.office === item));
        });
        const newshowlist = newlist
          .map((item) => {
            return item.id;
          })
          .concat();
        this.setState({
          showlist: Immutable.Set(newshowlist),
        });
      } else {
        const newshowlist = memberMap
          .map((item) => {
            return item.id;
          })
          .concat();
        this.setState({
          showlist: Immutable.Set(newshowlist),
        });
      }
      this.setState({
        exploreNum: list.length,
      });
    } else {
      this.setState({
        exploreNum: null,
        showlist: [],
      });
    }
    this.onCancel();
  }

  checked(index, item) {
    const { regionMap } = this.props;
    const list = regionMap.getIn([item, 'officeMap']);
    if (this.state.checkIndex === index) {
      this.setState({
        checkIndex: null,
        officeMap: null,
        region: null,
        checkbox: Immutable.List(),
      });
    } else {
      this.setState({
        checkIndex: index,
        officeMap: list,
        region: item,
        checkbox: Immutable.List(),
      });
    }
  }
  changeStata(e) {
    let index = Number(e.target.getAttribute('data-index'));
    if (this.state.checkbox.includes(index)) {
      index = this.state.checkbox.indexOf(index);
      this.setState({
        checkbox: this.state.checkbox.splice(index, 1),
      });
    } else {
      this.setState({
        checkbox: this.state.checkbox.push(index),
      });
    }
  }

  itemClick = (item) => {
    const { openGroupDetail } = this.props;
    const { groupId } = item;
    if (groupId) {
      openGroupDetail(groupId);
    }
  };

  onTabClick = (e) => {
    if (e === 'group') {
      this.setState({
        disabled: true,
      });
    } else {
      this.setState({
        disabled: false,
      });
    }
    this.setState({
      searchType: e,
    });
  };

  allClean = () => {
    this.setState({
      ...initState(),
      openMoadl: true,
    });
  };
  render() {
    const { followedUsers, regionMap, isOpen, onCancel } = this.props;
    const { openMoadl, showlist, exploreNum, disabled, officeMap } = this.state;
    const searchGroupList = this.getlist();
    return (
      <Modal
        className={styles.ExploreGroupModal}
        visible={isOpen}
        title={'追踪更多'}
        footer={null}
        onCancel={onCancel}
        destroyOnClose={true}
      >
        <div className={styles.ExploreGroup}>
          <div className={styles.header}>
            <Button
              disabled={disabled}
              onClick={this.showMoadl}
              className={styles.explorebtn}
            >
              {!disabled ? (
                <img
                  src={require('assets/images/icn-filter-blue.png')}
                  alt=""
                />
              ) : (
                <img
                  src={require('assets/images/icn-filter-white.png')}
                  alt=""
                />
              )}

              {exploreNum > 0 ? (
                exploreNum
              ) : !disabled ? (
                <img
                  src={require('assets/images/icn-filter-menu-blue.png')}
                  alt=""
                />
              ) : (
                <img
                  src={require('assets/images/icn-filter-menu-white.png')}
                  alt=""
                />
              )}
              {/* {exploreNum} */}
            </Button>
            <div className={styles.search}>
              <img
                onClick={this.getSearchList}
                className={styles.icon}
                src={require('assets/images/icon/icons1.svg')}
                alt=""
              />
              <Input
                onPressEnter={this.changeValue}
                onChange={this.changeValue}
                allowClear
                placeholder="搜索"
                className={styles.value}
              />
            </div>
          </div>
          <Tabs onTabClick={this.onTabClick} type="card">
            <TabPane ref="allUser" tab="個人" key="user">
              {showlist && (
                <AddressBook
                  showList={showlist}
                  followUserMap={followedUsers}
                  searchValue={this.state.searchValue}
                />
              )}
            </TabPane>
            <TabPane tab="群組" key="group">
              <div>
                {[...searchGroupList.values()]
                  .sort(sortGroupByIndexSymbol)
                  .map((item) => {
                    const memberId = item.id;
                    return (
                      <AsideItem
                        onClick={() => this.itemClick(item)}
                        key={item.groupId}
                        item={item}
                        openDetail={this.openDetail}
                        followed={followedUsers && followedUsers.get(memberId)}
                      />
                    );
                  })}
              </div>
            </TabPane>
          </Tabs>
          <Modal
            visible={openMoadl}
            title={'篩選'}
            onOk={this.getFilterList}
            className={styles.searchreGionMap}
            onCancel={this.onCancel}
            okText="完成"
            cancelText="返回"
          >
            <div className={styles.searchlist}>
              {regionMap && (
                <div className={styles.region}>
                  <span>地區</span>
                  <button
                    disabled={!officeMap ? true : false}
                    onClick={this.allClean}
                  >
                    全部清除
                  </button>
                </div>
              )}
              <div className={styles.userList}>
                {regionMap &&
                  [...regionMap.keys()].map((item, index) => {
                    return (
                      <div
                        className={styles.userItem}
                        key={item}
                        onClick={() => this.checked(index, item)}
                      >
                        {item}
                        {index === this.state.checkIndex ? (
                          <img
                            className={styles.checkIcon}
                            src={require('./icon/gou.svg')}
                            alt=""
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  })}
              </div>
              {this.state.officeMap && (
                <span className={styles.region}>場館</span>
              )}
              <div className={styles.userList}>
                {this.state.officeMap &&
                  [...this.state.officeMap].map((officeItem, index) => {
                    return (
                      <div
                        className={styles.userItem}
                        data-index={index}
                        onClick={this.changeStata}
                        key={officeItem[0]}
                      >
                        {officeItem[0]}
                        {this.state.checkbox.includes(index) ? (
                          <img
                            className={styles.checkIcon}
                            src={require('./icon/gou.svg')}
                            alt=""
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </Modal>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    regionMap: state.members.get('regionMap'),
    memberMap: state.members.get('memberMap'),
    // loading: state.members.get('membersLoading'),
    followedUsers: state.users.get('ownFollowUserList'),
    followGroupList: getFollowGroupList(state),
    notFollowGroupList: getOtherGroupList(state),
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
ExploreGroup.propTypes = {
  isOpen: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ExploreGroup)
);
