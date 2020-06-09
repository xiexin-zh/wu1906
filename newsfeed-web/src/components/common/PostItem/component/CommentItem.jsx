import { Comment, Tooltip, message, Modal } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import last from 'lodash/last';
import get from 'lodash/get';
import classnames from 'classnames';
import FormattedDate from '../../FormattedDate';
import { FormattedMessage } from 'react-intl';
import UserAvatar from '../../UserAvatar';
import GroupAvatar from '../../GroupAvatar';
import {
  getCommentMaxLenght,
  getCurrentUserId,
} from '../../../../models/session/selectors';
import { getGroupDetail } from '../../../../models/groupInfo/selectors';
import likeIcon from './icons/like.png';
import ContentEdit from './ContentEdit';
import LikeList from './LikeList';
import Mention from '../../Mention/Mention';
// import { getVideoSize, getImgSize } from '../../../../utils/utils';
import { getFileImg } from '../../../../utils/file';
const { confirm } = Modal;

class CommentItme extends PureComponent {
  constructor(props) {
    super(props);
    // const {
    //   commentInfo: { secondComments },
    // } = props;
    this.state = {
      isRepalyShow: false, //點擊回復按鈕  顯示隱藏回復輸入框
      inputVal: '',
      showMoreTitle: '查看其他最新回應', //顯示更多 or  沒有更多了
      commentList: [], //二級評論清單
      showMoreSize: 5, //二級評論每次加載10條
      showMoreStep: 0, //加載二級評論次數
      likeCount: 0, //一級評論點贊數
      like: false, //以及評論是否點贊
      noMore: false,
      showMore: false,
      secondCount: props.commentInfo.secondCount,
      canComment: true, //二級留言是否能留言
      firstCommentEdit: false,
      secondCommentEdit: {},
      twoLevelReplyShow: null,
      userName: '',
      valueContent: '',
      isOpenList: false,
      likeTargetId: '',
      likeType: 1,
      likeListCount: 0,
      // mentionList: [],
      mentionListThree: [],
      fileList: [],
      fisrtGetComment: false,
    };
  }

  handleReplyShow = () => {
    this.setState({
      isRepalyShow: !this.state.isRepalyShow,
      inputVal: '',
    });
  };
  handleInputChange = (e) => {
    //TODO: 字數限定
    const { commentLenght } = this.props;
    let commentValue = e.target.value;
    this.setState({
      inputVal: commentValue.substr(0, commentLenght || 500),
    });
  };

