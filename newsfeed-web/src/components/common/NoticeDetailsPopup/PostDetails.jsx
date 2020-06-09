import React from 'react';
import { connect } from 'dva';
import { Icon, Modal, message } from 'antd';

import styles from './NoticeDetailsPopup.css';
import { getUrl, downloadFile } from '../../../utils/utils';
import FeedStory from '../PostItem/FeedStory';
import Text from '../Text';
import FormattedDate from '../FormattedDate';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import WaterMark from '../PostItem/component/WaterMark/index';
import { getImgInfo, getFileImg } from 'utils/file';
import { addWaterMaskAndDownload, getWatermarkDataURL } from 'utils/watermark';
import {
  getGroupMap,
  getGroupDetail,
} from '../../../models/groupInfo/selectors';
import { getUserPostListComment } from '../../../models/userInfo/service';
import get from 'lodash/get';
import last from 'lodash/last';
import { changePostLike } from '../../../models/userInfo/actions';
import {
  getCurrentUserId,
  getCommentMaxLenght,
} from '../../../models/session/selectors';
import { initDialogs } from '../../../models/IMChannels/actions';
import { GroupDetails as getGroupDetails } from '../../../models/defines/GroupDetails';
import { getConnectList } from '../../../models/posts/actions';

class PostDetails extends React.Component {
  constructor(props) {
    super(props);
    const {
      // detailsInfo: {
      //   data: { files },
      // },
      nowItem,
      // files,
      detailsInfo,
    } = props;
    this.state = {
      // nowItem: files[0],
      nowItem: nowItem.originUrl
        ? { ...nowItem }
        : { ...detailsInfo.data.files[0] },
      commentList: [],
      noMore: true,
      isInputShow: false,
      inputVal: '',
      canComment: true, //能否留言
      feedStoryShow: false,
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
      likeIconType: null,
      commentShowType: 'orderByNew',
    };
  }

  // 下载
  downloadImg = async (src, fileType) => {
    if (fileType === 2) {
      const filename = `video_${Date.now()}.mp4`;
      downloadFile(src, filename);
      return false;
    } else if (fileType === 3) {
      const filename = `gif_${Date.now()}.gif`;
      downloadFile(src, filename);
      return false;
    }

    const { orientation, name } = await getImgInfo(src);
    const { employeeId } = this.props;
    // 首先要对图片进行方向转变，然后加水印，然后再下载
    const resultImg = new Image();
    resultImg.setAttribute('crossOrigin', 'anonymous');
    resultImg.onload = function() {
      const imgWidth = this.width,
        imgHeight = this.height;
      const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      let resultImgsrc = '';
      if (orientation && orientation !== 1) {
        switch (orientation) {
          case 6:
            canvas.width = imgHeight;
            canvas.height = imgWidth;
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
            break;
          case 3:
            ctx.rotate(Math.PI);
            ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
            break;
          case 8:
            canvas.width = imgHeight;
            canvas.height = imgWidth;
            ctx.rotate((3 * Math.PI) / 2);
            ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
            break;
          default:
            resultImgsrc = src;
            break;
        }
        try {
          resultImgsrc = canvas.toDataURL('image/jpeg', 1);
        } catch (e) {
          resultImgsrc = src;
        }
      } else {
        resultImgsrc = src; //旋轉後的結果
      }
      const imgName = name
        ? name.replace(/\.[^.]+$/, '.jpeg')
        : `image_${Math.ceil(Math.random() * 1000)}.jpeg`;
      getWatermarkDataURL({
        src: resultImgsrc,
        watermarkText: employeeId,
        callback(src) {
          addWaterMaskAndDownload(src, imgName); //传入转过并加水印的图片
        },
        error(e) {
          addWaterMaskAndDownload(resultImgsrc, imgName); //传入转过并加水印的图片
        },
      });
    };
    resultImg.src = src;
    //首先要对图片进行方向转变，然后加水印，然后再下载
  };

  // 切换图片
  handleToggleImg = (step) => {
    const { nowItem } = this.state;
    const {
      detailsInfo: { data },
    } = this.props;
    const { files } = data;
    let newStep = nowItem.fileIndex + step;
    if (files) {
      files.forEach((item) => {
        if (item.fileIndex === newStep) {
          this.setState({
            nowItem: { ...item },
          });
        }
      });
    }
  };

  getCommentSwitch = () => {
    const { detailsInfo, groupMap } = this.props;
    const { postType, groupId } = detailsInfo.data;
    if (postType === 1) {
      return true;
    }
    return Boolean(groupMap.get(groupId, {}).permissionCreateComment);
  };

