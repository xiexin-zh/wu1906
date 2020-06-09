import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import { Modal, Input, Avatar, message, Popover, Button, Switch } from 'antd';
import styles from './index.scss';
import {
  getGroupAdmin,
  setGroupAdmin,
} from '../../../../../models/groupInfo/actions';
import RemoveMember from '../RemoveMember';
import Rename from '../Rename';
import UploadImg from '../UploadImg';
import { getCurrentUserId } from '../../../../../models/session/selectors';
import { getGroupDetail } from '../../../../../models/groupInfo/selectors';

const isRenderImg = (flag) => {
  return flag ? (
    ''
  ) : (
    <img
      style={{ width: '16px', height: '13px' }}
      src={require('assets/images/icn-tick-select-blue.svg')}
      alt=""
    />
  );
};

class GroupOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminModalShow: false,
      groupMember: [],
      groupId: '',
      isShow: false,
      isEditAdmin: false,
      confirmLoading: false,
      isPublic: props.groupDetails.isPublic,
    };
  }
  componentDidMount() {
    const { groupDetails, dispatch } = this.props;
    this.setState({
      setValue: groupDetails.name,
    });
    const { groupId } = this.props;
    dispatch(
      getGroupAdmin({
        groupId,
      })
    );
  }

  addMember = () => {
    const { openInviteMember } = this.props;
    openInviteMember();
  };

  // addMember = () => {
  //   const { openInviteMember } = this.props;
  //   openInviteMember();
  // };
  openRemove = () => {
    this.setState({
      isShow: true,
    });
  };
  onCancelRemove = () => {
    this.setState({
      isShow: false,
    });
  };

  showSetAdmin = () => {
    // const { groupId, dispatch } = this.props;
    this.setState({
      adminModalShow: true,
    });
    let value = '';
    this.searchMember(value);
    // this.props.dispatch(
    //   getGroupAdmin({
    //     groupId,
    //   })
    // );
  };

  hiddenAdminModal = () => {
    const { groupUsers } = this.props;
    this.setState({
      adminModalShow: false,
      groupMember: groupUsers,
    });
  };

  //設置群組管理員
  setAdministar = async (adminUserId) => {
    const { groupId } = this.props;
    let res = await this.props.dispatch(
      setGroupAdmin({
        groupId,
        adminUserId,
        editGroup: true,
        post: true,
      })
    );
    if (res.code === '200') {
      message.success('設置成功');
      this.props
        .dispatch(
          getGroupAdmin({
            groupId,
          })
        )
        .then((res) => {
          let value = '';
          this.searchMember(value);
        });
      // this.props.dispatch(
      //   getGroupMembers({
      //     groupId,
      //   })
      // )
    }
  };
  //移除群組管理員
  removeAdministar = async (adminUserId) => {
    const { groupId } = this.props;
    let res = await this.props.dispatch({
      type: 'groupInfo/removeGroupAdmin',
      payload: {
        groupId,
        adminUserId,
      },
    });
    if (res.code === '200') {
      message.success('移除成功');
      this.props
        .dispatch(
          getGroupAdmin({
            groupId,
          })
        )
        .then((res) => {
          let value = '';
          this.searchMember(value);
        });
      // this.props.dispatch(
      //   getGroupMembers({
      //     groupId,
      //   })
      // );
    } else {
      message.error('移除失敗');
    }
  };

  cancelModal = () => {
    this.props.cancelModal();
  };

  //判斷當前用戶在群組裡是否是管理員
  // getCurrentUserIsAdmin = () => {
  //   const { groupAdminList, currentUserId } = this.props;
  //   const currentData = groupAdminList.filter((item) => {
  //     return item.userId.indexOf(currentUserId) !== -1;
  //   });
  //   return Boolean(currentData);
  // };

  //去除群组成员列表中的管理员
  getGroupUserNoAdmin = (groupAdminList, groupUsers) => {
    const admins = groupAdminList
      ? groupAdminList.reduce(
          (idSet, item) => idSet.add(item.userId),
          new Set()
        )
      : new Set();
    const groupUsersNoAdmin = groupUsers
      ? groupUsers.filter((item) => !admins.has(item.userId))
      : new Set();

    return groupUsersNoAdmin;
  };

  randerSetAdminOptions = (item, isSuperAdmin) => {
    // const isAdmin = this.getCurrentUserIsAdmin();
    return (
      <div className={styles.setAdminOptions}>
        <div className={styles.optionNameTitle}>
          {item.givenName || item.displayName}
        </div>
        <div className={styles.setOptions}>
          <div className={styles.optionTitle}>群組設置</div>
          <div className={styles.optionSwitch}>
            <Switch
              size="small"
              defaultChecked={item.isEditGroup}
              onChange={() => this.changeEditGroup(item)}
              disabled={!isSuperAdmin}
            />
          </div>
        </div>
        <div className={styles.setOptions}>
          <div className={styles.optionTitle}>管理管理員</div>
          <div className={styles.optionSwitch}>
            <Switch
              size="small"
              defaultChecked={item.isEditAdmin}
              onChange={() => this.changeEditAdmin(item)}
              disabled={true}
            />
          </div>
        </div>
        <div className={styles.setOptions}>
          <div className={styles.optionTitle}>發帖</div>
          <div className={styles.optionSwitch}>
            <Switch
              size="small"
              defaultChecked={item.isCanPost}
              onChange={() => this.changeCanPost(item)}
              disabled={!isSuperAdmin}
            />
          </div>
        </div>
        <div
          className={isSuperAdmin ? styles.removeOption : styles.noRemoveOption}
          onClick={
            isSuperAdmin ? () => this.removeAdministar(item.userId) : null
          }
        >
          移除此管理員
        </div>
      </div>
    );
  };

  changeEditGroup = (item) => {
    let CanPost = item.isCanPost;
    let editGroup = !item.isEditGroup;
    this.setPermissions({ item, CanPost, editGroup });
  };

  changeEditAdmin = (item) => {
    message.destroy();
    message.warning('暫不支持');
    return;
  };

  changeCanPost = (item) => {
    let CanPost = !item.isCanPost;
    let editGroup = item.isEditGroup;
    this.setPermissions({ item, CanPost, editGroup });
  };
  //設置許可權
  setPermissions = async ({ item, CanPost, editGroup }) => {
    const { groupId } = this.props;
    const { userId } = item;
    let res = await this.props.dispatch(
      setGroupAdmin({
        groupId,
        adminUserId: userId,
        editGroup,
        post: CanPost,
      })
    );
    if (res.code === '200') {
      message.success('設置成功');
    } else {
      message.error('設置失敗');
    }
    this.props.dispatch(
      getGroupAdmin({
        groupId,
      })
    );
  };

  //搜索成員
  searchMember = (value) => {
    const { groupUsers, groupAdminList } = this.props;
    let groupNoAdminList = this.getGroupUserNoAdmin(groupAdminList, groupUsers);
    if (value) {
      let newValue = value.target.value.toUpperCase();
      let newGroupUserList = groupNoAdminList.filter((item, index, arr) => {
        const itemName =
          item.givenName || item.displayName || item.fullName || '';
        return itemName.toUpperCase().indexOf(newValue) !== -1;
      });
      this.setState({
        groupMember: newGroupUserList,
      });
    } else {
      this.setState({
        groupMember: groupNoAdminList,
      });
    }
  };

  cancelModal = () => {
    const { cancelModal } = this.props;
    cancelModal();
  };
  // 確定群組編輯資訊
  editGroup = async () => {
    let {
      dispatch,
      avatarUrl,
      groupId,
      cancelModal,
      groupDetails: { memberAvatarUrls },
    } = this.props;
    const groupName = this.refs.Rename.state.setValue;
    if (groupName.length > 50) {
      message.error('群組名稱不得大於50字');
      return false;
    }
    const newGroupName = groupName.trim();
    if (!newGroupName) {
      message.error('请输入群组名称群組名稱');
      return false;
    }
    dispatch({
      type: 'groupOption/setConfirmLoading',
      payload: true,
    });
    if (avatarUrl) {
      await dispatch({
        type: 'groupOption/editGroup',
        payload: {
          groupId,
          groupName: newGroupName,
          avatarUrl,
          isPublic: this.state.isPublic ? 1 : 0,
          memberAvatarUrls,
        },
      });
    } else {
      await dispatch({
        type: 'groupOption/editGroup',
        payload: {
          groupId,
          groupName: newGroupName,
          isPublic: this.state.isPublic ? 1 : 0,
          memberAvatarUrls,
        },
      });
    }
    if (!this.state.isPublic) {
      dispatch({
        type: 'groupInfo/clearFan',
      });
    }

    dispatch({
      type: 'groupOption/setConfirmLoading',
      payload: false,
    });
    cancelModal();
  };
  // 設置群組為公開
  setPublic = () => {
    this.setState({
      isPublic: true,
    });
  };
  // 設置群組位私密
  setPrivate = () => {
    this.setState({
      isPublic: false,
    });
  };

  //判断当前用户是否是当前群组超级管理员
  getSuperAdmin = () => {
    const { groupAdminList, currentUserId } = this.props;
    if (!!groupAdminList && groupAdminList.length > 0) {
      return groupAdminList.some((item) => {
        return item.userId === currentUserId && item.isEditAdmin === true;
      });
    }
    return false;
  };

  render() {
    const {
      // groupUserList,
      groupDetails,
      setGroup,
      all,
      confirmLoading,
      groupAdminList,
    } = this.props;
    const {
      adminModalShow,
      isShow,
      groupMember,
      isPublic,
      // isEditAdmin,
    } = this.state;
    const isSuperAdmin = this.getSuperAdmin();
    return (
      <Fragment>
        <Modal
          className={styles.groupSet}
          title="群組設置"
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          confirmLoading={confirmLoading}
          onCancel={this.cancelModal}
          okText="完成"
          cancelText="返回"
          onOk={this.editGroup}
          visible={setGroup}
          destroyOnClose={true}
          afterClose={() => {
            this.setState({
              isPublic: groupDetails.isPublic,
            });
          }}
        >
          <div className={styles.groupSetBox}>
            {/* 修改群名 */}
            <Rename ref="Rename" groupDetails={groupDetails}></Rename>
            {/* 修改圖像 */}
            <div className={styles.uploadGroupImg}>
              <UploadImg groupDetails={groupDetails} all={all}></UploadImg>
            </div>
            <div className={styles.groupMemberSet}>
              <div className={styles.memberSetTitle}>成員設置</div>
              <div className={styles.adminSelect} onClick={this.addMember}>
                <div
                  className={`${styles.invitateAvatar} ${styles.invitateMember}`}
                ></div>
                <div className={styles.setContent}>
                  <p className={styles.title1}>邀請成員</p>
                </div>
              </div>
              <div className={styles.adminSelect} onClick={this.openRemove}>
                <div
                  className={`${styles.invitateAvatar} ${styles.removeMember}`}
                ></div>
                <div className={styles.setContent}>
                  <p className={styles.title1}>移除成員</p>
                </div>
              </div>
            </div>
            <div className={styles.memberSetTitle}>設定管理員</div>
            <div className={styles.adminSelect} onClick={this.showSetAdmin}>
              <div
                className={`${styles.invitateAvatar} ${styles.setMember}`}
              ></div>
              <div className={styles.setContent}>
                <p className={styles.title1}>設定管理員</p>
              </div>
            </div>
            {/* 隐私设定 */}
            <div className={styles.privateAndPublic}>
              <div className={styles.title}>隱私設定</div>
              <div>
                <div
                  style={{
                    backgroundColor: isPublic ? 'rgb(218, 226, 237)' : '',
                  }}
                  className={styles.content}
                  onClick={this.setPublic}
                >
                  <div>
                    <img
                      src={require('assets/images/newsfeed_privacy_public@2x.png')}
                      alt=""
                    />
                    <span>公開</span>
                  </div>
                  {isRenderImg(!isPublic)}
                </div>
                <div
                  style={{
                    backgroundColor: !isPublic ? 'rgb(218, 226, 237)' : '',
                  }}
                  className={styles.content}
                  onClick={this.setPrivate}
                >
                  <div>
                    <img
                      src={require('assets/images/newsfeed_privacy_private@2x.png')}
                      alt=""
                    />
                    <span>秘密</span>
                  </div>
                  {isRenderImg(isPublic)}
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* 移除群員 */}
        <RemoveMember
          groupDetails={groupDetails}
          isshow={isShow}
          onCancelRemove={this.onCancelRemove}
        ></RemoveMember>

        {/* 设置管理员 */}
        <Modal
          title="設置群組管理員"
          className={styles.adminMadal}
          visible={adminModalShow}
          onCancel={this.hiddenAdminModal}
          destroyOnClose={true}
          footer={null}
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className={styles.setAdminBox}>
            <div>
              <p style={{ fontWeight: 900, padding: '5px' }}>群組管理員</p>
              <div className={styles.memberBox}>
                {!!groupAdminList &&
                  groupAdminList.map((item) => {
                    const groupName =
                      item.givenName || item.displayName || item.fullName || '';
                    return (
                      <div key={item.userId} className={styles.memberList}>
                        <div className={styles.memberAvatar}>
                          <div className={styles.avatar}>
                            <Avatar size={30} src={item.avatarUrl}>
                              {item.indexSymbol}
                            </Avatar>
                          </div>
                        </div>
                        <div className={styles.memberName}>{groupName}</div>
                        <div className={styles.setButton}>
                          {/* <div
                            onClick={() => this.removeAdministar(item.userId)}
                            className={styles.setABtn}
                          >
                            設置管理員
                          </div> */}
                          <Popover
                            placement="topLeft"
                            content={this.randerSetAdminOptions(
                              item,
                              isSuperAdmin
                            )}
                            trigger="click"
                          >
                            <Button>設置管理員</Button>
                          </Popover>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div>
              <div>
                <div style={{ fontWeight: 900, padding: '5px' }}>成員列表</div>
                {/* <Search
                  style={{ width: '100%' }}
                  placeholder="請輸入搜索內容"
                  onSearch={this.searchMember}
                /> */}
                <div
                  style={{
                    width: '100%',
                    padding: '0 10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder="請輸入搜索內容"
                    onChange={this.searchMember}
                  />
                </div>
                <div className={styles.memberBox}>
                  {!!groupMember &&
                    groupMember.length > 0 &&
                    groupMember.map((item) => {
                      return (
                        <div key={item.userId} className={styles.memberList}>
                          <div className={styles.memberAvatar}>
                            <div className={styles.avatar}>
                              <Avatar size={30} src={item.avatarUrl}>
                                {item.indexSymbol}
                              </Avatar>
                            </div>
                          </div>
                          <div className={styles.memberName}>
                            {item.givenName ||
                              item.displayName ||
                              item.fullName ||
                              ''}
                          </div>
                          <div className={styles.setButton}>
                            <div
                              onClick={() => this.setAdministar(item.userId)}
                              className={styles.setABtn}
                            >
                              新增為管理員
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state, { groupId }) {
  // let groupMember = state.groupInfo.get('groupMember').toJS();
  let groupAdmin = state.groupInfo.get('groupAdmin').toJS();

  let groupDetails = getGroupDetail(state, groupId);
  let groupAdminList = groupAdmin[groupId];
  let groupUsers = state.groupInfo.get('groupUsers').toJS()[groupId];

  return {
    state,
    // groupMember,
    groupAdminList,
    groupDetails,
    groupUsers,
    currentUserId: getCurrentUserId(state),
    avatarUrl: state.groupOption.get('avatarUrl'),
    confirmLoading: state.groupOption.get('confirmLoading'),
  };
}

export default connect(mapStateToProps)(GroupOption);
