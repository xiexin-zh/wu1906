import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { v4 as uuid } from 'uuid';
import get from 'lodash/get';
import last from 'lodash/last';
import queryString from 'query-string';
import { Icon, Modal, Popover, message } from 'antd';
import { getUserPostListComment } from '../../../models/userInfo/service';
import ImgContainer from './component/ImgContainer';
import VoteContainer from './component/VoteContainer';
import ShareSp from './component/ShareToSp';
import ShareIm from './component/ShareToIm';
import { withRouter } from 'dva/router';
import styles from './index.css';
import { getUrl } from '../../../utils/utils';
import { getFileImg } from '../../../utils/file';
import PostTop from '../PostTop';
import FeedStory from './FeedStory';
import FormattedDate from '../FormattedDate';
import Text from '../Text';
import { deletePost, getConnectList } from '../../../models/posts/actions';
import {
  getCurrentUserId,
  getCommentMaxLenght,
} from '../../../models/session/selectors';
import {
  // getUserAvatar,
  getUserDetail,
} from '../../../models/members/selectors';
import { changePostLike } from '../../../models/userInfo/actions';

import CreatePost from '../CreatePost';
import { mapPostTypeToGroupPostType } from './utils';

import publicImg from './component/icons/public.png';
import privateImg from './component/icons/private.png';
import adminIcon from './component/icons/adminavatar.png';
import UserAvatar from '../UserAvatar';
import {
  getGroupMap,
  getGroupDetail,
} from '../../../models/groupInfo/selectors';
import { initDialogs } from '../../../models/IMChannels/actions';
import GroupAvatar from '../GroupAvatar';
import MarkList from './component/MarkList';

import { GroupDetails as getGroupDetails } from '../../../models/defines/GroupDetails';

class PostItem extends Component {
  static propTypes = {
    openComment: PropTypes.bool,
  };

