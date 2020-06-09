import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import get from 'lodash/get';
import { get, throttle } from 'lodash';
// import isFunction from 'lodash/isFunction';
import { Modal, Upload, message, Button } from 'antd';
// import ReactDom from 'react-dom';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import localforage, { setItem } from 'localforage';
import styles from './CreatePost.scss';
import Tagger from './Tagger';
import Icon from '../Icon';
import TargetSelect from './TargetSelect';
import { getToken } from '../../../utils/session';
import { getUrl, getVideoSize, getImgSize } from '../../../utils/utils';
import Mention from '../Mention';
import {
  createPost,
  openCreatePostDialog,
  editPost,
  getConnectList,
} from '../../../models/posts/actions';
import PeopleTagger from '../PeopleTagger/PeopleTagger';
import {
  getAdminGroupList,
  getMemberGroupList,
} from '../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../utils/sort';
import UserAvatar from '../UserAvatar';
import {
  getCurrentUserId,
  getSystemConfig,
} from '../../../models/session/selectors';
import { getUserDetail } from '../../../models/members/selectors';
import { getVideoDuration, transformImage } from '../../../utils/file';
// import { fromMsgText } from '../PostItem/utils';
// import ReactDom from 'react-dom';
// import classnames from 'classnames';

// const { TextArea } = Input;

// const { TextArea } = Input;

const UPLOADING = 'uploading';
const oneMByte = 1 * 1024 * 1024;

const formatSizeToMByte = (size) => {
  if (typeof size !== 'number') {
    return 0;
  }
  return Math.ceil(size / oneMByte);
};

const getInitialData = (defaultData = {}) => {
  return {
    fileList: [],
    content: '',
    previewVisible: false,
    mentionUsers: [],
    previewImage: '',
    previewVideo: '',
    groupPostType: 1, // 個人貼,
    showPeopleTagger: false,
    groupId: null,
    isPublicGroup: false, //群組是否公開
    isPublicPost: false,
    defaultValue: '',
    defaultValueCompare: '',
    typeSelectDisable: false,
    ...defaultData,
    fileIsUploading: false, //文件是否正在上传，正在上传文件的时候点击发布按钮无效
    connectList: [],
    isShow: false, //@列表是否顯示
    hasDraft: false,
    // mentionList: [],
    lastCursor: '',
    isVideoUpload: false,
    sendState: false,
  };
};

class CreatePost extends React.PureComponent {
  static propTypes = {
    defaultContent: PropTypes.string,
    defaultFiles: PropTypes.arrayOf(PropTypes.object),
    defaultMentionUsers: PropTypes.arrayOf(PropTypes.string),
    // postData: PropTypes.object.isRequired,
    groupId: PropTypes.oneOf([null, PropTypes.string]),
    groupPostType: PropTypes.number,
    postId: PropTypes.string,
    showPeopleTagger: PropTypes.bool,
    fileList: PropTypes.array,
  };

  static defaultProps = {
    defaultContent: '',
    defaultMentionUsers: [],
    defaultFiles: [],
    fileList: [],
    postId: null,
    showPeopleTagger: false,
  };

  constructor(props) {
    super(props);
    const {
      defaultContent,
      defaultMentionUsers,
      defaultFiles,
      groupId,
      groupPostType,
      showPeopleTagger,
      // fileList,
    } = props;
    const typeSelectDisable = groupId !== undefined;
    const postTypeSelectDisable = groupPostType !== undefined;
    this.state = getInitialData({
      content: defaultContent,
      mentionUsers: defaultMentionUsers,
      fileList: defaultFiles,
      typeSelectDisable,
      groupId: typeSelectDisable ? groupId : null,
      postTypeSelectDisable,
      groupPostType: postTypeSelectDisable ? groupPostType : 1,
      showPeopleTagger,
      // fileList,
    });
  }

  get isEditPost() {
    const { postId } = this.props;
    return Boolean(postId);
  }

  get currentGroupId() {
    const { typeSelectDisable, groupId: propGroupId } = this.props;
    const { groupId } = this.state;
    return typeSelectDisable ? propGroupId : groupId;
  }
  get currentGroup() {
    const { currentGroup, ownGroups } = this.props;
    const { groupId } = this.state;
    return currentGroup ? currentGroup : ownGroups.get(groupId);
  }

  openModal = () => {
    this.setState({
      isOpen: true,
    });
  };

  closeModal = (e) => {
    this.setState(getInitialData());
  };

