import React, { PureComponent } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
// import isFunction from 'lodash/isFunction';
import {
  sharePost,
  // getAllPost,
  getConnectList,
} from '../../../../models/posts/actions';
// import get from 'lodash/get';
import { Modal, Button, Select, message } from 'antd';
import Mention from '../../Mention/Mention';
import { checkGroup } from '../../../../models/share/action';
const { Option } = Select;
// const { TextArea } = Input;

class ShareSp extends PureComponent {
  state = {
    shareValue: '',
    groupDest: 'myCenter',
    connectList: [],
    // mentionList: [],
    canShare: true,
  };

  //分享按鈕
  handleOk = () => {
    this.sharePost();
  };

  //分享
  sharePost = async () => {
    const { groupDest, canShare } = this.state;
    if (!canShare) {
      message.info('請不要連續點擊');
      return false;
    }
    const { handleShareFalse, postData, isInvitePage, urlname } = this.props;
    const { userId: postUser } = postData;
    let { shareValue } = this.state;
    let referId = '';
    if (postData.sharePost === null && postData.shareIsDelete === true) {
      message.info('原帖已刪除，無法進行分享');
      return;
    }
    if (postData.sharePost === null && postData.shareIsDelete === false) {
      referId = postData.postId;
    } else {
      referId = postData.sharePost.postId;
    }
    shareValue = shareValue.trim();
    if (shareValue.length > 2000) {
      message.info('分享內容限制在2000字以內');
      return;
    }
    let type = 0;
    let groupPostType = 1;

    let shareData = {
      type,
      isPublic: 1,
      groupId: groupDest,
      content: shareValue,
      groupPostType,
      referId: referId,
      openComment: true,
      isInvitePage: isInvitePage ? true : false,
      urlname,
    };

    if (groupDest === 'myCenter') {
      shareData.type = 1;
      shareData.groupPostType = null;
      delete shareData.groupId;
    }
    const { seccessCallback, dispatch } = this.props;
    //判断群组/用户是否关闭
    let checkData = {
      groupId: shareData.groupId,
      checkUserId: postUser,
    };
    if (!shareData.groupId) {
      delete checkData.groupId;
    }
    this.setState({
      canShare: false,
    });
    let isGroupClosed = await dispatch(checkGroup(checkData));
    if (isGroupClosed.code === '200') {
      const { isClosed, isDelete, inactive } = isGroupClosed.data;
      if (inactive) {
        message.info('該帖子用戶已註銷');
        this.setState({
          canShare: true,
        });
        return;
      } else if (isClosed || isDelete) {
        message.info('該群組已關閉或被刪除，請重新選擇');
        this.setState({
          canShare: true,
        });
        return;
      }
    } else {
      message.info('該群組不存在，請重新選擇');
      this.setState({
        canShare: true,
      });
      return;
    }
    this.setState({
      canShare: false,
    });
    let res = await dispatch(sharePost(shareData));
    if (res) {
      message.success('分享成功');
      if (seccessCallback) {
        seccessCallback();
      }
      this.setState({
        shareValue: '',
      });
      handleShareFalse();
      // if (!isInvitePage) {
      //   const { userId } = userData;
      //   let postList = [];
      //   dispatch(
      //     getAllPost({
      //       type: 'allGroup',
      //       groupId: '',
      //       postList,
      //       userId,
      //     })
      //   ).then(() => {
      //     handleShareFalse();
      //     this.setState({
      //       shareValue: '',
      //     });
      //   });
      // }
    } else {
      this.setState({
        canShare: true,
      });
    }
  };

  afterClose = () => {
    this.setState({
      canShare: true,
    });
  };

  handleCancel = () => {
    this.props.handleShareFalse();
  };

  handleChange = (dest) => {
    this.setState(
      {
        groupDest: dest,
      },
      () => {
        this.getPostConnect();
      }
    );
  };

  // changeShareVal = (val) => {
  //   this.setState({
  //     shareValue: val.length > 2000 ? val.substr(0, 2000) : val,
  //   });
  // };

  componentDidMount() {
    const { shareVisible } = this.props;
    this.setState({
      shareVisible: shareVisible,
    });

    let groupData = {
      type: 1,
      page: 1,
      rows: 10,
    };

    this.props.dispatch({
      type: 'share/getGroups',
      payload: {
        ...groupData,
      },
    });

    this.getPostConnect();
  }