  getComment = async (newSize, type) => {
    const {
      detailsInfo: {
        data: { userId, postId, commentCount },
      },
    } = this.props;
    console.log(this.props);
    const { commentList, commentShowType } = this.state;
    // orderType：1-由新到舊 2-最熱門 3-由舊到新
    let orderType = 1;
    if (commentShowType === 'orderByHot') {
      orderType = 2;
    } else if (commentShowType === 'orderByAll') {
      orderType = 3;
    }
    //帖子詳情
    try {
      let size = (commentList.length ? 5 : 5) + 1;
      // let size = 5;
      if (typeof newSize === 'number') {
        size = newSize;
      }
      let commentListRes = await getUserPostListComment({
        userId,
        targetId: postId,
        targetType: 0,
        size: commentShowType === 'orderByHot' ? commentCount : size,
        createTs: get(last(commentList), 'createTs', 0),
        orderType,
      });
      const newComment = get(commentListRes, 'data.commentList', []);

      this.setState({
        commentList:
          commentShowType === 'orderByHot'
            ? newComment
            : [...commentList, ...newComment.slice(0, size - 1)],
        noMore:
          commentShowType === 'orderByHot' ? true : newComment.length < size,
      });
    } catch (e) {
      console.info(e);
    }
  };

  // 刪除一級留言
  deleteCommentOfOne = (commentId, commentNum = 0) => {
    const { commentList } = this.state;
    const { dispatch, detailsInfo } = this.props;
    const newList = commentList.filter((item) => {
      return item.commentId !== commentId;
    });
    dispatch({
      type: 'posts/deleteComment',
      payload: {
        commentId,
      },
    }).then(() => {
      this.setState(
        {
          commentList: newList,
        },
        () => {
          this.getComment(2, 'detel');
          dispatch({
            type: 'postsPopup/updateComment',
            payload: {
              updateCommentType: 'delete',
              secondCount: commentNum,
            },
          });
          dispatch({
            type: 'posts/deleteCommentCountUpdatePostList',
            payload: {
              postData: detailsInfo.data,
              secondCount: commentNum,
            },
          });
        }
      );
    });
  };

  //切換留言
  handleInputShow = () => {
    const { isInputShow, commentList } = this.state;
    if (!isInputShow && !commentList.length) {
      this.getComment();
    }
    this.setState({
      isInputShow: !isInputShow,
      inputVal: '',
      commentList: commentList.slice(0, 5),
      noMore: commentList.length > 5,
    });
  };