  // onPreview = (file) => {
  //   const isImage = /image/.test(file.type);
  //   let url = file.url || getUrl(get(file, 'response.data.originUrl'));
  //   if (url && !file.preview) {
  //     file.preview = file.originUrl || URL.createObjectURL(file.originFileObj);
  //   }
  //   url = url || file.preview;
  //   this.setState({
  //     previewImage: isImage ? url : null,
  //     previewVideo: !isImage ? url : null,
  //     previewVisible: true,
  //   });
  // };

  onPreview = (file) => {
    const { previewType } = this.props;
    const { isVideoUpload } = this.state;
    //previewType: 0-編輯/打開草稿  1-創建新帖子
    //isVideoUpload 是否上傳視頻  true是  false不是
    const isImage = /image/.test(file.type);
    let url = file.url || getUrl(get(file, 'response.data.originUrl'));
    if (url && !file.preview) {
      file.preview = file.originUrl || URL.createObjectURL(file.originFileObj);
    }
    url = url || file.preview;
    //當編輯帖子或打開草稿時且不是刪除原有視頻(gif)上傳新視頻時，改變視頻(gif)播放地址
    if (previewType === 0 && !isVideoUpload) {
      url = getUrl(file.originUrl);
    }
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
    this.fileChanged = true;
    this.setState({
      fileList: fileList.filter((item) => item.uid !== file.uid),
    });
  };
  setFileStatus = (fileList) => {
    const allUploading = fileList.every((item) => item.status === UPLOADING);
    this.setState({
      fileIsUploading: allUploading ? true : false,
    });
  };
  handleChange = ({ fileList, file }) => {
    if (/video/.test(file.type) || file.type === 'image/gif') {
      this.setState({
        isVideoUpload: true,
      });
    }
    this.setFileStatus(fileList);
    this.setState({
      isOpen: true,
    });
    if (this.handleVerification(file)) {
      this.fileChanged = true;
      this.setState({
        fileList: [...fileList],
      });
    }
    const { getPostFiles, createPostType } = this.props;
    if (createPostType === 'createNew') {
      getPostFiles(this.state.fileList);
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

  //判断帖子编辑时标注人名是否修改过
  isMentionUserEdit = () => {
    const { mentionUsers: newUsers } = this.state;
    const { mentionUsers: oldUsers } = this.props;
    return newUsers.sort().join() === oldUsers.sort().join();
  };

  handleOk = throttle(
    async () => {
      const {
        fileList,
        groupPostType,
        mentionUsers,
        defaultValue,
        defaultValueCompare,
        sendState,
        // mentionList,
      } = this.state;
      const groupId = this.currentGroupId;
      const {
        submit,
        uploadThumbnail,
        postId,
        defaultContent,
        searchUpdatePost,
        // isEdit = false,
        userPostType,
        leaveMessageUserId,
      } = this.props;

      let { content } = this.state;
      /**
       * 移动端
       * 发帖：限制文本长度 2000 字
       * 留言：限制文本长度 500 字
       * 现在这个组件只有 `新建帖子` 的时候在调用所以此处先写死 限制 2000 字
       * 如果在留言等其他地方要调用将 限制的改为 变量传进来
       * 2019/12/05 编写此注释---> zy
       */
      console.info(' 文本长度限制--->>>', content.length);
      if (content.length > 2000) {
        message.warning('文本限制2000字');
        return false;
      }
      if (sendState) {
        message.info('請不要頻繁的操作！');
        return false;
      }
      this.setState({
        sendState: true,
      });
      const newContent = content;
      if (!!groupId) {
        if (
          this.isEditPost &&
          (newContent === defaultContent && !this.fileChanged) &&
          defaultValue === defaultValueCompare &&
          this.isMentionUserEdit()
        ) {
          message.warn('沒有修改貼文，無法發佈');
          this.setState({
            sendState: false,
          });
          return;
        }
      } else {
        if (
          this.isEditPost &&
          (newContent === defaultContent &&
            !this.fileChanged &&
            this.isMentionUserEdit())
        ) {
          message.warn('沒有修改貼文，無法發佈');
          this.setState({
            sendState: false,
          });
          return;
        }
      }
      // if (this.isEditPost && (content === defaultContent && !this.fileChanged)) {
      //   message.warn('沒有修改貼文，無法發佈');
      //   return;
      // }
      let newFiles = fileList
        .map((item, i) => {
          const { size, originFileObj, response, type, fileType } = item;
          if (fileType) {
            return item;
          }
          if (!get(response, 'data')) {
            return null;
          }
          const { originUrl, thumbnailUrl } = response.data;
          // const imgCheck = /image/.test(type);
          return {
            originUrl,
            thumbnailUrl,
            type,
            // type: type === 'image/gif' ? 3 : fileType || (imgCheck ? 1 : 2),
            size,
            originFileObj,
          };
        })
        .filter((item) => Boolean(item))
        .map((item) => {
          //上面編輯時type並沒有轉為 數字，改為這裡轉換
          const { type, fileType } = item;
          const imgCheck = /image/.test(type);
          return {
            ...item,
            type: type === 'image/gif' ? 3 : fileType || (imgCheck ? 1 : 2),
          };
        });

      //因为新增了GIF图，不再进行排序，直接将视频放到第一位
      let fileVideo = {};
      for (let file of newFiles) {
        if (file.type === 2) {
          fileVideo = file;
          newFiles.splice(newFiles.indexOf(file), 1);
          newFiles.unshift(fileVideo);
        }
      }

      let files = newFiles.map((item, i) => {
        return {
          ...item,
          fileIndex: i,
        };
      });

      if (!newContent && !files.length && !this.isEditPost) {
        message.warning('內容不能為空');
        this.setState({
          sendState: false,
        });
        return;
      }
      if (
        !newContent &&
        this.isEditPost &&
        this.isMentionUserEdit() &&
        defaultValue === defaultValueCompare &&
        !this.fileChanged
      ) {
        message.warning('沒有修改貼文，無法發佈');
        this.setState({
          sendState: false,
        });
        return;
      }

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
      submit({
        type: groupId ? 0 : 1,
        groupId,
        groupPostType: groupId ? groupPostType : null,
        content: newContent,
        files,
        mentionUsers,
        postId,
        isPublic: !!groupId ? (defaultValue === 'private' ? 0 : 1) : 1,
        userPostType,
        leaveMessageUserId,
      }).then((result) => {
        if (result) {
          const { closeModal } = this.props;
          // 搜索中的修改帖子
          searchUpdatePost && searchUpdatePost(result);
          sessionStorage.setItem('hasDraft', '');
          setItem('postContent', '');
          closeModal();
        }
        this.setState({
          sendState: false,
        });
      });
    },
    5000,
    { trailing: false }
  );

  groupChange = (value) => {
    const { ownGroups } = this.props;
    // const { groupPostType } = this.state;
    const postByAdmin = ownGroups.getIn([value, 'postByAdmin']);
    const isPublicGroup = !!ownGroups.getIn([value, 'isPublic']);

    let defaultValue = isPublicGroup ? 'public' : 'private';
    let newGroupPostType = null;
    if (value) {
      newGroupPostType = postByAdmin ? 0 : 1;
    }

    this.setState(
      {
        groupId: value,
        isPublicGroup,
        defaultValue,
        groupPostType: newGroupPostType,
        mentionUsers: [],
      },
      () => {
        this.getPostConnect();
      }
    );
  };

  groupPostTypeChange = (value) => {
    this.setState(
      {
        groupPostType: Number(value),
      },
      () => {
        this.getPostConnect();
      }
    );
  };

  // textChange = (e) => {
  //   this.setState({
  //     content: e.target.innerText.slice(0, 2000),
  //   });
  // };

  beforeUpload = (file, [originFileObj]) => {
    return new Promise(async (resolve, reject) => {
      const isVerification = await this.handleVerification(
        file,
        true,
        originFileObj
      );
      if (isVerification) {
        resolve(file);
      } else {
        reject();
      }
    });
    // return test;
  };

  handleVerification(file, needMessage, originFileObj) {
    const { fileList } = this.state;
    const { config } = this.props;
    const oldFileList = fileList.filter((item) => {
      return item.uid !== file.uid;
    });
    if (oldFileList.length + 1 > config.get('imageMaxNumber')) {
      needMessage &&
        message.error(`最多上傳 ${config.get('imageMaxNumber')} 張!`);
      return false;
    }
    switch (true) {
      case /image/.test(file.type):
        return this.imageVerification(file, needMessage);
      case /video/.test(file.type):
        return this.videoVerification(file, needMessage, originFileObj);

      default:
        needMessage && message.error('您只能傳照片或者影像!');
        return false;
    }
  }

  async videoVerification(file, needMessage, originFileObj) {
    const { fileList } = this.state;
    const { config } = this.props;
    const videoList = fileList.filter((item) => {
      return /video/.test(item.type) && item.uid !== file.uid;
    });
    if (videoList.length + 1 > config.get('videoMaxNumber')) {
      needMessage &&
        message.error(`您只能傳 ${config.get('videoMaxNumber')} 個影像!`);
      return false;
    }
    const duration = await getVideoDuration(
      file.originFileObj || originFileObj
    );
    if (duration > config.get('videoMaxTime')) {
      message.error(`暫不支持超過 ${config.get('videoMaxTime')}秒的視頻`);
      return false;
    }
    const lessThanMax =
      formatSizeToMByte(file.size) <= config.get('videoMaxSize');
    if (!lessThanMax) {
      needMessage &&
        message.error(`視頻大小不能超過 ${config.get('videoMaxSize')}MB!`);
      return false;
    }

    if (file.type !== 'video/mp4') {
      needMessage && message.error('請上傳 MP4 格式視頻!');
      return false;
    }
    return true;
  }

  imageVerification(file, needMessage) {
    // const { fileList } = this.state;
    const { config } = this.props;
    // const imageList = fileList.filter((item) => {
    //   return /image/.test(item.type) && item.uid !== file.uid;
    // });
    // if (imageList.length + 1 > config.get('imageMaxNumber')) {
    //   needMessage &&
    //     message.error(`最多上傳 ${config.get('imageMaxNumber')} 張圖片!`);
    //   return false;
    // }
    const lessThanMax =
      formatSizeToMByte(file.size) <= config.get('imageMaxSize');
    // if (file.type === 'image/gif') {
    //   needMessage && message.error(`暫不支持 GIF 圖片`);
    //   return false;
    // }
    if (!lessThanMax) {
      needMessage &&
        message.error(`圖片大小不能超過 ${config.get('imageMaxSize')}MB!`);
      return false;
    }
    return true;
  }

  previewFile(file) {
    if (/video/.test(file.type)) {
      return getVideoSize(file).then(({ thumbnailImage }) => {
        return URL.createObjectURL(thumbnailImage);
      });
    } else if (/image/.test(file.type)) {
      return transformImage(file).then((image) => URL.createObjectURL(image));
    }
    return Promise.resolve(URL.createObjectURL(file));
  }

  openPeopleTagger = () => {
    this.setState({
      showPeopleTagger: true,
      isOpen: true,
    });
  };

  closePeopleTagger = () => {
    this.setState({
      showPeopleTagger: false,
    });
  };

  saveTagger = (userIds) => {
    this.setState({
      mentionUsers: userIds,
    });
  };

  renderSelectMemberTag() {
    const { intl, postId } = this.props;
    const { showPeopleTagger, mentionUsers } = this.state;
    const groupId = this.currentGroupId;
    const title = intl.formatMessage({ id: 'Dialogue.MentionName' });
    return (
      <Modal
        className={styles.createpost}
        title={title}
        visible={showPeopleTagger}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        confirmLoading={false}
        footer={null}
        onCancel={this.closePeopleTagger}
      >
        {showPeopleTagger && (
          <PeopleTagger
            groupId={groupId}
            onCancel={this.closePeopleTagger}
            saveTagger={this.saveTagger}
            defaultCheckedList={mentionUsers}
            isEditPost={Boolean(postId)}
          />
        )}
      </Modal>
    );
  }

  changePostType = (value) => {
    this.setState(
      {
        defaultValue: value,
      },
      () => {
        this.getPostConnect();
      }
    );
  };

  getFileList = async () => {
    const postContent = await localforage.getItem('postContent');
    const hasDraft = Boolean(sessionStorage.getItem('hasDraft'));
    if (postContent) {
      const { content, fileList } = postContent;
      if (content || fileList.length > 0) {
        this.setState(
          {
            content,
            fileList,
            hasDraft,
          },
          () => {
            const { getPostFiles, createPostType, getPostContent } = this.props;
            if (createPostType === 'createNew') {
              getPostFiles(this.state.fileList);
              getPostContent(this.state.content);
            }
          }
        );
        // this.refs.inputContent.innerHTML = content;
      }
    }
  };

  //获取关联列表
  getPostConnect = () => {
    this.setState(
      {
        connectList: [],
      },
      async () => {
        const {
          getConnect,
          //  memberMap
        } = this.props;
        const { groupId, defaultValue } = this.state;
        let isPublic = 1;
        if (defaultValue) {
          if (defaultValue === 'public') {
            isPublic = 1;
          } else {
            isPublic = 0;
          }
        } else {
          isPublic = 1;
        }
        const connectData = {
          groupId: !!groupId ? groupId : '',
          type: !!groupId ? 0 : 1,
          groupPostType: !!groupId ? 0 : 1,
          isPublic,
          targetType: 0,
        };
        if (!groupId) {
          delete connectData.groupId;
          delete connectData.groupPostType;
        }
        const connectList = await getConnect(connectData);
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
              // name: memberMap.getIn([userId, 'given_name']),
              // fullName: memberMap.getIn([userId, 'full_name']),
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
              // name: memberMap.getIn([item, 'given_name']),
              // fullName: memberMap.getIn([item, 'full_name']),
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

  //使关联列表变为空
  setConnectList = () => {
    this.setState({
      connectList: [],
    });
  };
  // 获取子组件里面的数据的值
  getChildState = (text) => {
    const { createPostType, getPostContent } = this.props;
    this.setState(
      {
        content: text,
      },
      () => {
        if (createPostType === 'createNew') {
          getPostContent(this.state.content);
        }
      }
    );
  };
  // getMentionList = (list) => {
  //   this.setState({
  //     mentionList: [...this.state.mentionList, list],
  //   });
  // };

  componentDidMount() {
    const {
      isPublic,
      groupId,
      ownGroups,
      //currentGroup,
      createPostType,
    } = this.props;

    if (createPostType === 'createNew' && sessionStorage.getItem('hasDraft')) {
      this.getFileList();
    }

    if (this.currentGroup && this.currentGroup.postByAdmin) {
      this.groupPostTypeChange(0);
    }

    //isPublicGroup  是否為公開群組
    const isPublicGroup = !!ownGroups.getIn([groupId, 'isPublic']);
    this.setState({
      isPublicGroup,
    });
    //isPublic  是否為公開貼文
    if (!!groupId) {
      if (isPublic === 1) {
        this.setState({
          defaultValue: 'public',
          defaultValueCompare: 'public',
        });
      }
      if (isPublic === 0) {
        this.setState({
          defaultValue: 'private',
          defaultValueCompare: 'private',
        });
      } else {
        if (isPublicGroup) {
          this.setState({
            defaultValue: 'public',
            defaultValueCompare: 'public',
          });
        } else {
          this.setState({
            defaultValue: 'private',
            defaultValueCompare: 'private',
          });
        }
      }
    }

    //初始获取关联列表
    this.getPostConnect();
  }

  // // 删除@列表
  // removeMentionList = (mentionList) => {
  //   this.setState({
  //     mentionList,
  //   });
  // };

  render() {
    const {
      id,
      // msg_text,
      user = {},
      ownGroups,
      currentGroup: propsCurrentGroup,
      visible,
      closeModal,
      openVote,
      title = '建立貼文',
      selfUserId,
      defaultContent,
      isEdit,
      emojiKeyType,
      isShareData,
      leaveMessageUserId,
    } = this.props;

    const {
      fileList,
      content,
      groupPostType,
      mentionUsers,
      previewVisible,
      previewImage,
      previewVideo,
      typeSelectDisable,
      postTypeSelectDisable,
      isPublicGroup,
      defaultValue,
      // disable,
      fileIsUploading,
      connectList,
      // isShow,
      // mentionList,
    } = this.state;
    const token = getToken();
    const uploadOption = {
      action: '/fs/newsfeed_upload',
      listType: 'picture-card',
      fileList,
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
      transformFile: (file) => {
        if (/image/.test(file.type) && file.type !== 'image/gif') {
          return transformImage(file);
        }
        return file;
      },
    };
    const uoloadOption2 = {
      ...uploadOption,
      accept: 'image/jpeg,image/jpg,image/png,image/svg,video/*',
      showUploadList: false,
      listType: 'picture',
      onChange: this.handleChange,
    };
    const uoloadOption3 = {
      ...uploadOption,
      showUploadList: false,
      listType: 'picture',
      onChange: this.handleChange,
      accept: 'image/gif',
    };
    // const personalDynamics = intl.formattedMessage({ id: 'Dialogue.personalDynamics' });
    const isGroupDetail = Boolean(propsCurrentGroup);
    const username = user.username;

    return (
      <Modal
        className={styles.createpost}
        title={title}
        visible={visible}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            disabled={fileIsUploading ? true : false}
            onClick={this.handleOk}
          >
            發佈
          </Button>,
        ]}
        confirmLoading={false}
        onCancel={closeModal}
        // afterClose={this.afterClose}
      >
        <div className={styles.userinfo}>
          <div className={styles.userimg}>
            <UserAvatar userId={id || selfUserId} disable />
          </div>

          <div className={styles.status}>
            <div className={styles.avatarName}>
              <span>
                {username.length > 20
                  ? username.slice(0, 20) + '...'
                  : username}
              </span>
              <span onClick={this.openPeopleTagger}>
                <Tagger taggers={mentionUsers} />
              </span>
            </div>
            {!leaveMessageUserId && (
              <TargetSelect
                groupId={this.currentGroupId}
                groupPostType={groupPostType}
                typeDisabled={typeSelectDisable}
                postTypeDisabled={postTypeSelectDisable}
                groups={
                  isGroupDetail
                    ? [propsCurrentGroup]
                    : [...ownGroups.values()].sort(sortGroupByIndexSymbol)
                }
                checkedGroup={this.currentGroup}
                typeChange={this.groupChange}
                groupPostTypeChange={this.groupPostTypeChange}
                isPublicGroup={isPublicGroup}
                defaultValue={defaultValue}
                changePostType={this.changePostType}
              />
            )}
          </div>
        </div>
        {/* 输入框 */}

        <div
          className={classnames({
            [styles.TextArea]: true,
            [styles.show]: content,
          })}
        >
          <Mention
            onChange={this.getChildState}
            getPostConnect={this.getPostConnect}
            mentions={connectList}
            defaultValue={defaultContent}
            content={content}
            isEdit={isEdit}
            editorType={1}
            emojiKey={emojiKeyType}
          />
        </div>

        <div className={styles.imglist}>
          <Upload ref="upload" {...uploadOption}>
            {/* {fileList.length >= 9 ? null : <div>uploadButton</div>} */}
          </Upload>
          <Modal
            className={styles.previewModal}
            visible={previewVisible}
            footer={null}
            onCancel={this.closePreview}
          >
            {previewImage && (
              <img
                alt="example"
                className={styles.previewImage}
                src={getUrl(previewImage)}
              />
            )}
            {previewVideo && (
              <video
                controls="controls"
                autoPlay="autoplay"
                className={styles.previewImage}
                src={getUrl(previewVideo)}
              />
            )}
          </Modal>
        </div>

        <div className={styles.icon}>
          <span className={styles.addtext}>添加更多元素</span>
          <Upload
            ref="upload"
            {...uoloadOption2}
            className={
              !!isShareData ? styles.uploadIconShare : styles.uploadIcon
            }
            disabled={!!isShareData}
          >
            <Icon
              url={require('assets/images/icon/group-3.png')}
              text={'照片/影片'}
              marginRight="10px"
            ></Icon>
          </Upload>
          <div
            onClick={this.isEditPost || leaveMessageUserId ? null : openVote}
            className={
              this.isEditPost || leaveMessageUserId
                ? styles.voteIcon
                : styles.mouseHover
            }
          >
            <Icon
              url={require('assets/images/icon/group.png')}
              text={'投票'}
              marginRight="8px"
            ></Icon>
          </div>
          <div onClick={this.openPeopleTagger} className={styles.mouseHover}>
            <Icon
              url={require('assets/images/icon/group-2.png')}
              text={'標註人名'}
              marginRight="6px"
            />
          </div>
          <div
            onClick={this.openGif}
            className={
              !!isShareData ? styles.uploadIconShare : styles.mouseHover
            }
          >
            <Upload ref="upload" {...uoloadOption3} disabled={!!isShareData}>
              <Icon
                url={require('assets/images/gif.png')}
                text={'GIF'}
                marginRight="6px"
              />
            </Upload>
          </div>
        </div>
        {this.renderSelectMemberTag()}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const adminGroupList = getAdminGroupList(state);
  const memberGroupList = getMemberGroupList(state);
  const selfUserId = getCurrentUserId(state);
  return {
    user: getUserDetail(state, selfUserId),
    ownGroups: adminGroupList.merge(memberGroupList),
    config: getSystemConfig(state),
    selfUserId,
    memberMap: state.members.get('memberMap'),
    groupMap: state.groupInfo.get('groupMap'),
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
    submit: (param) => {
      if (param.postId) {
        return dispatch(editPost(param));
      }
      return dispatch(createPost(param));
    },
    getConnect: (data) => {
      return dispatch(getConnectList(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CreatePost));
