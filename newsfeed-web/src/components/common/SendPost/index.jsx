import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { v4 as uuid } from 'uuid';
import { injectIntl } from 'react-intl';
import { Modal, message } from 'antd';

import localforage from 'localforage';

import SendVote from './SendVote';
import SendMessage from './SendMessage';
import CreatePost from '../CreatePost';
import Icons from './SendMessage/components/icon';
import styles from './index.scss';
import { getToken } from '../../../utils/session';
import {
  createPost,
  openCreatePostDialog,
} from '../../../models/posts/actions';
import { getImgSize, getVideoSize, getUrl } from '../../../utils/utils';

import {
  getAdminGroupList,
  getMemberGroupList,
} from '../../../models/groupInfo/selectors';
const { confirm } = Modal;
const getInitialData = () => {
  return {
    isOpen: false,
    fileList: [],
    previewImage: '',
    previewVisible: false,
    isUpload: true,
    groupId: '',
    content: '',
    groupPostType: 1, // 個人貼,
    isOpenVote: false,
    showPeopleTagger: false,
    mentionedUsersId: [],
    mentionList: [],
  };
};

const MAX_VIDEO_SIZE = 30 * 1024 * 1024;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_FILE_COUNT = 9;
const contentKey = btoa('postContent');

class SendPost extends Component {
  static propTypes = {
    setSyncTs: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = getInitialData();
  }

  get currentGroupId() {
    const { currentGroup } = this.props;
    const { groupId } = this.state;
    return currentGroup ? currentGroup.groupId : groupId;
  }
  get currentGroup() {
    const { currentGroup, ownGroups } = this.props;
    const { groupId } = this.state;
    return currentGroup ? currentGroup : ownGroups.get(groupId);
  }

  openModal = () => {
    this.setState({
      isOpen: true,
      showPeopleTagger: false,
    });
  };
  closeModal = (e) => {
    const { content, fileList } = this.state;
    if (e) {
      const tagName = e.currentTarget.tagName;
      if (tagName === 'DIV') {
        if (content || fileList.length > 0) {
          this.savaPost();
        } else {
          confirm({
            title: '是否關閉?',
            okText: '確定',
            cancelText: '取消',
            onOk: () => {
              this.setState(getInitialData());
            },
          });
        }
      } else {
        if (content || fileList.length > 0) {
          this.savaPost();
        } else {
          this.setState({
            isOpen: false,
          });
          localforage.setItem('postContent', '');
          sessionStorage.setItem('hasDraft', '');
        }
      }
    } else {
      this.setState(getInitialData());
    }
  };