  handleInputChange = (e) => {
    const { commentLenght } = this.props;
    //TODO: 字數限定
    this.setState({
      inputVal: e.target.value.substr(0, commentLenght || 500),
    });
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
  handleEnter = async () => {
    const {
      inputVal,
      commentList,
      noMore,
      canComment,
      commentIdentity,
      fileList,
    } = this.state;
    const {
      detailsInfo,
      detailsInfo: {
        data: { postId },
      },
      dispatch,
      uploadThumbnail,
    } = this.props;

    let files = await getFileImg({ fileList, uploadThumbnail });
    if (inputVal.trim() || files.length !== 0) {
      if (!window.navigator.onLine) {
        message.info('無網絡連接');
        return;
      }
      if (!canComment) {
        return;
      }
      this.setState({
        canComment: false,
      });

      let comment = await dispatch({
        type: 'userInfo/postComment',
        payload: {
          targetId: postId,
          type: 0,
          content: inputVal.trim(),
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
        },
        () => {
          dispatch({
            type: 'postsPopup/updateComment',
            payload: {
              updateCommentType: 'add',
            },
          });
          dispatch({
            type: 'posts/addCommentCountUpdatePostList',
            payload: { postData: detailsInfo.data },
          });
        }
      );
    } else {
      message.info('請輸入評論內容');
    }
  };

  //點贊
  handleLike = async (e, iconType, likeContent, isLikeBtn) => {
    e.stopPropagation();
    const { dispatch, detailsInfo, selfUserId } = this.props;
    const { searchUpdatePostLike } = detailsInfo;
    const { postId, like } = detailsInfo.data;
    // const { likeIconType } = this.state;
    const likeRes = await dispatch(
      changePostLike({
        id: postId,
        type: 0,
        like: isLikeBtn ? !like : true,
        iconType,
        userId: selfUserId,
      })
    );
    const {
      code,
      data: likeResData,
      data: { iconType: resIconType },
    } = likeRes;
    if (code === '200') {
      const { like, likeCount } = likeResData;
      this.setState({
        likeContent,
        likeIconType: resIconType,
      });
      dispatch({
        type: 'postsPopup/updateLike',
        payload: {
          like,
          likeCount,
        },
      });
      dispatch({
        type: 'posts/likePostUpdatePostList',
        payload: {
          likeData: {
            id: postId,
            type: 0,
            like,
            likeCount,
            likeIconType: resIconType,
          },
        },
      });
      if (searchUpdatePostLike) {
        searchUpdatePostLike({
          ...likeResData,
          likeIconType: likeRes.data.iconType,
        });
      }
    }
  };

  toggleFeedStoryShow = () => {
    const { feedStoryShow, commentList } = this.state;
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

  //分享帖子選項
  handleShare = (shareTo) => {
    const { dispatch, detailsInfo } = this.props;
    dispatch(initDialogs());
    dispatch({
      type: 'postsPopup/showShareTo',
      payload: {
        shareTo,
      },
    });
    dispatch({
      type: 'posts/shareCountUpdatePostList',
      payload: {
        postData: detailsInfo.data,
      },
    });
  };

  isCanComment = () => {
    //判断当前用户与群组身份，判断是否能对群组内帖子留言
    const { groupDetail, detailsInfo } = this.props;
    const { groupId } = detailsInfo.data;
    const { isPublic, identity } = groupDetail;
    if (!!groupId && !isPublic && identity === 1) {
      return false;
    }
    return true;
  };

  componentDidMount() {
    this.getPostConnect();
    const { detailsInfo } = this.props;
    const { likeIconType } = detailsInfo.data;
    this.setState({
      likeIconType,
      likeContent:
        likeIconType === -1 || likeIconType === 0
          ? null
          : this.state.likeEmojiLike[likeIconType - 1].pic,
    });
  }
  getCommentAttached = (fileList) => {
    this.setState({
      fileList,
    });
  };

  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    };
  }
  removerFileList = () => {
    this.setState({
      fileList: [],
    });
  };

  isAbleToShare = () => {
    const { isGroupPost, type, detailsInfo } = this.props;
    const { isPublic } = detailsInfo.data;
    if (type === 'vote') {
      return false;
    }
    if (isGroupPost && !isPublic) {
      return false;
    }
    return true;
  };

  // 留言查詢切換
  commentChange = (val) => {
    this.setState(
      {
        commentShowType: val,
        commentList: [],
      },
      () => {
        this.getComment();
      }
    );
  };

  // 渲染 贴子 详情
  renderPostDetail = () => {
    const {
      detailsInfo,
      showPostPopup,
      handleCancel,
      userData,
      selfUserId,
      groupMap,
      members,
    } = this.props;
    const {
      postId,
      followName,
      content,
      like,
      likeCount,
      commentCount,
      shareCount,
      postType,
      files,
      sharePost,
      // indexSymbol,
      userId,
      createTs,
      groupId,
    } = detailsInfo.data;
    const {
      inputVal,
      commentList,
      nowItem = {},
      feedStoryShow,
      noMore,
      identityOptions,
      commentIdentity,
      secondCommentIdentity,
      connectList,
      // mentionList,
      fileList,
      likeEmojiLike,
      likeContent,
    } = this.state;
    const dealWithUrl = getUrl(nowItem.originUrl);
    const idAdminPost = postType === 0;
    // FIXME: model defines
    const avatarUrl = getUrl(detailsInfo.avatarUrl);
    //是否是群組帖管理員
    const isGroupPostAdmin = this.currentUserIsGroupAdmin();

    return (
      <Modal
        className={styles.noticeDetail}
        width={dealWithUrl ? '95%' : '40%'}
        visible={showPostPopup}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <div className={styles.modalInside}>
          {dealWithUrl && (
            <div className={styles.insideImgs}>
              <div className={styles.ImgsContainer}>
                <div className={styles.ImgsBox}>
                  {nowItem.type === 2 ? (
                    <video
                      controls="controls"
                      autoPlay="autoplay"
                      src={dealWithUrl}
                    ></video>
                  ) : (
                    <WaterMark type={nowItem} url={dealWithUrl} />
                  )}
                </div>
                <div
                  onClick={this.handleToggleImg.bind(this, -1)}
                  style={
                    nowItem.fileIndex
                      ? { display: 'flex' }
                      : { display: 'none' }
                  }
                  className={styles.pre}
                >
                  <Icon
                    style={{ fontSize: '80px', color: '#fff' }}
                    type="left"
                  />
                </div>
                <div
                  onClick={this.handleToggleImg.bind(this, 1)}
                  style={
                    nowItem.fileIndex < (files || {}).length - 1
                      ? { display: 'flex' }
                      : { display: 'none' }
                  }
                  className={styles.next}
                >
                  <Icon
                    style={{ fontSize: '80px', color: '#fff' }}
                    type="right"
                  />
                </div>
                {!(!!files && files.length === 1 && files[0]['type'] === 2) && (
                  <div
                    className={styles.download}
                    onClick={() => this.downloadImg(dealWithUrl, nowItem.type)}
                  >
                    <Icon
                      style={{ fontSize: '50px', color: '#fff' }}
                      type="download"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.insideInfo}>
            <div className={styles.postItemHeader}>
              <div className={styles.postItemAvatar}>
                {idAdminPost ? (
                  <GroupAvatar groupId={groupId} />
                ) : (
                  <UserAvatar size={42} userId={userId} />
                )}
                <div className={styles.avatarRight}>
                  <span> {followName || ''}</span>
                  <span>
                    {' '}
                    <FormattedDate ts={createTs} />
                  </span>
                </div>
              </div>
              <div></div>
            </div>
            <div className={styles.postItemMain}>
              <div className={styles.contentBox}>
                {content && (
                  <Text
                    groupMap={groupMap}
                    members={members}
                    content={content}
                    limitLine={5}
                  />
                )}
                {/* {content && <Text content={content} limitLine={5} />} */}
              </div>
              <FeedStory
                ableToShare={this.isAbleToShare()}
                deleteCommentOfOne={this.deleteCommentOfOne}
                selfUserId={selfUserId}
                likeCount={likeCount}
                commentCount={commentCount}
                openComment={this.getCommentSwitch()}
                shareCount={shareCount}
                isLike={like}
                isInputShow={feedStoryShow}
                avatarUrl={avatarUrl}
                inputVal={inputVal}
                postId={postId}
                targetType="post"
                userData={userData}
                sharePost={sharePost}
                sharePopover={false}
                getComment={this.getComment}
                noMore={noMore}
                commentList={commentList}
                handleLike={this.handleLike}
                handleInputShow={this.toggleFeedStoryShow}
                handleInputChange={this.handleInputChange}
                handleEnter={this.handleEnter}
                handleShare={this.handleShare}
                popoverPlacement="bottom"
                postData={detailsInfo.data}
                updateCommentState={this.updateCommentState}
                identityOptions={identityOptions}
                commentIdentity={commentIdentity}
                changeCommentIdentity={this.changeCommentIdentity}
                isGroupPostAdmin={isGroupPostAdmin}
                secondCommentIdentity={secondCommentIdentity}
                changeSecondCommentIdentity={this.changeSecondCommentIdentity}
                details={true} //判断是不是详情弹窗
                getChildState={this.getChildState}
                // getMentionList={this.getMentionList}
                getCommentAttached={this.getCommentAttached}
                connectList={connectList}
                emojiKeyType={'postNotice'}
                isCanComment={this.isCanComment}
                // removeMentionList={this.removeMentionList}
                // // mentionList={mentionList}
                removerFileList={this.removerFileList}
                // 将文件传入子组件
                fileList={fileList}
                likeEmojiLike={likeEmojiLike}
                likeContent={likeContent}
                commentChange={this.commentChange}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  getChildState = (text) => {
    this.setState({
      inputVal: text,
    });
  };

  // getMentionList = (list) => {
  //   this.setState({
  //     // // mentionList: [...this.state.mentionList, list],
  //   });
  // };
  // removeMentionList = (mentionList) => {
  //   this.setState({
  //     // mentionList,
  //   });
  // };
  //获取@关联列表
  getPostConnect = () => {
    this.setState(
      {
        connectList: [],
      },
      async () => {
        const { members, detailsInfo, dispatch } = this.props;
        const { type } = detailsInfo;
        const { groupId, postType, isPublic } = detailsInfo.data;
        const connectData = {
          groupId: !!groupId ? groupId : '',
          type: !!groupId ? 0 : 1,
          groupPostType: postType,
          isPublic,
          targetType: type === 'post' ? 0 : 1,
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
            return {
              id: item,
              name: members.getIn([item, 'given_name']),
              fullName: members.getIn([item, 'full_name']),
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
              name: members.getIn([item, 'given_name']),
              fullName: members.getIn([item, 'full_name']),
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

  render() {
    return this.renderPostDetail();
  }
}

PostDetails.propTypes = {};

function mapStateToProps(state, ownProps) {
  // const userId = get(ownProps, 'detailsInfo.data.userId');
  const groupId = get(ownProps, 'detailsInfo.data.groupId');
  return {
    selfUserId: getCurrentUserId(state),
    groupMap: getGroupMap(state),
    userData: state.users.get('ownInfo'),
    employeeId: state.session.getIn(['user', 'employee_id']),
    commentLenght: getCommentMaxLenght(state),
    groupDetail: getGroupDetail(state, groupId),
    isGroupPost: Boolean(groupId),
    members: state.members.get('memberMap'),
    nowItem: state.postsPopup.get('nowItem'),
    files: state.postsPopup.get('files'),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
)(PostDetails);