  //回復評論
  handleEnter = async (e) => {
    const { fileList } = this.state;
    const {
      targetType,
      postData: sourcePostData,
      secondCommentIdentity,
      dispatch,
      addCommentCountUpdatePostList,
      details,
      searchAddCommentCount,
      uploadThumbnail,
    } = this.props;
    let { inputVal, canComment, showMore, secondCount } = this.state;
    // 得到上传文件
    let files = await getFileImg({ fileList, uploadThumbnail });
    // inputVal = inputVal.trim();
    if (inputVal || files.length !== 0) {
      if (!window.navigator.onLine) {
        message.info('無網絡連接');
        return false;
      }
      if (!canComment) {
        return false;
      }
      if (inputVal.trim().length > 500) {
        message.info('評論字數限制在500以內');
        return false;
      }
      this.setState({
        canComment: false,
      });

      let postData = {
        userId: this.props.commentInfo.userId,
        targetId: this.props.targetId,
        beCommentUserId: this.props.commentInfo.userId,
        commentId: this.props.commentInfo.commentId,
        content: inputVal,
        type: targetType === 'post' ? 0 : 1,
        replyIdentityType: secondCommentIdentity,
        files,
      };
      let comment = await dispatch({
        type: 'userInfo/postComment',
        payload: {
          ...postData,
        },
      });
      if (comment.code === '200') {
        const newList = [...this.state.commentList];
        newList.unshift(comment.data);
        this.setState(
          {
            commentList:
              secondCount === this.state.commentList.length
                ? newList
                : showMore
                ? newList
                : newList.slice(0, 2),
            secondCount: this.state.secondCount + 1,
          },
          () => {
            addCommentCountUpdatePostList(sourcePostData);
            details &&
              dispatch({
                type: 'postsPopup/updateComment',
                payload: {
                  updateCommentType: 'add',
                },
              });
            // 搜索
            searchAddCommentCount && searchAddCommentCount(sourcePostData);
          }
        );
      }

      this.setState({
        isRepalyShow: false,
        inputVal: '',
        canComment: true,
      });
    } else {
      message.info('請輸入評論內容');
    }
  };
  //獲取二級評論清單
  getSecondComment = async (type) => {
    const size = 30;
    const { commentList, fisrtGetComment } = this.state;
    const { dispatch, commentInfo } = this.props;
    // let page = Math.floor(commentList.length / size) + 1;
    let secondPostData = {
      commentId: commentInfo.commentId,
      createTs: fisrtGetComment ? last(commentList).createTs : 0,
      size,
      orderType: 1,
      // page,
    };

    let secondComments = await dispatch({
      type: 'userInfo/secondPostComment',
      payload: {
        ...secondPostData,
      },
    });
    const newSecondComments = get(secondComments, 'data.secondCommentList', []);
    if (newSecondComments.length > 0) {
      let resList = fisrtGetComment
        ? this.state.commentList.concat(newSecondComments)
        : newSecondComments;
      const newRes = new Map();
      let newResList = resList.filter(
        (item) => !newRes.has(item.commentId) && newRes.set(item.commentId, 1)
      );
      this.setState({
        commentList:
          type === 'delete'
            ? newResList.splice(0, commentList.length + 1)
            : newResList,
        fisrtGetComment: true,
      });
    } else {
      this.setState({
        noMore: true,
      });
    }
  };

  //顯示評論編輯框
  commentEditChangeShow = (commentLevel, commentId) => {
    if (commentLevel === 1) {
      this.setState({
        firstCommentEdit: true,
      });
    } else if (commentLevel === 2) {
      this.setState({
        secondCommentEdit: { isEdit: true, commentId },
      });
    }
  };

  //隱藏評論編輯框
  commentEditChangeHidden = (commentLevel, commentId) => {
    if (commentLevel === 1) {
      this.setState({
        firstCommentEdit: false,
      });
    } else if (commentLevel === 2) {
      this.setState({
        // secondCommentEdit: false,
        secondCommentEdit: { isEdit: false, commentId },
      });
    }
  };

  //更新二級評論編輯狀態
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
  // 刪除評論
  deleteComment = () => {
    const { secondCount } = this.state;
    const {
      commentInfo: { commentId },
      deleteCommentOfOne,
    } = this.props;
    confirm({
      title: '刪除評論',
      okText: '確定',
      cancelText: '取消',
      content: '你確定要刪除嗎？',
      onOk: () => {
        deleteCommentOfOne(commentId, secondCount);
      },
    });
  };
  // 刪除二級留言
  deleteCommentOfTwo = (delId) => {
    const {
      deleteCommentCountUpdatePostList,
      postData,
      dispatch,
      details,
      searchDeleteCommentCount,
    } = this.props;
    const _this = this;
    confirm({
      title: '刪除評論',
      okText: '確定',
      cancelText: '取消',
      content: '你確定要刪除嗎？',
      onOk: () => {
        dispatch({
          type: 'posts/deleteComment',
          payload: {
            commentId: delId,
          },
        }).then((res) => {
          const newList = _this.state.commentList.filter((item) => {
            return item.commentId !== delId;
          });
          _this.setState(
            {
              commentList: newList,
              secondCount: _this.state.secondCount - 1,
            },
            () => {
              _this.state.commentList.length > 0 &&
                _this.getSecondComment('delete');
              deleteCommentCountUpdatePostList(postData);
              details &&
                dispatch({
                  type: 'postsPopup/updateComment',
                  payload: {
                    updateCommentType: 'delete',
                  },
                });
              searchDeleteCommentCount && searchDeleteCommentCount(postData);
            }
          );
        });
      },
    });
  };
  // 打开对二级留言(三级)
  openTwoLevelReply = (item) => {
    const { commentId, userName } = item;
    let newCommentId = commentId;
    if (this.state.twoLevelReplyShow === commentId) {
      newCommentId = null;
    }
    this.setState({
      twoLevelReplyShow: newCommentId,
      userName: commentId,
      valueContent: '',
    });
    // const dom = this.refs[`${commentId}changeValue`];
    // dom.innerHTML = `@${userName}`;
  };
  onChangeValue = (e) => {
    this.setState({
      valueContent: e.target.value,
    });
  };
  // 当输入框是空且按下删除的时候就清除@人名
  onKeyDown = (e) => {
    const dom = this.refs[`${this.state.userName}changeValue`];
    if (e.target.value === '' && e.keyCode === 8) {
      dom.innerHTML = '';
    }
  };