  //获取关联列表
  getPostConnect = () => {
    this.setState(
      {
        connectList: [],
      },
      async () => {
        const { dispatch, memberMap } = this.props;
        const { groupDest } = this.state;
        const connectData = {
          groupId: groupDest === 'myCenter' ? '' : groupDest,
          type: groupDest === 'myCenter' ? 1 : 0,
          groupPostType: groupDest === 'myCenter' ? null : 1,
          isPublic: 1,
          targetType: 0,
        };
        if (groupDest === 'myCenter') {
          delete connectData.groupId;
          delete connectData.groupPostType;
        }
        const connectList = await dispatch(getConnectList(connectData));
        const {
          groupFollowList,
          groupMemberList,
          userFansList,
          userFollowList,
          groupList,
        } = connectList;
        if (groupDest === 'myCenter') {
          const userList = userFansList.concat(userFollowList);
          const newUserList = [...new Set(userList)].map((item) => {
            return {
              id: item,
              name: memberMap.getIn([item, 'given_name']),
              fullName: memberMap.getIn([item, 'full_name']),
              type: 'user',
            };
          });
          const newGroupList = groupList.map((item) => {
            return {
              id: item.groupId,
              name: item.groupName,
              fullName: item.groupName,
              type: 'group',
            };
          });
          this.setState({
            connectList: newUserList.concat(newGroupList),
          });
        } else {
          const userList = groupFollowList.concat(groupMemberList);
          const newUserList = [...new Set(userList)].map((item) => {
            return {
              id: item,
              name: memberMap.getIn([item, 'given_name']),
              fullName: memberMap.getIn([item, 'full_name']),
              type: 'user',
            };
          });
          const newGroupList = groupList.map((item) => {
            return {
              id: item.groupId,
              name: item.groupName,
              fullName: item.groupName,
              type: 'group',
            };
          });
          this.setState({
            connectList: newUserList.concat(newGroupList),
          });
        }
      }
    );
  };

  getChildState = (text) => {
    this.setState({
      shareValue: text,
    });
  };

  // getMentionList = (list) => {
  //   this.setState({
  //     mentionList: [...this.state.mentionList, list],
  //   });
  // };
  // 删除@列表
  // removeMentionList = (mentionList) => {
  //   this.setState({
  //     mentionList,
  //   });
  // };

  render() {
    const { shareVisible, myGroupLists, top } = this.props;
    let userName = '';
    if (top.indexOf(']') !== -1) {
      userName = top.substr(1, top.indexOf(']') - 1);
    }
    const { connectList } = this.state;
    return (
      <div className={styles.shareModal}>
        <Modal
          className={styles.shareToSpBox}
          title="分享動態"
          visible={shareVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          afterClose={this.afterClose}
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          footer={[
            <Button
              className={styles.footerBtn}
              key="分享"
              onClick={this.handleOk}
            >
              分享
            </Button>,
          ]}
        >
          <div className={styles.shareTitle}>
            正在分享<span>&nbsp;{userName.substr(0, 30)}&nbsp;</span>的帖子...
          </div>
          <div className={styles.shareSelect}>
            <div className={styles.selectTitle}>分享至：</div>
            <div className={styles.selectOptions}>
              <Select
                defaultValue="myCenter"
                className={styles.groupSelect}
                onChange={this.handleChange}
              >
                <Option key="myCenter" value="myCenter">
                  個人動態
                </Option>
                {!!myGroupLists &&
                  myGroupLists.map((item) => {
                    return (
                      <Option key={item.groupId} value={item.groupId}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>
          {/* <div className={styles.shareComment}>
            <TextArea
              style={{ border: 'none', height: '280px', overflow: 'scroll' }}
              placeholder="請輸入想要分享的內容(2000字以內)"
              value={shareValue}
              onChange={(el) => this.changeShareVal(el.target.value)}
            />
          </div> */}
          <Mention
            onChange={this.getChildState}
            // getMentionList={this.getMentionList}
            mentions={connectList}
            editorType={2}
            emojiKey={'shareToSp'}
            // mentionList={mentionList}
            // removeMentionList={this.removeMentionList}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let allGroupLists = state.share.get('groupData').toJS();
  let myGroups = [];
  if (allGroupLists.adminGroupList && allGroupLists.memberGroupList) {
    const { adminGroupList, memberGroupList } = allGroupLists;
    myGroups = adminGroupList.concat(memberGroupList);
  }
  return {
    myGroupLists: myGroups,
    // userData: state.users.get('ownInfo'),
    memberMap: state.members.get('memberMap'),
  };
}

export default connect(mapStateToProps)(ShareSp);
