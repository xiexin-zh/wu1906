import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import UserAvatar from '../../../UserAvatar';
import GroupAvatar from '../../../GroupAvatar';
import CommentItem from '../CommentItem';
// import Text from '../../../Text';
import FormattedDate from '../../../FormattedDate';
// import { getCurrentUserId } from '../../../../../models/session/selectors';
import styles from './hotComment.scss';

// import { getGroupMap } from '../../../../../models/groupInfo/selectors';
import { Modal } from 'antd';
import Mention from '../../../Mention';
import ContentEdit from '../../component/ContentEdit';
const { confirm } = Modal;

class HotComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, //評論詳情彈框
      // mentionList: [], //最熱評論已@人員列表
      commentListResultBean: {},
      showHotComment: true,
      inputVal: '',
      showReplyInput: false,
      isEdit: false,
    };
  }

  //點擊最熱評論內容
  clickContent = () => {
    const {
      // getPostConnect,
      // commentListResultBean,
      // getComment,
      handleInputShow,
    } = this.props;
    // const commentId = commentListResultBean.commentId;
    handleInputShow('hotPo');
    // getPostConnect();
    // this.setState({
    //   visible: true,
    // });
  };

  //關閉評論詳情框
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    const { commentListResultBean } = this.props;
    this.setState({
      commentListResultBean,
    });
  }

  //最熱留言刪除
  hotDelete = () => {
    const { commentListResultBean } = this.state;
    const { commentId, secondCount } = commentListResultBean;
    const { deleteCommentOfOne } = this.props;
    confirm({
      title: '刪除評論',
      okText: '確定',
      cancelText: '取消',
      content: '你確定要刪除嗎？',
      onOk: () => {
        deleteCommentOfOne(commentId, secondCount);
        setTimeout(() => {
          this.setState({
            showHotComment: false,
          });
        }, 0);
      },
    });
  };

  //最熱留言點贊
  hotLike = async () => {
    const { commentListResultBean } = this.state;
    const { like, commentId } = commentListResultBean;
    let likeResult = await this.props.dispatch({
      type: 'userInfo/postChangeLike',
      payload: {
        id: commentId,
        like: !like,
        type: 1, //1:評論點贊
      },
    });
    if (likeResult.code === '200') {
      const { like, likeCount } = likeResult.data;
      this.setState({
        commentListResultBean: {
          ...this.state.commentListResultBean,
          like,
          likeCount,
        },
      });
    }
  };

  //顯示最熱留言輸入框
  showReplyOne = () => {
    this.setState({
      showReplyInput: !this.state.showReplyInput,
    });
  };

  //回覆最熱留言
  handleEnter = () => {};

  //點擊最熱留言編輯框
  hotEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  //隱藏最熱留言編輯框
  commentEditChangeHidden = () => {
    this.setState({
      isEdit: false,
    });
  };

  //
  updateCommentState = () => {};

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

  render() {
    const {
      visible,
      commentListResultBean,
      showHotComment,
      showReplyInput,
      isEdit,
    } = this.state;
    const {
      // groupMap,
      // members,
      // commentListResultBean,
      postData,
      targetType,
      isInputShow,
      handleInputShow,
      connectList,
      targetId,
    } = this.props;
    const {
      userId,
      userName,
      createTs,
      content,
      replyIdentityType,
      // like,
      // likeCount,
      // secondCount,
      commentId,
    } = commentListResultBean;
    const { groupId } = postData;
    /**
     * replyIdentityType
     * 0 管理员回复
     * 1 个人回复
     */
    if (showHotComment && commentId) {
      return (
        <div className={styles.hotComment}>
          <div className={styles.commentOne}>
            <div className={styles.oneAvatar}>
              {replyIdentityType === 1 ? (
                <UserAvatar userId={userId} size={30} />
              ) : (
                <GroupAvatar groupId={userId} size={30} />
              )}
            </div>
            <div className={styles.timeAndName}>
              <Link
                to={
                  replyIdentityType === 1
                    ? `/user/${userId}`
                    : `/groups/${userId}`
                }
              >
                <div className={styles.OneName}>{userName}</div>
              </Link>

              <div className={styles.OneTime}>
                <FormattedDate ts={createTs} />
              </div>
            </div>
          </div>
          <div className={styles.oneContent}>
            <div className={styles.contentText}>
              <ContentEdit
                content={content}
                isEditComment={isEdit}
                commentEditChangeHidden={this.commentEditChangeHidden}
                type={targetType === 'post' ? 0 : 1}
                targetId={targetId}
                commentId={commentId}
                commentLevel={1}
                updateCommentState={this.updateCommentState}
                connectList={connectList}
                clickContent={this.clickContent}
              />
            </div>
            {/* <div className={styles.hotOperate}>
              <div className={styles.operateOptions}>
                <span>
                  <span className={styles.cursor} onClick={this.hotLike}>
                    {like ? '已讚好' : '讚好'}
                  </span>
                  <span style={{ margin: '0 5px' }}>·</span>
                </span>
                <span>
                  <span className={styles.cursor} onClick={this.showReplyOne}>
                    回覆
                  </span>
                  <span style={{ margin: '0 5px' }}>·</span>
                </span>
                <span>
                  <span className={styles.cursor} onClick={this.hotEdit}>
                    編輯
                  </span>
                  <span style={{ margin: '0 5px' }}>·</span>
                </span>
                <span className={styles.cursor} onClick={this.hotDelete}>
                  刪除
                </span>
              </div>
              <div className={styles.list}>
                <span>{likeCount}個人說讚</span>
                <span>｜</span>
                <span>{secondCount || 0}個評論</span>
              </div>
            </div> */}
            {showReplyInput && (
              <div className={styles.hotInput}>
                <Mention
                  onChange={this.getChildState}
                  // getMentionList={this.getMentionList}
                  mentions={connectList}
                  handleEnter={this.handleEnter}
                  editorType={3}
                  // isClearContent={!isRepalyShow || !isInputShow}
                  emojiKey={`${commentId}_comment_edit`}
                />
              </div>
            )}
            <div className={styles.moreComment} onClick={handleInputShow}>
              {isInputShow ? '隱藏' : '查看更多留言'}
            </div>
          </div>

          <Modal
            className={styles.noticeDetail}
            width={'40%'}
            visible={visible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <div className={styles.commentBox}>
              <CommentItem
                // openComment={openComment}
                postData={postData}
                targetId={targetId}
                commentInfo={commentListResultBean}
                targetType={targetType}
                // getComment={getComment}
                // ownPost={ownPost}
                // updateCommentState={updateCommentState}
                // deleteCommentOfOne={deleteCommentOfOne}
                identityOptions={this.props.identityOptions}
                isGroupPostAdmin={this.props.isGroupPostAdmin}
                secondCommentIdentity={this.props.secondCommentIdentity}
                changeSecondCommentIdentity={
                  this.props.changeSecondCommentIdentity
                }
                groupId={groupId}
                // firstReplyIdentityType={replyIdentityType}
                // details={props.details}
                // searchDeleteCommentCount={props.searchDeleteCommentCount}
                // searchAddCommentCount={props.searchAddCommentCount}
                // isInputShow={isInputShow}
                connectList={connectList}
                // handleInputShow={handleInputShow}
                getCommentType="hotComment"
                emojiKeyType={'hotComment'}
              />
            </div>
          </Modal>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    // groupMap: getGroupMap(state),
    // members: state.members.get('memberMap'),
    // selfUserId: getCurrentUserId(state),
  };
}

export default connect(mapStateToProps)(HotComment);