  getChildStateThree = (text) => {
    this.setState({
      valueContent: text,
    });
  };

  // getMentionListThree = (list) => {
  //   this.setState({
  //     mentionListThree: [...this.state.mentionListThree, list],
  //   });
  // };

  // 对二级回复(三级)
  twoLevelReply = async (item) => {
    const { fileList } = this.state;
    const { uploadThumbnail } = this.props;
    let files = await getFileImg({ fileList, uploadThumbnail });
    if (!window.navigator.onLine) {
      message.info('無網絡連接');
      return false;
    }
    const dom = this.refs[`${this.state.userName}changeValue`];
    if (!this.state.valueContent) {
      if (files.length === 0) {
        message.info('請輸入評論內容');
        return false;
      }
    }

    if (this.state.valueContent.trim().length > 500) {
      message.info('評論字數限制在500以內');
      return false;
    }

    const newValue = this.state.valueContent.trimRight();

    const { userId, replyIdentityType, userName } = item;
    const {
      targetType,
      targetId,
      dispatch,
      postData: sourcePostData,
      secondCommentIdentity,
      addCommentCountUpdatePostList,
      details,
      searchAddCommentCount,
    } = this.props;

    const postData = {
      targetId: targetId,
      beCommentUserId: this.props.commentInfo.userId, //传1级userid
      commentId: this.props.commentInfo.commentId,
      content: newValue,
      type: targetType === 'post' ? 0 : 1,
      replyUserId: dom.innerHTML ? userId : '',
      replyIdentityType: secondCommentIdentity,
      secondIdentityType: replyIdentityType,
      files: files,
    };
    dispatch({
      type: 'userInfo/postComment',
      payload: {
        ...postData,
      },
    }).then((res) => {
      // 关闭模态框，还原初始值
      const { secondCount, showMore } = this.state;
      // if (commentList.length === secondCount) {
      //   this.getSecondComment();
      // }
      if (res.code === '200') {
        const newList = [...this.state.commentList];
        const newData = { ...res.data, replyUserName: `@${userName}` };
        newList.unshift(newData);
        this.setState(
          {
            commentList:
              secondCount === this.state.commentList.length
                ? newList
                : showMore
                ? newList
                : newList.slice(0, 2),
            secondCount: this.state.secondCount + 1,
            fileList: [],
          },
          () => {
            this.openTwoLevelReply(item);
            addCommentCountUpdatePostList(sourcePostData);
            details &&
              dispatch({
                type: 'postsPopup/updateComment',
                payload: {
                  updateCommentType: 'add',
                },
              });
            // 搜索
            searchAddCommentCount && searchAddCommentCount(sourcePostData);
          }
        );
      }
    });
  };
  //渲染一级编辑按钮
  renderFirstEditButton = () => {
    return (
      <span onClick={() => this.commentEditChangeShow(1)}>
        {<FormattedMessage id="Post.Edit" />}
      </span>
    );
  };
  //渲染二级编辑按钮
  renderSecondEditButton = (commentId) => {
    return (
      <span
        onClick={() => this.commentEditChangeShow(2, commentId)}
        style={{ cursor: 'pointer' }}
      >
        {<FormattedMessage id="Post.Edit" />}
      </span>
    );
  };

