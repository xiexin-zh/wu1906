import React, { PureComponent } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import get from 'lodash/get';
import AddressBook from 'components/common/Address';
import LoadingIcon from 'components/common/LoadingIcon';
import { Modal, message, Tabs, Icon } from 'antd';
import Channel from '../../Contacts/Channel';
const { TabPane } = Tabs;

class ShareIm extends PureComponent {
  constructor() {
    super();
    this.state = {
      // addressBook: {},
      searchValue: '',
      searchGroupValue: '',
      canShare: true,
    };
  }

  handleCancel = () => {
    this.props.handleShareFalse();
  };

  changePane = (key) => {
    console.log(key);
  };

  sendMessage = (memberItem) => {
    const { canShare } = this.state;
    if (!canShare) {
      return false;
    }
    const { vchannel_id } = memberItem;
    const {
      userId,
      postId,
      targetType,
      dispatch,
      seccessCallback,
    } = this.props;
    let vchannelIds = [vchannel_id];
    let shareData = {
      userId,
      postId,
      type: targetType === 'post' ? 0 : 1,
      vchannelIds,
    };
    this.setState({
      canShare: false,
    });
    dispatch({
      type: 'share/sendShareToIm',
      payload: {
        ...shareData,
      },
    }).then((result) => {
      if (result) {
        if (seccessCallback) {
          seccessCallback();
        }
        message.success('分享成功');
      } else {
        message.error('分享失敗');
      }
      this.setState({
        canShare: false,
      });
      this.handleCancel();
    });
  };

  //对话记录排序
  channelSort = () => {
    let { vchannels, vchannel_map } = this.props;
    vchannels.sort((current, next) => {
      const current_dialog = vchannel_map[current.vchannel_id];
      const next_dialog = vchannel_map[next.vchannel_id];
      if (!current_dialog || !next_dialog) {
        return false;
      }
      const { latest_ts: next_latest_ts, draft_ts: next_draft_ts = 0 } = get(
        next_dialog,
        'sync_dialog',
        {}
      );
      const { latest_ts, draft_ts = 0 } = get(
        current_dialog,
        'sync_dialog',
        {}
      );
      const next_sort_ts = Math.max(next_latest_ts, next_draft_ts);
      const sort_ts = Math.max(latest_ts, draft_ts);
      return next_latest_ts === 0 || next_sort_ts - sort_ts;
    });
    let vchannel_info = vchannels.map((vchannel, index) => {
      return { ...vchannel_map[vchannel.vchannel_id] };
    });
    return vchannel_info;
  };

  //最近紀錄搜索
  searchMessage = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };
  //群組搜索
  searchGroup = (e) => {
    this.setState({
      searchGroupValue: e.target.value,
    });
  };
  //遍歷搜索結果
  getList = () => {
    const { searchValue } = this.state;
    const memberMap = this.channelSort();
    const newMemberList = [...memberMap].filter((item) => {
      const { vchannel_detail } = item;
      const { data } = vchannel_detail;
      return data.name.toUpperCase().includes(searchValue.toUpperCase());
    });
    return newMemberList;
  };
  getGroupList = () => {
    const { searchGroupValue } = this.state;
    const { channelMap } = this.props;
    const newGroupList = [...channelMap.values()].filter((item) => {
      return item.name.toUpperCase().includes(searchGroupValue.toUpperCase());
    });
    return newGroupList;
  };

  //TabPane 图标
  renderTabPane(icon) {
    return <div className={`${styles.tabIcon} ${styles[icon]}`}></div>;
  }

  render() {
    const { shareVisible } = this.props;
    const memberList = this.getList();
    const groupList = this.getGroupList();

    return (
      <div className={styles.shareModal}>
        <Modal
          className={styles.shareToSpBox}
          title="分享動態"
          visible={shareVisible}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          footer={null}
        >
          <div className={styles.shareIm}>
            <Tabs
              defaultActiveKey="1"
              onChange={this.changePane}
              tabBarStyle={{
                backgroundColor: '#ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                width: '100%',
              }}
            >
              <TabPane tab={this.renderTabPane('timeIcon')} key="dialogue">
                <div className={styles.groupSearch}>
                  <div className={styles.searchIcon}>
                    <Icon type="search" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索"
                    onChange={this.searchMessage}
                  ></input>
                </div>
                <div className={styles.groupBox}>
                  <div className={styles.shareGroup}>
                    {/* {memberList.size === 0 && (
                      <div className={styles.loadingBox}>
                        <LoadingIcon />
                      </div>
                    )} */}
                    {memberList &&
                      memberList.map((channel) => {
                        const { vchannel_detail } = channel;
                        const {
                          avatar_url: avatarUrl,
                          name,
                          index_symbol: indexSymbol,
                          itemHeight,
                          avatarSize,
                          groupId,
                          followed,
                          vchannel_id: vchannelId,
                        } = vchannel_detail.data;
                        return (
                          <Channel
                            key={vchannelId}
                            avatarUrl={avatarUrl}
                            name={name}
                            indexSymbol={indexSymbol}
                            itemHeight={itemHeight}
                            avatarSize={avatarSize}
                            groupId={groupId}
                            followed={followed}
                            onClick={() =>
                              this.sendMessage({
                                vchannel_id: vchannelId,
                                shareType: 'im',
                              })
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              </TabPane>
              <TabPane tab={this.renderTabPane('groupIcon')} key="group">
                <div className={styles.groupSearch}>
                  <div className={styles.searchIcon}>
                    <Icon type="search" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索"
                    onChange={this.searchGroup}
                  ></input>
                </div>
                <div className={styles.groupBox}>
                  <div className={styles.shareGroup}>
                    {groupList.size === 0 && (
                      <div className={styles.loadingBox}>
                        <LoadingIcon />
                      </div>
                    )}
                    {[...groupList.values()].map((channel) => {
                      const {
                        avatarUrl,
                        name,
                        indexSymbol,
                        itemHeight,
                        avatarSize,
                        groupId,
                        followed,
                        vchannelId,
                      } = channel;
                      return (
                        <Channel
                          key={vchannelId}
                          avatarUrl={avatarUrl}
                          name={name}
                          indexSymbol={indexSymbol}
                          itemHeight={itemHeight}
                          avatarSize={avatarSize}
                          groupId={groupId}
                          followed={followed}
                          onClick={() =>
                            this.sendMessage({
                              vchannel_id: vchannelId,
                              shareType: 'im',
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </TabPane>
              <TabPane tab={this.renderTabPane('memberIcon')} key="addressBook">
                <div className={styles.shareImAddress}>
                  <AddressBook sendMessage={this.sendMessage}></AddressBook>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // let addressBook = state.members.get('memberMap').toJS();
  return {
    // addressBook,
    channelMap: state.IMChannels.get('channelMap'),
    vchannels: state.IMChannels.get('vchannels'),
    vchannel_map: state.IMChannels.get('vchannel_map'),
  };
}

export default connect(mapStateToProps)(ShareIm);