  static defualtProps = {
    openComment: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      userTitle: {},
      isMoreShow: true,
      height: 0,
      commentList: [],
      inputVal: '',
      isInputShow: false,
      feedStoryShow: false,
      visible: false,
      nowItem: {},
      noMore: true,
      sharePopover: false,
      shareTo: '',
      shareVisible: false,
      openEdit: false,
      toolVisible: false,
      openDelete: false,
      markList: false,
      memberslist: null,
      canComment: true, //能否留言
      postDataState: props.postData,
      identityOptions: [
        //留言身份選項
        { identityType: 1, identityName: '個人身份' },
        { identityType: 0, identityName: '管理員身份' },
      ],
      commentIdentity: 1, //一級留言默認身份為個人身份
      secondCommentIdentity: 1, //二級留言默認身份為個人身份
      connectList: [],
      // mentionList: [],
      fileList: [],
      likeEmojiLike: [
        {
          title: '讚',
          type: 1,
          pic: require('../../../assets/images/icon/praise.gif'),
          content: '👍',
        },
        {
          title: '笑趴',
          type: 2,
          pic: require('../../../assets/images/icon/laugh.gif'),
          content: '😊',
        },
        {
          title: '大爱',
          type: 3,
          pic: require('../../../assets/images/icon/tongue.gif'),
          content: '😛',
        },
        {
          title: '哇',
          type: 4,
          pic: require('../../../assets/images/icon/shock.gif'),
          content: '🤯',
        },
        {
          title: '心碎',
          type: 5,
          pic: require('../../../assets/images/icon/cry.gif'),
          content: '😠',
        },
        {
          title: '怒',
          type: 6,
          pic: require('../../../assets/images/icon/anger.gif'),
          content: '😭',
        },
      ],
      likeContent: null,
      clickHot: false,
      hotCommentShow: true,
    };
  }

  componentDidMount() {
    const { postData } = this.props;
    const { likeIconType } = postData;
    this.setState({
      height: (this.refs.itemContent || {}).offsetHeight,
      likeIconType: likeIconType - 1,
      likeContent:
        likeIconType === -1 || likeIconType === 0
          ? null
          : this.state.likeEmojiLike[likeIconType - 1].pic,
    });
  }

  // 獲取一級評論列表
  getComment = async (newSize, type) => {
    const { userId, postId, targetType, commentListResultBean } = this.props;
    const { commentList, clickHot } = this.state;
    //帖子詳情
    try {
      let size = (commentList.length ? 5 : 5) + 1;
      // let size = 5;
      if (typeof newSize === 'number') {
        size = newSize;
      }
      let popularCommentId = '';
      if (commentListResultBean) {
        popularCommentId = commentListResultBean.commentId;
      }
      let commentListRes = await getUserPostListComment({
        userId,
        targetId: postId,
        targetType: targetType === 'post' ? 0 : 1,
        size,
        createTs: get(last(commentList), 'createTs', 0),
        orderType: 1,
      });
      const newComment = get(commentListRes, 'data.commentList', []);
      let index = 1;
      newComment.forEach((item, i) => {
        if (item.commentId === popularCommentId) {
          index = i;
        }
      });
      let newList = [];
      if (type === 'hotPo') {
        if (index > 8) {
          const option = newComment[index];
          newList = newComment.slice(0, 8);
          newList.push(option);
        } else {
          newList = newComment;
        }
      } else if (type === 'delete') {
        newList = [...commentList, ...newComment].slice(
          0,
          commentList.length + 1
        );
      } else if (clickHot) {
        newComment.slice(0, size - 1);
      } else {
        newList = [...commentList, ...newComment.slice(0, size - 1)];
      }

      this.setState(
        {
          clickHot: type === 'hotPo' ? true : false,
          commentList: newList,
          noMore:
            type === 'hotPo' || newComment.length === 0
              ? true
              : newComment.length < size,
        },
        () => {
          if (type === 'hotPo') {
            this.scrollToAnchor(popularCommentId);
          }
        }
      );
    } catch (e) {
      console.info(e);
    }
  };

  scrollToAnchor = (anchorName) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.style.backgroundColor = '#EEF0F8';
        const scrollIntoViewOptions = {
          behavior: 'smooth',
        };
        anchorElement.scrollIntoView(scrollIntoViewOptions);
        // window.location.hash = anchorElement;
      }
    }
  };

  // handleOk = (e) => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  //帖子過長處理
  // handleMoreShow = (e) => {
  //   const { isMoreShow } = this.state;
  //   this.setState({
  //     isMoreShow: !isMoreShow,
  //   });
  // };

  handleInputChange = (e) => {
    const { commentLenght } = this.props;
    //TODO: 字數限定
    this.setState({
      inputVal: e.target.value.substr(0, commentLenght || 500),
    });
  };

  //一級留言身份選項切換
  changeCommentIdentity = (identity) => {
    this.setState({
      commentIdentity: identity,
    });
  };

  //二級留言身份選項切換
  changeSecondCommentIdentity = (identity) => {
    this.setState({
      secondCommentIdentity: identity,
    });
  };
  //留言 一级留言
  handleEnter = async (e) => {
    const {
      commentList,
      noMore,
      canComment,
      commentIdentity,
      fileList,
    } = this.state;
    let { inputVal } = this.state;
    const {
      dispatch,
      postId,
      targetType,
      postData,
      addCommentCountUpdatePostList,
      searchAddCommentCount,
      uploadThumbnail,
    } = this.props;

    const newValue = inputVal;
    // 处理文件获取长宽和视频第一帧等
    let files = await getFileImg({ fileList, uploadThumbnail });
    if (newValue || files.length) {
      if (!window.navigator.onLine) {
        message.info('無網絡連接');
        return false;
      }
      if (!canComment) {
        return false;
      }
      if (newValue.length > 500) {
        message.info('評論字數限制在500以內');
        return false;
      }
      if (!this.isCanComment()) {
        message.info('請先關注或加入該群組');
        return false;
      }
      this.setState({
        canComment: false,
      });
      let comment = await dispatch({
        type: 'userInfo/postComment',
        payload: {
          targetId: postId,
          type: targetType === 'post' ? 0 : 1,
          content: newValue,
          replyIdentityType: commentIdentity,
          files: files,
        },
      });

      const newCommentList = [comment.data].concat(commentList);

      this.setState(
        {
          inputVal: '',
          commentList: noMore ? newCommentList : newCommentList.splice(0, 5),
          canComment: true,
          fileList: [],
        },
        () => {
          addCommentCountUpdatePostList(postData);
          if (searchAddCommentCount) {
            // 搜索中的更新
            searchAddCommentCount(postData);
          }
        }
      );
      // eslint-disable-next-line no-unreachable
    } else {
      message.info('請輸入評論內容');
    }
  };

  //點贊表情
  handleLike = async (e, iconType, likeContent, isLikeBtn) => {
    e.stopPropagation();
    const {
      dispatch,
      postId,
      targetType,
      likePostUpdatePostList,
      searchUpdatePostLike,
      selfUserId,
      postData,
    } = this.props;
    const { like } = postData;
    const likeRes = await dispatch(
      changePostLike({
        id: postId,
        type: targetType === 'post' ? 0 : 2,
        like: isLikeBtn ? !like : true,
        iconType: iconType,
        userId: selfUserId,
      })
    );
    const {
      code,
      data: likeResData,
      data: { like: resLike, likeCount },
    } = likeRes;
    if (code === '200') {
      this.setState(
        {
          like: resLike,
          likeCount: likeCount,
          likeContent,
        },
        () => {
          likePostUpdatePostList({
            ...likeResData,
            likeIconType: likeRes.data.iconType,
          });
          if (searchUpdatePostLike) {
            // 搜索中的更新
            searchUpdatePostLike({
              ...likeResData,
              likeIconType: likeRes.data.iconType,
            });
          }
        }
      );
    }
  };

  //彈出框
  // handleModalShow = (item) => {
  //   const {
  //     postData: { files },
  //   } = this.props;
  //   const nowItem = item.originUrl ? { ...item } : { ...files[0] };
  //   this.setState(
  //     {
  //       visible: true,
  //       feedStoryShow: false,
  //       nowItem,
  //     },
  //     () => {
  //       this.toggleFeedStoryShow();
  //     }
  //   );
  // };
  // 公共详情弹框
  //没有点击图片
  handleModalShow = (detailsInfo) => {
    const { event } = detailsInfo;
    const tagName = event.target.tagName;
    if (tagName === 'A') {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'postsPopup/saveFileItem',
      payload: {
        fileItem: {},
        files: detailsInfo.data.files,
      },
    });
    dispatch({
      type: 'postsPopup/postModalState',
      payload: {
        showPostPopup: true,
        detailsInfo,
      },
    });
  };
  //点击图片
  handleImgModalShow = (detailsInfo) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'postsPopup/postModalState',
      payload: {
        showPostPopup: true,
        detailsInfo,
      },
    });
  };

  // handleToggleImg = (step) => {
  //   const { nowItem } = this.state;
  //   // const { files } = this.props;
  //   const { postData } = this.props;
  //   const { files } = postData;
  //   let newStep = nowItem.fileIndex + step;
  //   if (files) {
  //     files.map((item) => {
  //       if (item.fileIndex === newStep) {
  //         this.setState({
  //           nowItem: { ...item },
  //         });
  //       }
  //       return item;
  //     });
  //   }
  // };

  //获取关联列表
  getPostConnect = () => {
    this.setState(
      {
        connectList: [],
      },
      async () => {
        const { postData, dispatch, targetType } = this.props;
        const { groupId, isPublic, postType } = postData;
        const connectData = {
          groupId: !!groupId ? groupId : '',
          type: !!groupId ? 0 : 1,
          groupPostType: postType,
          isPublic,
          targetType: targetType === 'post' ? 0 : 1,
        };

        if (!groupId) {
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
        if (!groupId) {
          const userList = userFansList.concat(userFollowList);
          const newUserList = [...new Set(userList)].map((item) => {
            const { userId, givenName, displayName } = item;
            return {
              id: userId,
              // name: members.getIn([item, 'given_name']),
              // fullName: members.getIn([item, 'full_name']),
              name: givenName || displayName,
              fullName: givenName || displayName,
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
            const { userId, givenName, displayName } = item;
            return {
              id: userId,
              // name: members.getIn([item, 'given_name']),
              // fullName: members.getIn([item, 'full_name']),
              name: givenName || displayName,
              fullName: givenName || displayName,
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

  //切換留言
  handleInputShow = (type) => {
    const { isInputShow, commentList } = this.state;
    const { postData } = this.props;
    const { commentCount } = postData;
    if (!isInputShow) {
      this.getPostConnect();
    }
    if (type === 'hotPo') {
      this.setState(
        {
          commentList: [],
        },
        () => {
          this.getComment(commentCount, type);
        }
      );
    } else {
      if (!isInputShow && !commentList.length) {
        this.getComment();
      }

      this.setState({
        commentList: commentList.slice(0, 5),
        noMore: commentList.length < 5,
      });
    }
    this.setState({
      isInputShow: !isInputShow,
      inputVal: '',
    });
  };

  toggleFeedStoryShow = () => {
    const { feedStoryShow, commentList } = this.state;
    if (!feedStoryShow) {
      this.getPostConnect();
    }
    if (!feedStoryShow && !commentList.length) {
      this.getComment();
    }
    this.setState({
      feedStoryShow: !feedStoryShow,
      inputVal: '',
      commentList: commentList.slice(0, 5),
      noMore: commentList.length < 5,
    });
  };

  getChildState = (text) => {
    this.setState({
      inputVal: text,
    });
  };

  //刪除帖子按鈕
  deletePost = () => {
    this.setState({
      openDelete: true,
    });
  };
  //刪除提示框  取消刪除
  deleteCancel = () => {
    this.setState({
      openDelete: false,
    });
  };
  //刪除提示框  確認刪除
  deleteOk = () => {
    const {
      dispatch,
      postId,
      targetType,
      updatePostList,
      searchDeletePost,
    } = this.props;

    dispatch(deletePost(postId, targetType)).then((result) => {
      if (result) {
        message.info('刪除成功');
        this.deleteCancel();
        updatePostList(postId);
        if (searchDeletePost) {
          searchDeletePost(postId);
        }
      } else {
        message.warning('刪除失败');
      }
    });
  };

  editPost = () => {
    this.setState({
      openEdit: true,
    });
  };

  closePostEditing = () => {
    this.setState({
      openEdit: false,
    });
  };

  openTool = () => {
    this.setState({
      toolVisible: true,
    });
  };

  closeTool = () => {
    this.setState({
      toolVisible: false,
    });
  };

  handleVisibleChange = (toolVisible) => {
    this.setState({ toolVisible });
  };

  renderContent() {
    const { targetType, postData, selfUserId } = this.props;
    const { leaveMessageUserId } = postData;
    let isShow = targetType === 'post' && this.adminAadOwnPost();
    // 如果留言id存在且等于自己的id
    if (leaveMessageUserId && leaveMessageUserId !== selfUserId) {
      isShow = false;
    }
    // const { openDelete } = this.state;
    // const type = targetType === 'post' ? '帖子' : '投票';
    return (
      <div className={styles.editPost} onClick={this.closeTool}>
        {isShow && <p onClick={this.editPost}>編輯帖子</p>}
        <p onClick={this.deletePost}>刪除帖子</p>
      </div>
    );
  }

  //刪除帖子提示彈框
  deleteModal = (openDelete) => {
    const { targetType } = this.props;
    const type = targetType === 'post' ? '帖子' : '投票';
    return (
      <Modal
        className={styles.deletePost}
        title={`刪除${type}`}
        visible={openDelete}
        onCancel={this.deleteCancel}
        destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
      >
        <div className={styles.confirmDelete}>
          <div className={styles.confirContent}>確定刪除{type}？</div>
          <div className={styles.confirBtn}>
            <div className={styles.confirmCancel} onClick={this.deleteCancel}>
              取消
            </div>
            <div className={styles.confirmOk} onClick={this.deleteOk}>
              刪除
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  //分享帖子選項
  handleShare = (shareTo, targetType) => {
    const { dispatch } = this.props;
    dispatch(initDialogs());
    if (targetType === 'vote') {
      message.destroy();
      message.warning('投票帖不支持分享');
    } else if (targetType === 'post') {
      this.setState({
        shareTo: shareTo,
        shareVisible: true,
      });
    } else {
      message.destroy();
      message.error('分享類型錯誤');
    }
  };
  //隱藏分享內容介面
  handleShareFalse = () => {
    this.setState({
      shareVisible: false,
    });
  };

  getCommentSwitch = () => {
    const { postData, groupMap } = this.props;
    const { postType, groupId } = postData;
    if (postType === 1) {
      return true;
    }
    return Boolean(groupMap.get(groupId, {}).permissionCreateComment);
  };
  getCommentAttached = (fileList) => {
    this.setState({
      fileList,
    });
  };
  removerFileList = () => {
    this.setState({
      fileList: [],
    });
  };

  // 標註人列表
  markList = () => {
    const {
      postData: { mentionUsers },
    } = this.props;
    if (!mentionUsers) {
      return;
    }

    const list = mentionUsers.map((item) => {
      return this.props.members.get(item);
    });

    if (this.props.members.size > 0) {
      this.setState({
        markList: true,
        memberslist: list,
      });
    }
  };
  cancelList = () => {
    this.setState({
      markList: false,
    });
  };

  getSharePost(postData) {
    if (!postData.sharePost) {
      return postData;
    } else if (
      Object.prototype.toString.call(postData.sharePost) === '[object Object]'
    ) {
      return this.getSharePost(postData.sharePost);
    }
    return null;
  }

  //点击分享的帖子弹出详情
  //不点击图片
  skipToCurrentPost = (e, detailsInfo) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'postsPopup/saveFileItem',
      payload: {
        fileItem: {},
        files: detailsInfo.data.files,
      },
    });
    dispatch({
      type: 'postsPopup/postModalState',
      payload: {
        showPostPopup: true,
        detailsInfo,
      },
    });
  };
  //点击图片
  skipToCurrentImgPost = (detailsInfo) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'postsPopup/postModalState',
      payload: {
        showPostPopup: true,
        detailsInfo,
      },
    });
  };

  addShareCount = () => {
    const {
      searchAddShareCount,
      shareCountUpdatePostList,
      postData,
    } = this.props;
    shareCountUpdatePostList(postData);
    if (searchAddShareCount) {
      searchAddShareCount(postData);
    }
  };

  //判斷當前用戶是否是管理員貼群組中的管理員
  currentUserIsGroupAdmin = () => {
    const { isGroupPost, groupDetail } = this.props;
    if (isGroupPost) {
      if (groupDetail.toJS().groupId) {
        return new getGroupDetails(groupDetail.toJS()).isGroupAdmin;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //更新一級留言編輯狀態
  updateCommentState = (data) => {
    const { commentList } = this.state;

    const newCommentList = commentList.map((item) => {
      if (item.commentId === data.commentId) {
        return (item = data);
      } else {
        return item;
      }
    });
    this.setState({
      commentList: newCommentList,
    });
  };
  // 刪除一級留言
  deleteCommentOfOne = (commentId, commentNum = 0) => {
    const {
      deleteCommentCountUpdatePostList,
      postData,
      dispatch,
      searchDeleteCommentCount,
      commentListResultBean,
    } = this.props;
    const { clickHot } = this.state;
    const newList = this.state.commentList.filter((item) => {
      return item.commentId !== commentId;
    });
    dispatch({
      type: 'posts/deleteComment',
      payload: {
        commentId,
      },
    }).then((res) => {
      this.setState({
        commentList: newList,
      });
      if (!clickHot) {
        this.getComment(2, 'delete');
      }

      deleteCommentCountUpdatePostList(postData, commentNum);
      if (searchDeleteCommentCount) {
        // 搜索删除留言
        searchDeleteCommentCount(postData, commentNum);
      }
    });
    let popularCommentId = '';
    if (commentListResultBean) {
      popularCommentId = commentListResultBean.commentId;
    }
    if (popularCommentId === commentId) {
      this.setState({
        hotCommentShow: false,
      });
    }
  };
  isAbleToShare = () => {
    const { isGroupPost, targetType, postData } = this.props;
    const { isPublic } = postData;
    if (targetType === 'vote') {
      return false;
    }
    if (isGroupPost && !isPublic) {
      return false;
    }

    return true;
  };

  isCanComment = () => {
    //判断当前用户与群组身份，判断是否能对群组内帖子留言
    const { groupDetail, postData } = this.props;
    const { groupId } = postData;
    const { isPublic, identity } = groupDetail;
    if (!!groupId && !isPublic && identity === 1) {
      return false;
    }
    return true;
  };

  adminAadOwnPost = () => {
    const { groupDetail, postData, selfUserId, targetType } = this.props;
    const { isGroupAdmin } = groupDetail;
    const { userId, isAdminVote, postType, leaveMessageUserId } = postData;
    const ownPost = selfUserId === userId;
    // 留言的id和自己的Id一致的时候才能对帖子进行操作
    const ownleaveMessagePost = leaveMessageUserId === selfUserId;
    if (targetType === 'post') {
      // 普通帖子权限：自己和只有群组管理员并且帖子是管理贴的时候才返回true
      return ownPost || (isGroupAdmin && postType === 0) || ownleaveMessagePost;
    } else if (targetType === 'vote') {
      // 投票帖子权限：自己和只有群组管理员并且是投票贴是管理贴的时候才返回true
      return ownPost || (isGroupAdmin && isAdminVote === 1);
    }
  };

  render() {
    const {
      inputVal,
      commentList,
      isInputShow,
      noMore,
      openEdit,
      toolVisible,
      sharePopover,
      shareVisible,
      shareTo,
      openDelete,
      markList,
      memberslist,
      identityOptions,
      commentIdentity,
      secondCommentIdentity,
      connectList,
      fileList,
      likeEmojiLike,
      // mentionList,
      hotCommentShow,
    } = this.state;
    const {
      userData,
      createTs,
      targetType,
      selfUserId,
      postData,
      followName,
      postId,
      routeType,
      userDetails,
      members,
      groupMap,
      commentListResultBean,
      history,
      searchUpdatePostLike,
    } = this.props;
    const {
      userId,
      content,
      likeCount,
      files,
      commentCount,
      shareCount,
      like,
      groupId,
      leaveMessageUserId,
      postType,
      sharePost,
      shareIsDelete,
      isPublic,
      avatarUrl,
      topPost,
      likeIconType,
      isAdminVote,
    } = postData;
    const idAdminPost = postType === 0;
    const mentionUsers = postData.mentionUsers || [];
    if (!userData) {
      return null;
    }
    // const isPublic = groupDetail.isPublic;   //公开贴和公开群组概念不一样
    const { top = '' } = postData;
    const ownPost = selfUserId === userId;

    //是否是群組帖管理員
    const isGroupPostAdmin = this.currentUserIsGroupAdmin();

    let shareComment = this.getSharePost(postData);
    const shareCommentIsAdminPost = shareComment.postType === 0;

    //postListType:当前页面类型
    const urlname = history.location.pathname;
    //判斷是否是接受邀請頁面
    const isInvitePage = queryString.parse(this.props.location.search).inviteId
      ? true
      : false;
    return (
      <div className={styles.postItemBox}>
        <div className={styles.postItemHeader}>
          <div className={styles.postItemAvatar}>
            {idAdminPost || isAdminVote === 1 ? (
              <GroupAvatar
                size={30}
                groupId={groupId}
                style={{ color: '#475F77' }}
              />
            ) : (
              <UserAvatar
                size={30}
                userId={leaveMessageUserId ? leaveMessageUserId : userId}
              />
            )}
            <div className={styles.postTitle}>
              <PostTop markList={this.markList} top={top} />
              <div
                className={styles.postMsg}
                onClick={
                  targetType === 'post'
                    ? (event) =>
                        this.handleModalShow({
                          data: postData,
                          type: 'post',
                          createTs: postData.createTs,
                          event,
                          searchUpdatePostLike: searchUpdatePostLike,
                        })
                    : null
                }
              >
                <span>
                  <FormattedDate ts={createTs} />
                </span>
                {!!groupId && (
                  <div className={styles.typeIcon}>
                    {(postType === 0 || isAdminVote === 1) && (
                      <img
                        src={adminIcon}
                        className={styles.adminIcon}
                        alt=""
                      ></img>
                    )}
                    {
                      // targetType === 'post' &&
                      <span style={{ margin: '0 5px' }}>·</span>
                    }
                    {
                      // targetType === 'post' &&
                      <div className={styles.postIsPublic}>
                        <img
                          src={isPublic ? publicImg : privateImg}
                          alt=""
                        ></img>
                      </div>
                    }
                    {((postType === 0 && isGroupPostAdmin && userDetails) ||
                      isAdminVote === 1) && (
                      <span className={styles.postUserName}>
                        <span style={{ marginRight: '5px' }}>·</span>
                        {userDetails && userDetails.username
                          ? userDetails.username.length > 20
                            ? userDetails.username.substr(0, 20) + '...'
                            : userDetails.username
                          : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {this.adminAadOwnPost() && (
            <Popover
              placement="right"
              content={this.renderContent()}
              trigger="click"
              visible={toolVisible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Icon
                style={{
                  fontSize: '30px',
                  color: '#0c293a',
                }}
                type="ellipsis"
                onClick={this.openTool}
              />
            </Popover>
          )}
          {/* 编辑帖子的modal*/}
          {openEdit && (
            <CreatePost
              leaveMessageUserId={
                leaveMessageUserId ? leaveMessageUserId : null
              }
              closeModal={this.closePostEditing}
              title="編輯貼文"
              visible={openEdit}
              defaultContent={content}
              isPublic={isPublic}
              groupId={groupId}
              searchUpdatePost={this.props.searchUpdatePost}
              defaultFiles={files.map((item) => {
                let type = 'image/png';
                // eslint-disable-next-line default-case
                switch (item.type) {
                  case 1:
                    type = 'image/png';
                    break;
                  case 2:
                    type = 'video/mp4';
                    break;
                  case 3:
                    type = 'image/gif';
                    break;
                }
                return {
                  ...item,
                  uid: uuid(),
                  url:
                    item.type === 3
                      ? getUrl(item.originUrl)
                      : getUrl(item.thumbnailUrl),
                  // url: getUrl(item.thumbnailUrl),
                  // type: item.type === 1 ? 'image/png' : 'video/mp4',
                  type,
                  fileType: item.type,
                };
              })}
              defaultMentionUsers={mentionUsers}
              groupPostType={mapPostTypeToGroupPostType(postType)}
              postId={postId}
              mentionUsers={mentionUsers}
              createPostType={'editPost'}
              previewType={0}
              isEdit={true}
              emojiKeyType={'editPost'}
              isShareData={
                Boolean(sharePost) || (sharePost == null && shareIsDelete)
              }
            />
          )}
          {/* 刪除帖子modal */}
          {this.deleteModal(openDelete)}
        </div>

        <div className={styles.postItemMain}>
          {targetType === 'vote' ? (
            <VoteContainer votes={postData} />
          ) : (
            content && (
              <div
                className={styles.postContent}
                onClick={(event) =>
                  this.handleModalShow({
                    data: postData,
                    type: 'post',
                    createTs: postData.createTs,
                    event,
                    searchUpdatePostLike: searchUpdatePostLike,
                  })
                }
              >
                <Text
                  groupMap={groupMap}
                  members={members}
                  content={content}
                  limitLine={5}
                />
              </div>
            )
          )}

          <div>
            {files ? (
              <ImgContainer
                clickFunc={() =>
                  this.handleImgModalShow({
                    data: postData,
                    type: 'post',
                    createTs: postData.createTs,
                    searchUpdatePostLike: searchUpdatePostLike,
                  })
                }
                files={files}
              />
            ) : null}
            {/* {this.renderDetail()} */}
          </div>

          {sharePost == null && shareIsDelete && (
            <div className={styles.postNoItem}>原貼已被刪除</div>
          )}
          {sharePost && (
            <div className={styles.postItemReply}>
              <div className={styles.replyUserMsg}>
                {shareCommentIsAdminPost ? (
                  <GroupAvatar
                    size={30}
                    groupId={shareComment.groupId}
                    style={{ color: '#475F77' }}
                  />
                ) : (
                  <UserAvatar size={30} userId={shareComment.userId} />
                )}
                <div className={styles.replyUserName}>
                  <div>
                    <span>
                      <PostTop top={shareComment.top} />
                    </span>
                  </div>
                  <div
                    className={styles.sharePostMsg}
                    onClick={(e) =>
                      this.skipToCurrentPost(e, {
                        data: shareComment,
                        type: 'post',
                        createTs: shareComment.createTs,
                        searchUpdatePostLike: searchUpdatePostLike,
                      })
                    }
                  >
                    <span>
                      <FormattedDate ts={shareComment.createTs} />
                    </span>

                    {shareComment.postType === 0 && (
                      <img
                        src={adminIcon}
                        className={styles.adminIcon}
                        alt=""
                      ></img>
                    )}
                    {!!shareComment.groupId && (
                      <span style={{ margin: '0 5px' }}>·</span>
                    )}
                    {!!shareComment.groupId && (
                      <img
                        src={shareComment.isPublic ? publicImg : privateImg}
                        className={styles.shareIsPublic}
                        alt=""
                      ></img>
                    )}
                  </div>
                </div>
              </div>
              <div
                onClick={(e) =>
                  this.skipToCurrentPost(e, {
                    data: shareComment,
                    type: 'post',
                    createTs: shareComment.createTs,
                    searchUpdatePostLike: searchUpdatePostLike,
                  })
                }
              >
                <Text
                  content={shareComment.content}
                  groupMap={groupMap}
                  members={members}
                  limitLine={5}
                />
              </div>
              <div
              // onClick={(e) =>
              //   this.skipToCurrentImgPost(e, {
              //     data: shareComment,
              //     type: 'post',
              //     createTs: shareComment.createTs,
              //   })
              // }
              >
                <ImgContainer
                  clickFunc={() =>
                    this.skipToCurrentImgPost({
                      data: shareComment,
                      type: 'post',
                      createTs: shareComment.createTs,
                      searchUpdatePostLike: searchUpdatePostLike,
                    })
                  }
                  // clickFunc={null}
                  files={shareComment.files}
                />
              </div>
            </div>
          )}
          <FeedStory
            deleteCommentOfOne={this.deleteCommentOfOne}
            ableToShare={this.isAbleToShare()}
            selfUserId={selfUserId}
            likeCount={likeCount}
            commentCount={commentCount}
            openComment={this.getCommentSwitch()}
            shareCount={shareCount}
            isLike={like}
            isInputShow={isInputShow}
            avatarUrl={avatarUrl}
            userData={userData}
            sharePost={sharePost}
            shareIsDelete={shareIsDelete}
            inputVal={inputVal}
            targetType={targetType}
            postId={postId}
            noMore={noMore}
            sharePopover={sharePopover}
            getComment={this.getComment}
            commentList={commentList}
            handleLike={this.handleLike}
            postData={postData}
            handleInputShow={this.handleInputShow}
            handleInputChange={this.handleInputChange}
            handleEnter={this.handleEnter}
            handleShare={this.handleShare}
            popoverPlacement="rightTop"
            ownPost={ownPost}
            updateCommentState={this.updateCommentState}
            identityOptions={identityOptions}
            commentIdentity={commentIdentity}
            changeCommentIdentity={this.changeCommentIdentity}
            isGroupPostAdmin={isGroupPostAdmin}
            changeSecondCommentIdentity={this.changeSecondCommentIdentity}
            secondCommentIdentity={secondCommentIdentity}
            searchDeleteCommentCount={this.props.searchDeleteCommentCount}
            searchAddCommentCount={this.props.searchAddCommentCount}
            getChildState={this.getChildState}
            // getMentionList={this.getMentionList}
            connectList={connectList}
            commentListResultBean={commentListResultBean}
            hotCommentShow={hotCommentShow}
            getPostConnect={this.getPostConnect}
            emojiKeyType={'postNormal'}
            getCommentAttached={this.getCommentAttached}
            removerFileList={this.removerFileList}
            isCanComment={this.isCanComment}
            absolute={true}
            fileList={fileList}
            // mentionList={mentionList}
            // removeMentionList={this.removeMentionList}
            likeEmojiLike={likeEmojiLike}
            likeContent={
              likeIconType === -1 || likeIconType === 0
                ? ''
                : likeEmojiLike[likeIconType - 1].pic
            }
          />
        </div>
        {shareTo === 'sp' && (
          <ShareSp
            shareVisible={shareVisible}
            followName={followName}
            handleShareFalse={this.handleShareFalse}
            userId={userId}
            postId={postId}
            top={postData.top}
            groupId={groupId}
            fetchData={this.props.fetchData}
            seccessCallback={this.addShareCount}
            query={this.props.query}
            history={this.props.history}
            postData={postData}
            isInvitePage={isInvitePage}
            urlname={urlname}
            // mentionList={mentionList}
            // removeMentionList={this.removeMentionList}
          ></ShareSp>
        )}
        {shareTo === 'im' && (
          <ShareIm
            shareVisible={shareVisible}
            userId={userId}
            postId={postId}
            targetType={targetType}
            handleShareFalse={this.handleShareFalse}
            seccessCallback={this.addShareCount}
            postData={postData}
          ></ShareIm>
        )}
        {/* 置頂貼icon 只有進入到一個群組內才顯示 */}
        {routeType === 'group' && topPost && (
          <div className={styles.topPost}></div>
        )}

        <MarkList
          visible={markList}
          onCancel={this.cancelList}
          memberslist={memberslist}
        ></MarkList>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const userId = get(ownProps, 'postData.userId');
  const groupId = get(ownProps, 'postData.groupId');
  return {
    selfUserId: getCurrentUserId(state),
    groupMap: getGroupMap(state),

    userData: state.users.get('ownInfo'),
    // userAvatarUrl: getUserAvatar(state, userId),
    // employeeId: state.session.getIn(['user', 'employee_id']),
    commentLenght: getCommentMaxLenght(state),
    members: state.members.get('memberMap'),
    groupDetail: getGroupDetail(state, groupId),
    isGroupPost: Boolean(groupId),
    userDetails: getUserDetail(state, userId),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updatePostList: (postId) => {
      // 删除完成之后更新帖子
      dispatch({
        type: 'posts/updatePostList',
        payload: { postId },
      });
    },
    likePostUpdatePostList: (likeData) => {
      // 点赞完成之后更新帖子
      dispatch({
        type: 'posts/likePostUpdatePostList',
        payload: { likeData },
      });
    },
    addCommentCountUpdatePostList: (postData) => {
      // 留言完成之后更新帖子
      dispatch({
        type: 'posts/addCommentCountUpdatePostList',
        payload: { postData },
      });
    },
    deleteCommentCountUpdatePostList: (postData, commentNum) => {
      // 删除留言完成之后更新帖子
      dispatch({
        type: 'posts/deleteCommentCountUpdatePostList',
        payload: { postData, secondCount: commentNum },
      });
    },
    shareCountUpdatePostList: (postData) => {
      // 分享留言完成之后更新帖子
      dispatch({
        type: 'posts/shareCountUpdatePostList',
        payload: { postData },
      });
    },
    uploadThumbnail: (thumbnailImage) => {
      return dispatch({
        type: 'posts/uploadThumbnail',
        payload: thumbnailImage,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostItem));