  // 渲染一级留言删除按钮
  renderFirstDelBtn = () => {
    const { getCommentType } = this.props;
    if (getCommentType === 'hotComment') {
      return null;
    } else {
      return (
        <span>
          <span style={{ marginRight: '5px' }}>·</span>
          <span onClick={this.deleteComment} style={{ cursor: 'pointer' }}>
            <FormattedMessage id="Post.delete" />
          </span>
        </span>
      );
    }
  };

  // 渲染二级留言删除按钮
  renderSecondDelBtn = (commentId) => {
    return (
      <span
        onClick={() => this.deleteCommentOfTwo(commentId)}
        style={{ cursor: 'pointer' }}
      >
        <i style={{ margin: '0 5px' }}>·</i>
        <FormattedMessage id="Post.delete" />
      </span>
    );
  };

  cancelLikeList = () => {
    this.setState({
      isOpenList: false,
    });
  };

  getChildState = (text) => {
    this.setState({
      inputVal: text,
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
  // removeMentionListThree = (mentionList) => {
  //   this.setState({
  //     mentionListThree: mentionList,
  //   });
  // };
  getFiles = (file) => {
    this.setState({
      fileList: file,
    });
  };
  removeFiles = () => {
    this.setState({
      fileList: [],
    });
  };
  // 获取图片
  // getFileImg = async () => {
  //   if (!this.state.fileList) {
  //     return;
  //   }
  //   const { uploadThumbnail } = this.props;
  //   let file = await Promise.all(
  //     this.state.fileList.map((item) => {
  //       const {
  //         originFileObj,
  //         size,
  //         response: { data },
  //       } = item;
  //       if (/video/.test(item.type)) {
  //         return getVideoSize(originFileObj)
  //           .then(({ width, height, thumbnailImage }) => {
  //             return [
  //               {
  //                 width,
  //                 height,
  //               },
  //               thumbnailImage,
  //             ];
  //           })
  //           .then(async ([param, thumbnailImage]) => {
  //             const thumbnailUrl = await uploadThumbnail(thumbnailImage);
  //             return {
  //               ...data,
  //               ...param,
  //               size,
  //               thumbnailUrl,
  //               type: 2,
  //             };
  //           });
  //       }
  //       return getImgSize(originFileObj).then(({ width, height }) => {
  //         return {
  //           size,
  //           width,
  //           height,
  //           type: /image\/gif/.test(item.type) ? 3 : 1,
  //           ...data,
  //         };
  //       });
  //     })
  //   );
  //   return file;
  // };

  renderActions() {
    const {
      commentInfo,
      // commentLenght,
      selfUserId,
      // openComment,
      targetType,
      targetId,
      // ownId,
      identityOptions,
      isGroupPostAdmin,
      secondCommentIdentity,
      changeSecondCommentIdentity,
      groupId,
      groupDetails,
      connectList,
      isInputShow,
      emojiKeyType,
      getCommentAttached,
      absolute,
    } = this.props;
    const { name: GroupName } = groupDetails;
    const {
      userId,
      // likeCount,
      // createTs,
      // secondComments,
      // secondCount,
      replyIdentityType,
      commentId,
    } = commentInfo;

    const {
      commentList,
      isRepalyShow,
      showMoreTitle,
      noMore,
      secondCount,
      // secondCommentEdit,
      twoLevelReplyShow,
      // mentionList,
      // mentionListThree,
      // valueContent,
    } = this.state;
    const firstCommentIsOwn = selfUserId === userId;
    return [
      // 一级留言时间
      this.renderDate(),
      // 一级留言点赞
      this.renderLike(),
      // 一级留言回复
      <span key="comment-basic-reply-to" onClick={this.handleReplyShow}>
        <FormattedMessage id="Post.Reply" />
      </span>,
      // 一级留言编辑
      replyIdentityType === 1 ? (
        firstCommentIsOwn ? (
          <span>·</span>
        ) : (
          ''
        )
      ) : isGroupPostAdmin ? (
        <span>·</span>
      ) : (
        ''
      ),
      replyIdentityType === 1
        ? firstCommentIsOwn
          ? this.renderFirstEditButton()
          : ''
        : isGroupPostAdmin
        ? this.renderFirstEditButton()
        : '',

      // 一级留言删除
      replyIdentityType === 1
        ? firstCommentIsOwn
          ? this.renderFirstDelBtn()
          : ''
        : isGroupPostAdmin
        ? this.renderFirstDelBtn()
        : '',
      // 一级留言回复
      <div style={{ display: isRepalyShow ? 'block' : 'none' }}>
        <div className={styles.flex}>
          <div className={styles.flexL}>
            <div className={styles.flexLAvatar}>
              {secondCommentIdentity === 0 ? (
                <GroupAvatar size={36} groupId={groupId} />
              ) : (
                <UserAvatar size={36} userId={selfUserId} />
              )}
            </div>
          </div>
          {/* 二级留言回复身份选项 */}
          <div className={styles.flexR}>
            {isGroupPostAdmin && (
              <div className={styles.identityOptions}>
                {identityOptions.map((item) => {
                  // identityType  1:个人身份   0:管理员身份
                  return (
                    <span
                      onClick={() =>
                        changeSecondCommentIdentity(item.identityType)
                      }
                      key={item.identityType}
                      className={classnames({
                        [styles.optionsSelect]: true,
                        [styles.identityActive]:
                          item.identityType === secondCommentIdentity,
                      })}
                    >
                      {item.identityName}
                    </span>
                  );
                })}
              </div>
            )}
            {/* 二级留言回复输入框 */}
            <Mention
              getCommentAttached={getCommentAttached}
              onChange={this.getChildState}
              // getMentionList={this.getMentionList}
              mentions={connectList}
              handleEnter={this.handleEnter}
              editorType={3}
              isClearContent={!isRepalyShow || !isInputShow}
              emojiKey={`${commentId}_${emojiKeyType}`}
              getFiles={this.getFiles}
              removeFiles={this.removeFiles}
              absolute={absolute}
              // mentionList={mentionList}
              // removeMentionList={this.removeMentionList}
            />
          </div>
        </div>
      </div>,
      // 二級留言列表
      <div>
        {commentList.map((item, index) => {
          const {
            createTs,
            commentId,
            content,
            userId,
            state,
            replyUserName,
            replyIdentityType,
            files,
          } = item;
          const { secondCommentEdit } = this.state;
          const isEdit =
            commentId === secondCommentEdit.commentId
              ? secondCommentEdit.isEdit
              : false;
          const secondCommentIsOwn = userId === selfUserId;

          return (
            <div key={item.onlyKey} className={styles.secondComment}>
              <div className={styles.secondLeft}>
                {replyIdentityType === 0 ? (
                  <GroupAvatar groupId={groupId} />
                ) : (
                  <UserAvatar userId={item.userId} />
                )}
              </div>
              <div className={styles.secondRight}>
                <p className={styles.secondUsername}>
                  {replyIdentityType === 0 ? GroupName : item.userName}
                  {state === 1 && (
                    <span className={styles.hasEdit}>已編輯</span>
                  )}
                </p>
                {/* ContentEdit：留言内容组件 */}
                <span className={styles.replyUserName}>{replyUserName}</span>
                <ContentEdit
                  // replyUserName={replyUserName}
                  content={content}
                  isEditComment={isEdit}
                  commentEditChangeHidden={this.commentEditChangeHidden}
                  type={targetType === 'post' ? 0 : 1}
                  targetId={targetId}
                  commentId={commentId}
                  commentLevel={2}
                  updateCommentState={this.updateCommentState}
                  connectList={connectList}
                  files={files}
                  absolute={absolute}
                  // mentionList={mentionList}
                  // removeMentionList={this.removeMentionList}
                />
                <div>
                  {/* 时间 */}
                  <FormattedDate ts={createTs} />
                  {/* 二级点赞 */}
                  <span style={{ margin: '0 5px' }}>·</span>
                  {this.renderLikeOfTwo(item)}
                  {/* 二级点赞按钮 */}
                  <span
                    key="comment-basic-reply-to"
                    onClick={() => this.openTwoLevelReply(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <FormattedMessage id="Post.Reply" />
                  </span>
                  {/* 二级编辑按钮 */}
                  {replyIdentityType === 1 ? (
                    secondCommentIsOwn ? (
                      <span style={{ margin: '0 5px' }}>·</span>
                    ) : (
                      ''
                    )
                  ) : isGroupPostAdmin ? (
                    <span style={{ margin: '0 5px' }}>·</span>
                  ) : (
                    ''
                  )}
                  {replyIdentityType === 1
                    ? secondCommentIsOwn
                      ? this.renderSecondEditButton(commentId)
                      : ''
                    : isGroupPostAdmin
                    ? this.renderSecondEditButton(commentId)
                    : ''}
                  {/* 二级删除按钮 */}
                  {replyIdentityType === 1
                    ? secondCommentIsOwn
                      ? this.renderSecondDelBtn(item.commentId)
                      : ''
                    : isGroupPostAdmin
                    ? this.renderSecondDelBtn(item.commentId)
                    : ''}
                </div>
              </div>
              {/* 二级留言回复 */}
              <div
                style={{
                  display: commentId === twoLevelReplyShow ? 'block' : 'none',
                  width: '100%',
                }}
              >
                <div className={styles.flex}>
                  <div className={styles.flexL}>
                    <div className={styles.flexLAvatar}>
                      {secondCommentIdentity === 0 ? (
                        <GroupAvatar groupId={groupId} />
                      ) : (
                        <UserAvatar size={32} userId={selfUserId} />
                      )}
                    </div>
                  </div>

                  <div className={styles.flexR}>
                    <label
                      onChange={this.onChangeValue}
                      htmlFor={`${item.userName}`}
                    >
                      <a
                        ref={`${commentId}changeValue`}
                      >{`@${item.userName}`}</a>

                      {isGroupPostAdmin && (
                        <div className={styles.identityOptions}>
                          {identityOptions.map((item) => {
                            // identityType  1:个人身份   0:管理员身份
                            return (
                              <span
                                onClick={() =>
                                  changeSecondCommentIdentity(item.identityType)
                                }
                                key={item.identityType}
                                className={classnames({
                                  [styles.optionsSelect]: true,
                                  [styles.identityActive]:
                                    item.identityType === secondCommentIdentity,
                                })}
                              >
                                {item.identityName}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </label>
                    <Mention
                      onChange={this.getChildStateThree}
                      // getMentionList={this.getMentionListThree}
                      mentions={connectList}
                      handleEnter={() => this.twoLevelReply(item)}
                      editorType={3}
                      isClearContent={
                        !(commentId === twoLevelReplyShow) || !isInputShow
                      }
                      emojiKey={`${commentId}_${emojiKeyType}`}
                      getFiles={this.getFiles}
                      removeFiles={this.removeFiles}
                      absolute={absolute}
                      // 留言层级
                      messageLevel={2}
                      // mentionList={mentionListThree}
                      // removeMentionList={this.removeMentionListThree}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {commentList.length < secondCount && !noMore && (
          <div className={styles.secondMore}>
            <span onClick={this.showMoreSecondComment}>{showMoreTitle}</span>
          </div>
        )}
      </div>,
    ];
  }

  //顯示更多二級評論
  showMoreSecondComment = () => {
    this.setState({
      showMore: true,
    });
    this.getSecondComment();
  };

  renderDate() {
    const { commentInfo } = this.props;
    const { createTs } = commentInfo;
    return (
      <>
        <FormattedDate ts={createTs} />
        {<span style={{ marginLeft: '10px' }}>·</span>}
      </>
    );
  }
  // 一级点赞
  renderLike() {
    const { commentInfo } = this.props;
    const { commentId } = commentInfo;
    const { likeCount, like } = this.state;
    return (
      <span key="comment-basic-like">
        <i onClick={this.likeBtn} className={styles.firstLikeBtn}>
          <FormattedMessage id={like ? 'Post.Liked' : 'Post.Like'} />
        </i>
        {likeCount > 0 && <span style={{ margin: '0 5px' }}>·</span>}
        {likeCount > 0 && (
          <Tooltip title="Like">
            {/* <Icon type="like" /> */}
            <img
              src={likeIcon}
              alt=""
              className={styles.firstLikeIcon}
              onClick={() =>
                this.likeCountClick({ targetId: commentId, type: 1, likeCount })
              }
            />
          </Tooltip>
        )}
        {likeCount > 0 && <span style={{ margin: '0 5px' }}>·</span>}
        {likeCount > 0 && (
          <span
            className={styles.firstLikeCount}
            onClick={() =>
              this.likeCountClick({ targetId: commentId, type: 1, likeCount })
            }
          >
            {likeCount}
          </span>
        )}
        {'・'}
      </span>
    );
  }

  //點擊點贊數量列表顯示
  likeCountClick = (payload) => {
    const { targetId, type, likeCount } = payload;
    this.setState({
      isOpenList: true,
      likeTargetId: targetId,
      likeType: type,
      likeListCount: likeCount,
    });
  };

  //一级點贊功能
  likeBtn = async () => {
    const { commentId } = this.props.commentInfo;
    const { like } = this.state;

    let likeData = {
      id: commentId,
      like: !like,
      type: 1,
    };

    let likeResult = await this.props.dispatch({
      type: 'userInfo/postChangeLike',
      payload: {
        ...likeData,
      },
    });

    if (likeResult.code === '200') {
      this.setState({
        likeCount: likeResult.data.likeCount,
        like: likeResult.data.like,
      });
    }
  };

  // 二级点赞渲染
  renderLikeOfTwo = (item) => {
    const { likeCount, like, commentId } = item;
    return (
      <span key="comment-basic-like">
        <i
          onClick={() => this.likeBtnOfTwo(item)}
          className={styles.secondLikeBtn}
        >
          <FormattedMessage id={like ? 'Post.Liked' : 'Post.Like'} />
        </i>
        {likeCount > 0 && '・'}
        {likeCount > 0 && (
          <Tooltip title="Like">
            {/* <Icon type="like" /> */}
            <img
              src={likeIcon}
              alt=""
              className={styles.secondLikeIcon}
              onClick={() =>
                this.likeCountClick({ targetId: commentId, type: 1, likeCount })
              }
            />
          </Tooltip>
        )}
        {likeCount > 0 && '・'}
        {likeCount > 0 && (
          <span
            className={styles.secondLikeCount}
            onClick={() =>
              this.likeCountClick({ targetId: commentId, type: 1, likeCount })
            }
          >
            {likeCount}
          </span>
        )}
        {'・'}
      </span>
    );
  };
  // 二级点赞功能
  likeBtnOfTwo = (item) => {
    const { dispatch } = this.props;
    const { commentId, like } = item;
    dispatch({
      type: 'userInfo/postChangeLike',
      payload: {
        id: commentId,
        like: !like,
        type: 1,
      },
    }).then((res) => {
      if (res.code === '200') {
        const newList = this.state.commentList.map((i) => {
          if (i.commentId === commentId) {
            i.like = res.data.like;
            i.likeCount = res.data.likeCount;
          }
          return i;
        });
        this.setState({
          commentList: newList,
        });
      }
    });
  };

  //关闭留言的时候清空回复框内的内容
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { isInputShow } = nextProps;
  //   // const { valueContent, inputVal } = prevState;
  //   if (!isInputShow) {
  //     return {
  //       valueContent: '',
  //       inputVal: '',
  //     };
  //   }
  //   return null;
  // }

  //获取最热评论的二级留言
  getHotSecondComment = async () => {
    const size = 3;
    const { commentList } = this.state;
    const { dispatch, commentInfo } = this.props;
    const { commentId, secondCount } = commentInfo;
    const secondPostData = {
      commentId,
      size,
      orderType: 1,
    };

    const getResult = await dispatch({
      type: 'userInfo/secondPostComment',
      payload: {
        ...secondPostData,
      },
    });
    if (getResult.code === '200') {
      const newSecondComments = get(getResult, 'data.secondCommentList', []);
      this.setState({
        commentList:
          getResult.data.secondCommentList.length > 2
            ? commentList.concat(newSecondComments).splice(0, 2)
            : commentList.concat(newSecondComments),
        secondCount,
      });
    }
  };

  componentDidMount() {
    const { commentInfo, getCommentType } = this.props;
    const { secondComments, like, likeCount } = commentInfo;
    if (getCommentType === 'hotComment') {
      this.getHotSecondComment();
    } else {
      if (secondComments) {
        this.setState({
          commentList: [...this.state.commentList, ...secondComments],
        });
      }
    }

    this.setState({
      like,
      likeCount,

      // secondCount,
    });
  }

  render() {
    const {
      userName,
      userId,
      content,
      // secondComments,
      // avatarUrl,
      // likeCount,
      commentId,
      state,
      files,
    } = this.props.commentInfo;
    const {
      firstCommentEdit,
      isOpenList,
      likeTargetId,
      likeType,
      likeListCount,
    } = this.state;
    const {
      targetType,
      targetId,
      firstReplyIdentityType,
      groupId,
      groupDetails,
      connectList,
      removerFileList,
      absolute,
      popularCommentId,
    } = this.props;
    const { name: GroupName } = groupDetails;
    // console.log(files[0]);
    return (
      <div
        id={commentId === popularCommentId ? popularCommentId : ''}
        className={styles.commentWrapper}
      >
        <Comment
          actions={this.renderActions()}
          author={
            <div>
              <span>
                {firstReplyIdentityType === 0
                  ? GroupName.length > 20
                    ? GroupName.substr(0, 20) + '...'
                    : GroupName
                  : userName}
              </span>
              {state === 1 && <span className={styles.isEdit}>已編輯</span>}
            </div>
          }
          avatar={
            firstReplyIdentityType === 0 ? (
              <GroupAvatar groupId={groupId} />
            ) : (
              <UserAvatar userId={userId} />
            )
          }
          // content={<p>{content}</p>}
          content={
            <ContentEdit
              content={content}
              isEditComment={firstCommentEdit}
              commentEditChangeHidden={this.commentEditChangeHidden}
              type={targetType === 'post' ? 0 : 1}
              targetId={targetId}
              commentId={commentId}
              commentLevel={1}
              updateCommentState={this.props.updateCommentState}
              connectList={connectList}
              files={files}
              removerFileList={removerFileList}
              absolute={absolute}
            />
          }
        ></Comment>

        {isOpenList && (
          <LikeList
            isOpenList={isOpenList}
            cancelList={this.cancelLikeList}
            targetId={likeTargetId}
            type={likeType}
            likeCount={likeListCount}
          />
        )}
      </div>
    );
  }
}
function mapStateToProps(state, ownState) {
  const { groupId } = ownState;
  return {
    // ownInfo: state.users.get('ownInfo'),
    commentLenght: getCommentMaxLenght(state),
    selfUserId: getCurrentUserId(state),
    // ownId: state.users.get('ownId'),
    groupDetails: getGroupDetail(state, groupId),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    deleteCommentCountUpdatePostList: (postData) => {
      // 删除留言完成之后更新帖子
      dispatch({
        type: 'posts/deleteCommentCountUpdatePostList',
        payload: { postData },
      });
    },
    addCommentCountUpdatePostList: (postData) => {
      // 留言完成之后更新帖子
      dispatch({
        type: 'posts/addCommentCountUpdatePostList',
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
)(CommentItme);
