import React, { PureComponent } from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { editPostComment } from '../../../../../models/userInfo/actions';
import { getGroupMap } from '../../../../../models/groupInfo/selectors';
import { Button, message, Modal } from 'antd';
import Mention from '../../../Mention/Mention';
import Text from '../../../Text';
import { getUrl } from '../../../../../utils/utils';
import classnames from 'classnames';
class ContentEdit extends PureComponent {
  static propTypes = {
    commentId: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    targetId: PropTypes.string.isRequired,
    content: PropTypes.string,
    isEditComment: PropTypes.bool,
    commentLevel: PropTypes.number,
    commentEditChangeHidden: PropTypes.func,
    updateCommentState: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      newContent: '',
      isEdit: false,
      // mentionList: [],
      // replyUserName: props.replyUserName,
      content: '',
      openModal: false,
    };
  }

  editComment = (value) => {
    this.setState({
      newContent: value.target.value.substr(0, 500),
    });
  };

  updateComment = async () => {
    let { newContent } = this.state;
    const {
      commentId,
      type,
      targetId,
      dispatch,
      content,
      commentEditChangeHidden,
      commentLevel,
      updateCommentState,
    } = this.props;
    if (newContent === content) {
      commentEditChangeHidden(commentLevel);
      return false;
    }
    if (newContent.trim().length === 0) {
      message.warn('請輸入更新內容');
      return false;
    }
    if (newContent.trim().length > 500) {
      message.info('評論字數限制在500以內');
      return false;
    }
    if (!window.navigator.onLine) {
      message.info('無網絡連接');
      return false;
    }
    // for (let item of mentionList) {
    //   let { name, type, id } = item;
    //   if (type === 'user') {
    //     newContent = newContent.replace(`@${name}`, `@<=${id}=>`);
    //   }
    //   if (type === 'group') {
    //     newContent = newContent.replace(
    //       `${name}`,
    //       `[${name}](newsfeed://mention?type=group&id=${id})`
    //     );
    //   }
    // }

    let updateResult = await dispatch(
      editPostComment({
        commentId,
        type,
        targetId,
        content: newContent,
      })
    );
    if (updateResult.code === '200') {
      const { data } = updateResult;
      this.setState({
        newContent: data.content,
        content: data.content,
        // mentionList: [],
      });
      commentEditChangeHidden(commentLevel);
      if (updateCommentState) {
        updateCommentState(data);
      }
    }
  };

  getChildState = (text) => {
    this.setState({
      newContent: text,
    });
  };

  // getMentionList = (list) => {
  //   this.setState({
  //     mentionList: [...this.state.mentionList, list],
  //   });
  // };

  componentDidMount() {
    const { content } = this.props;
    this.setState({
      newContent: content,
      content,
    });
  }
  showFile = () => {
    this.setState({
      openModal: true,
    });
  };
  onCancel = () => {
    this.setState({
      openModal: false,
    });
  };
  modalContent = (file) => {
    const { type, originUrl } = file;
    if (type === 2) {
      return (
        <video
          controls="controls"
          autoPlay="autoplay"
          src={getUrl(originUrl)}
          width={'100%'}
          height={'100%'}
        />
      );
    } else {
      return (
        <img className={styles.contentImg} alt="" src={getUrl(originUrl)} />
      );
    }
  };
  // // 删除@列表
  // removeMentionList = (mentionList) => {
  //   this.setState({
  //     mentionList,
  //   });
  // };

  render() {
    const {
      isEditComment,
      commentEditChangeHidden,
      commentLevel,
      // replyUserName,
      connectList,
      groupMap,
      members,
      commentId,
      files = [],
      clickContent, //點擊最熱留言事件
      absolute,
    } = this.props;

    const {
      // newContent,
      content,
      openModal,
      // replyUserName,
      // mentionList,
    } = this.state;

    return (
      <div className={styles.textContent}>
        {isEditComment ? (
          <>
            <Mention
              ref={(el) => (this.mentionChild = el)}
              onChange={this.getChildState}
              // getMentionList={this.getMentionList}
              mentions={connectList}
              handleEnter={this.updateComment}
              editorType={4}
              defaultValue={content}
              emojiKey={`commentEdit_${commentId}`}
              isEditComment={isEditComment}
              absolute={absolute}
              // mentionList={mentionList}
              // removeMentionList={this.removeMentionList}
            />
            <div className={styles.editBtn}>
              <Button
                onClick={() => {
                  commentEditChangeHidden(commentLevel);
                  this.setState({ newContent: content });
                }}
                className={styles.cancelBtn}
              >
                取消
              </Button>
              <Button className={styles.updateBtn} onClick={this.updateComment}>
                更新
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.content} onClick={clickContent || null}>
            <Text
              groupMap={groupMap}
              members={members}
              content={content}
              limitLine={1000}
            />
            {files.length > 0 && (
              <div
                className={classnames({
                  [styles.videoContainer]: files[0].type === 2,
                  [styles.gifContainer]: files[0].type === 3,
                })}
                onClick={this.showFile}
              >
                <img
                  className={styles.imgSize}
                  src={
                    files[0].type === 1
                      ? getUrl(files[0].originUrl)
                      : getUrl(files[0].thumbnailUrl)
                  }
                  alt=""
                />
              </div>
            )}
            {openModal && (
              <Modal
                visible={true}
                footer={null}
                onCancel={this.onCancel}
                className={styles.modalContents}
              >
                {this.modalContent(files[0])}
              </Modal>
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    groupMap: getGroupMap(state),
    members: state.members.get('memberMap'),
  };
}

export default connect(mapStateToProps)(ContentEdit);