  //发帖返回草稿提示
  savaPost = () => {
    confirm({
      title: '是否存為草稿?',
      okText: '存為草稿',
      cancelText: '放棄發布',
      onOk: async () => {
        let { content, fileList, mentionList } = this.state;
        const { uploadThumbnail } = this.props;
        let files = fileList
          .map((item, i) => {
            const { size, originFileObj, response, type, fileType } = item;
            if (fileType) {
              return item;
            }
            if (!get(response, 'data')) {
              return null;
            }
            const { originUrl, thumbnailUrl } = response.data;
            const imgCheck = /image/.test(type);
            return {
              originUrl,
              thumbnailUrl,
              type: type === 'image/gif' ? 3 : fileType || (imgCheck ? 1 : 2),
              size,
              originFileObj,
            };
          })
          .filter((item) => Boolean(item))
          .sort((a, b) => b.type - a.type)
          .map((item, i) => {
            return {
              ...item,
              fileIndex: i,
              uid: uuid(),
            };
          });
        files = await Promise.all(
          files.map((item) => {
            const { originFileObj, fileType, ...param } = item;
            if (fileType) {
              return {
                ...item,
                type: fileType,
              };
            }
            if (item.type === 2) {
              return getVideoSize(originFileObj)
                .then(({ width, height, thumbnailImage }) => {
                  return [
                    {
                      ...param,
                      width,
                      height,
                    },
                    thumbnailImage,
                  ];
                })
                .then(async ([param, thumbnailImage]) => {
                  const thumbnailUrl = await uploadThumbnail(thumbnailImage);
                  return {
                    ...param,
                    thumbnailUrl,
                    url: thumbnailUrl,
                  };
                });
            }
            return getImgSize(originFileObj).then(({ width, height }) => {
              return {
                ...param,
                width,
                height,
              };
            });
          })
        );
        const newFilesList = files.map((item, index) => {
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
            // type: item.type === 1 ? 'image/png' : 'video/mp4',
            type,
            fileType: item.type,
          };
        });
        //去除@的名称
        for (let item of mentionList) {
          let { name } = item;
          content = content.replace(`@${name}`, ``);
        }
        const postContent = {
          content: content.trimRight(),
          fileList: newFilesList,
        };
        //存草稿
        localforage.setItem('postContent', postContent, function() {
          message.success('存入草稿成功');
        });
        sessionStorage.setItem('hasDraft', true);
        this.closeModal();
      },
      onCancel: () => {
        localforage.setItem('postContent', '', function() {
          sessionStorage.setItem('hasDraft', '');
          console.log('清除草稿成功');
        });
        this.closeModal();
        this.setState(getInitialData());
      },
    });
  };

  //獲取發帖文本/附件內容
  getPostContent = (content) => {
    this.setState({
      content,
    });
  };
  getPostFiles = (fileList) => {
    this.setState({
      fileList,
    });
  };

  onPreview = (file) => {
    const isImage = /image/.test(file.type);
    let url = getUrl(get(file, 'response.data.originUrl'));
    if (url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    url = url || file.preview;
    this.setState({
      previewImage: isImage ? url : null,
      previewVideo: !isImage ? url : null,
      previewVisible: true,
    });
  };

  closePreview = () =>
    this.setState({
      previewImage: null,
      previewVideo: null,
      previewVisible: false,
    });

  onRemove = (file) => {
    const { fileList } = this.state;
    this.setState({
      fileList: fileList.filter((item) => item.uid !== file.uid),
    });
  };

  handleChange = ({ fileList, file }) => {
    this.setState({
      isOpen: true,
    });
    if (this.handleVerification(file)) {
      this.setState({
        fileList,
      });
    }
  };

  getFileData = (file) => {
    const { id } = this.props;
    const imgCheck = /image/.test(file.type);
    const videoCheck = /video/.test(file.type);
    let type = -1;
    if (imgCheck) {
      type = 1;
    }
    if (videoCheck) {
      type = 2;
    }
    return {
      fileIndex: 0,
      type: type,
      userId: id,
    };
  };

  handleOk = async () => {
    const { fileList, groupPostType, mentionedUsersId } = this.state;
    let { content } = this.state;
    content = content.trim();
    const groupId = this.currentGroupId;
    const { createPost, uploadThumbnail } = this.props;
    let files = fileList
      .map((item, i) => {
        const { size, originFileObj, response, type } = item;
        if (!response.data) {
          return null;
        }
        const { originUrl, thumbnailUrl } = response.data;
        const imgCheck = /image/.test(type);
        return {
          originUrl,
          thumbnailUrl,
          type: imgCheck ? 1 : 2,
          size,
          originFileObj,
        };
      })
      .filter((item) => Boolean(item))
      .sort((a, b) => b.type - a.type)
      .map((item, i) => {
        return {
          ...item,
          fileIndex: i,
        };
      });
    if (!content && !files.length) {
      message.warning('內容不能為空');
      return;
    }
    files = await Promise.all(
      files.map((item) => {
        const { originFileObj, ...param } = item;
        if (item.type === 2) {
          return getVideoSize(originFileObj)
            .then(({ width, height, thumbnailImage }) => {
              return [
                {
                  ...param,
                  width,
                  height,
                },
                thumbnailImage,
              ];
            })
            .then(async ([param, thumbnailImage]) => {
              const thumbnailUrl = await uploadThumbnail(thumbnailImage);
              return {
                ...param,
                thumbnailUrl,
              };
            });
        }
        return getImgSize(originFileObj).then(({ width, height }) => {
          return {
            ...param,
            width,
            height,
          };
        });
      })
    );
    createPost({
      type: groupId ? 0 : 1,
      groupId,
      groupPostType: groupId ? groupPostType : null,
      content,
      files,
      mentionedUsersId,
    }).then((isSuccessful) => {
      if (isSuccessful) {
        this.setState(getInitialData());
      }
    });
  };

  groupChange = (value) => {
    const { ownGroups } = this.props;
    const { groupPostType } = this.state;
    const postByAdmin = ownGroups.getIn([value, 'postByAdmin']);
    let newGroupPostType = null;
    if (value) {
      newGroupPostType = postByAdmin ? groupPostType : 1;
    }
    this.setState({
      groupId: value,
      groupPostType: newGroupPostType,
      mentionedUsersId: [],
    });
  };

  groupPostTypeChange = (value) => {
    this.setState({
      groupPostType: Number(value),
    });
  };

  textChange = (e) => {
    this.setState({
      content: e.target.value.slice(0, 2000),
    });
  };

  beforeUpload = (file) => {
    if (!this.handleVerification(file, true)) {
      return false;
    }
  };

  handleVerification(file, needMessage) {
    const { fileList } = this.state;
    if (fileList.length >= MAX_FILE_COUNT) {
      needMessage && message.error('最多上傳九張圖片!');
      return false;
    }
    switch (true) {
      case /image/.test(file.type):
        return this.imageVerification(file, needMessage);
      case /video/.test(file.type):
        return this.videoVerification(file, needMessage);

      default:
        needMessage && message.error('您只能傳照片或者影像!');
        return false;
    }
  }

  videoVerification(file, needMessage) {
    const { fileList } = this.state;
    const hasVideo = fileList.some((item) => /video/.test(item.type));
    if (hasVideo) {
      needMessage && message.error('您只能傳一個影像!');
      return false;
    }
    const lessThanMax = file.size < MAX_VIDEO_SIZE;
    if (!lessThanMax) {
      needMessage && message.error('視頻大小不能超過 30MB!');
      return false;
    }

    if (file.type !== 'video/mp4') {
      needMessage && message.error('請上傳 MP4 格式視頻!');
      return false;
    }
    return true;
  }

  imageVerification(file, needMessage) {
    const lessThanMax = file.size < MAX_IMAGE_SIZE;
    if (!lessThanMax) {
      needMessage && message.error('圖片大小不能超過 2MB!');
      return false;
    }
    return true;
  }

  previewFile(file) {
    if (/video/.test(file.type)) {
      return getVideoSize(file).then(({ thumbnailImage }) => {
        return URL.createObjectURL(thumbnailImage);
      });
    }

    return Promise.resolve(URL.createObjectURL(file));
  }

  toSendVote = () => {
    this.setState({
      isOpenVote: true,
    });
  };

  openPeopleTagger = () => {
    this.setState({
      showPeopleTagger: true,
      isOpen: true,
    });
  };

  openVotePeopleTagger = () => {
    this.setState({
      showPeopleTagger: true,
      isOpenVote: true,
    });
  };

  openVote = () => {
    this.closeModal();
    this.toSendVote();
  };

  closePeopleTagger = () => {
    this.setState({
      showPeopleTagger: false,
    });
  };

  saveTagger = (userIds) => {
    this.setState({
      mentionedUsersId: userIds,
    });
  };

  render() {
    const {
      id,
      msg_text,
      head_text,
      user,
      currentGroup: propsCurrentGroup,
      groupType,
      userPostType,
      leaveMessageUserId,
    } = this.props;
    const { nickname, given_name, full_name, name } = user.toJS();
    const { fileList, isOpen, showPeopleTagger } = this.state;
    const token = getToken();

    const uploadOption = {
      action: '/fs/newsfeed_upload',
      listType: 'picture-card',
      fileList: fileList,
      onPreview: this.onPreview,
      onRemove: this.onRemove,
      data: this.getFileData,
      headers: {
        Authorization: token
          ? `${token.token_type} ${token.access_token}`
          : null,
      },
      beforeUpload: this.beforeUpload,
      previewFile: this.previewFile,
    };
    const uoloadOption2 = {
      ...uploadOption,
      showUploadList: false,
      listType: 'picture',
      onChange: this.handleChange,
    };
    // const personalDynamics = intl.formattedMessage({ id: 'Dialogue.personalDynamics' });

    const username = nickname || given_name || full_name || name || '';
    return (
      <div className={styles.sendmsg}>
        {/* 發佈動態 */}
        <div>
          <div className={styles.panelMainTop}>
            <div>{head_text}</div>
          </div>
          <div onClick={this.openModal} className={styles.panelMain_body}>
            <SendMessage id={id} msg_text={msg_text}></SendMessage>
          </div>
          <div className={styles.iconlist}>
            <div onClick={this.openModal} className={styles.mouseHover}>
              <Icons
                url={require('assets/images/icon/group-3.png')}
                text={'照片/影片'}
                marginRight="10px"
              ></Icons>
            </div>
            {!leaveMessageUserId && (
              <div onClick={this.toSendVote} className={styles.mouseHover}>
                <Icons
                  url={require('assets/images/icon/group.png')}
                  text={'投票'}
                  marginRight="8px"
                ></Icons>
              </div>
            )}

            <div onClick={this.openPeopleTagger} className={styles.mouseHover}>
              <Icons
                url={require('assets/images/icon/group-2.png')}
                text={'標註人名'}
                marginRight="6px"
              />
            </div>
            <div onClick={this.openModal} className={styles.mouseHover}>
              <Icons
                url={require('assets/images/gif.png')}
                text={'GIF'}
                marginRight="6px"
              />
            </div>
          </div>
        </div>
        {isOpen && (
          <CreatePost
            visible={isOpen}
            showPeopleTagger={showPeopleTagger}
            id={id}
            currentGroup={propsCurrentGroup}
            groupId={get(propsCurrentGroup, 'groupId')}
            username={username}
            closeModal={this.closeModal}
            openModal={this.openModal}
            openVote={this.openVote}
            msg_text={msg_text}
            getPostContent={this.getPostContent}
            getPostFiles={this.getPostFiles}
            contentKey={contentKey}
            createPostType={'createNew'}
            previewType={sessionStorage.getItem('hasDraft') ? 0 : 1}
            emojiKeyType={'createPost'}
            userPostType={userPostType}
            leaveMessageUserId={leaveMessageUserId ? leaveMessageUserId : null}
          />
        )}
        {this.state.isOpenVote && (
          <SendVote
            groupType={groupType}
            user={user}
            id={id}
            currentGroup={propsCurrentGroup}
            username={username}
            isOpenVote={this.state.isOpenVote}
            closeModal={this.closeModal}
            closePeopleTagger={this.closePeopleTagger}
            openModal={this.openModal}
            uploads={uoloadOption2}
          ></SendVote>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const adminGroupList = getAdminGroupList(state);
  const memberGroupList = getMemberGroupList(state);
  return {
    user: state.session.get('user'),
    ownGroups: adminGroupList.merge(memberGroupList),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectPeopleTagger: () => {
      dispatch(openCreatePostDialog());
    },
    uploadThumbnail: (thumbnailImage) => {
      return dispatch({
        type: 'posts/uploadThumbnail',
        payload: thumbnailImage,
      });
    },
    createPost: (param) => {
      return dispatch(createPost(param));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SendPost));
