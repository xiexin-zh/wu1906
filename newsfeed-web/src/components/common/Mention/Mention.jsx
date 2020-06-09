/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';
import {
  EditorState,
  Modifier,
  // RichUtils,
  convertToRaw,
  convertFromRaw,
  SelectionState,
} from 'draft-js';
import { Button, Upload, message, Icon, Modal } from 'antd';
import classnames from 'classnames';
// import { EditorState, Modifier } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createHashtagPlugin from './hashtagPlugin/index';
import createMentionPlugin from 'draft-js-mention-plugin'; // defaultSuggestionsFilter,
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import editorStyles from './editorStyles.css';
import mentionsStyles from './mentionsStyles.css';
import hashtagStyles from './hashtagStyles.css';
import { connect } from 'dva';
import Emoji from './Emoji';
import { emitter } from '../../../utils/draftEmitter';
import { getToken } from '../../../utils/session';
import { transformImage } from '../../../utils/file';
import { getVideoSize, getUrl, getUsername } from '../../../utils/utils';
import { get, throttle } from 'lodash';
import { fromMsgText } from '../PostItem/utils';

const IMGMAX_SIZE = 1024 * 1024 * 5;
const VIDEOMAX_SIZE = 1024 * 1024 * 30;
const GIF_MAXSIZE = 1024 * 1024 * 2;
const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    isFocused, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          {mention.type === 'user' ? (
            <UserAvatar userId={mention.id} />
          ) : (
            <GroupAvatar groupId={mention.id} />
          )}
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>
            {mention.name}
          </div>
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRightIcon}>
          <img
            src={
              mention.type === 'user'
                ? require('./icon/person.png')
                : require('./icon/group.png')
            }
            alt=""
            className={mentionsStyles.suggestionIcon}
          />
        </div>
      </div>
    </div>
  );
};

const getRelativeParent = (element) => {
  if (!element) {
    return null;
  }

  const position = window
    .getComputedStyle(element)
    .getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

//@列表弹框定位
const positionSuggestions = ({ decoratorRect, state, popover, props }) => {
  const relativeParent = getRelativeParent(popover.parentElement);
  const relativeRect = {};
  let newLeft = 0;
  if (relativeParent) {
    relativeRect.scrollLeft = relativeParent.scrollLeft;
    relativeRect.scrollTop = relativeParent.scrollTop;

    const relativeParentRect = relativeParent.getBoundingClientRect();
    relativeRect.left = decoratorRect.left - relativeParentRect.left;
    relativeRect.top = decoratorRect.bottom - relativeParentRect.top;

    if (relativeParentRect.width - relativeRect.left < 200) {
      newLeft = relativeRect.left - 200;
    } else {
      newLeft = relativeRect.left;
    }
  } else {
    relativeRect.scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    relativeRect.scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    relativeRect.top = decoratorRect.bottom;
    relativeRect.left = decoratorRect.left;
  }
  const left = newLeft + relativeRect.scrollLeft;
  const top = relativeRect.top + relativeRect.scrollTop;
  let transform;
  let transition;
  if (state.isActive && props.suggestions.length > 0) {
    transform = 'scaleY(1)';
    transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
  } else if (state.isActive) {
    transform = 'scaleY(0)';
    transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
  }

  return {
    width: '250px',
    height: '205px',
    left: `${left}px`,
    top: `${top}px`,
    transform,
    transformOrigin: '1em 0%',
    transition,
  };
};
//创建一个话题插件
const hashtagPlugin = createHashtagPlugin({ theme: hashtagStyles });
const initState = () => {
  return {
    editorState: createEditorStateWithText(''),
    suggestions: [],
    mentions: [],
    isEdit: false,
    listSize: 10, //限制列表只加载10条
    showEmoji: false,
    fileList: [],
    previewImage: '',
    previewVisible: false,
    fileType: '',
    editorText: '',
    loding: false,
  };
};

class Mention extends Component {
  constructor(props) {
    super(props);
    const { mentions } = props;

    this.mentionPlugin = createMentionPlugin({
      mentions,
      entityMutability: 'IMMUTABLE',
      theme: mentionsStyles,
      positionSuggestions,
      mentionPrefix: '@',
      // supportWhitespace: true,
      getText: '',
    });
    this.state = initState();
    emitter.on(`addEmoji_${props.emojiKey}`, this._addEmoji); //表情监听处理事件  emojiKey：每个监听事件名称需要不同，需要唯一的key
  }

  //表情监听处理事件
  _addEmoji = (emoji) => {
    // e.stopPropagation();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const text = `${emoji.eng || ''}`;
    let nextEditorState = EditorState.createEmpty();
    const contentStateWithEntity = contentState.createEntity(
      'EMOJI',
      'IMMUTABLE',
      { emoji }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    if (selection.isCollapsed()) {
      const nextContentState = Modifier.insertText(
        contentState,
        selection,
        text,
        {},
        entityKey
      );
      nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'insert-characters'
      );
    } else {
      const nextContentState = Modifier.replaceText(
        contentState,
        selection,
        text
      );
      nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'insert-characters'
      );
    }
    this.setState(
      {
        editorState: nextEditorState,
        showEmoji: false,
      },
      () => {
        this.focus();
      }
    );
  };

  //点击表情按钮
  clickEmoji = () => {
    this.setState({
      showEmoji: !this.state.showEmoji,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // const { mentions } = prevState;
    return { mentions: nextProps.mentions };
  }
  get isDisabled() {
    const { fileList = [], messageLevel } = this.props;
    switch (messageLevel) {
      case 1:
        return Boolean(fileList.length);
      case 2:
        return Boolean(this.state.fileList.length);

      default:
        return Boolean(this.state.fileList.length);
    }
  }
  // 点击聚焦
  focus = () => {
    this.editor.focus();
    let value = '';
    const { mentions } = this.props;
    this.searchValue(mentions, value);
    this.setState({
      isEdit: true,
    });
  };
  // 搜索的方法
  searchValue = (mentionsVal, value) => {
    // const { mentions } = this.props;
    const newRes = new Map();
    let mentions = mentionsVal.filter(
      (item) => !newRes.has(item.id) && newRes.set(item.id, 1)
    );
    if (value) {
      let newList = [];
      if (new RegExp('[\\u4E00-\\u9FFF]+', 'g').test(value)) {
        newList = mentions.filter((item) => {
          const name = item.name || item.fullName;
          if (!name) {
            return null;
          }
          return name.indexOf(value) !== -1;
        });
      } else {
        newList = mentions
          .filter((item) => {
            const name = item.name || item.fullName || '';
            if (!name) {
              return null;
            }
            return name.toUpperCase().indexOf(value.toUpperCase()) !== -1;
          })
          .sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
      }
      this.setState({
        suggestions: newList,
      });
    } else {
      this.setState({
        suggestions: mentions,
      });
    }
  };

  onSearchChange = ({ value }) => {
    const { mentions } = this.props;
    this.searchValue(mentions, value);
  };
  componentDidMount() {
    document.addEventListener('copy', this.setCopyData, false);
    setTimeout(() => {
      this.setDefault();
      if (this.editor) {
        this.editor.focus();
      }
    }, 0);
  }

  componentWillUnmount() {
    const { emojiKey } = this.props;
    emitter.removeListener(`addEmoji_${emojiKey}`, this._addEmoji);
    // document.removeEventListener('copy', this.copyText, false);
    document.removeEventListener('copy', this.setCopyData, false);
  }

  setCopyData = (e) => {
    let selection = window.getSelection();
    e.clipboardData.setData('text/plain', selection);
    e.preventDefault();
  };

  setDefault = async () => {
    const { defaultValue, editorType } = this.props;
    if (defaultValue) {
      this.messageToLink(
        editorType === 1 ? this.changeLink(defaultValue) : defaultValue
      );
    } else if (
      //editorType==1为新建帖子
      editorType === 1 &&
      Boolean(sessionStorage.getItem('hasDraft'))
    ) {
      const postContent = await localforage.getItem('postContent');
      const { content } = postContent;
      this.messageToLink(editorType === 1 ? this.changeLink(content) : content);
    }
  };
  // 将文本拆分成各种数据然后生成对应的标签
  messageToLink = (defaultValue) => {
    let { editorState } = this.state;
    const { memberMap } = this.props;
    const newValue = this.textToLink(defaultValue, memberMap);

    const blocks = convertFromRaw(newValue);

    this.setState({
      editorState: this.moveSelectionToEnd(
        EditorState.push(editorState, blocks)
      ),
    });
  };
  // 让光标移动到最后面
  moveSelectionToEnd = (editorState) => {
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();
    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length,
    });
    return EditorState.acceptSelection(editorState, selection);
  };

  textToLink(text) {
    const { memberMap } = this.props;
    const contentState = {
      blocks: [],
      entityMap: {},
    };
    if (!memberMap) {
      return;
    }
    let entityList = [];
    let entityKey = 0;
    contentState.blocks = text
      .split('\n')
      .map((str) => {
        return {
          text: str,
          entityRanges: [],
          type: 'unstyled',
        };
      })
      .map((block) => {
        let blockText = block.text;
        const userMentionReg = RegExp(/@<=(=[\w]+)=>/g);
        const groupMention = RegExp(
          /\[([^\[\]]+)\]\(newsfeed:\/\/mention\?type=group&id=([^\(\)]+)\)/g
        );

        let result = blockText.matchAll(
          new RegExp(`${userMentionReg.source}|${groupMention.source}`, 'g')
        );

        let entityRanges = [];
        const newList = Array.from(result).map((data) => {
          if (data[1]) {
            const member = memberMap.get(data[1]);
            return {
              type: 'mention',
              mutability: 'IMMUTABLE',
              data: {
                mention: {
                  fullName: getUsername(member),
                  id: data[1],
                  name: getUsername(member),
                  type: 'user',
                },
                regexData: data,
              },
            };
          } else {
            return {
              type: 'mention',
              mutability: 'IMMUTABLE',
              data: {
                mention: {
                  fullName: data[2],
                  id: data[3],
                  name: data[2],
                  type: 'group',
                },
                regexData: data,
              },
            };
          }
        });
        entityList = [...entityList, ...newList];
        contentState.entityMap = {
          ...entityList,
        };
        if (entityList) {
          for (const iterator of newList.reverse()) {
            const mentionItem = iterator.data.mention;
            const regexDataItem = iterator.data.regexData;
            const mention =
              mentionItem.type === 'user'
                ? `@${mentionItem.name}`
                : `${mentionItem.name}`;
            const start = regexDataItem.index || 0;
            const offsetRight =
              blockText.length - (start + regexDataItem[0].length);
            entityRanges.push({
              offset: offsetRight,
              length: mention.length,
              key: 0,
            });
            blockText =
              blockText.slice(0, regexDataItem.index) +
              mention +
              blockText.slice(start + regexDataItem[0].length);
          }
          entityRanges = entityRanges.reverse().map((item) => {
            return {
              offset: blockText.length - item.offset - item.length,
              length: item.length,
              key: entityKey++,
            };
          });
        }
        return {
          text: blockText,
          entityRanges,
          type: 'unstyled',
        };
      });
    return contentState;
  }

  //替换话题内容为指定格式
  changeTag = (text) => {
    const _hashtagRegex = require('./hashtagPlugin/utils/hashtagRegex');
    // const _hashtagRegex2 = _interopRequireDefault(_hashtagRegex);
    _interopRequireDefault(_hashtagRegex);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    const newText = text.replace(
      // _hashtagRegex2.default.validHashtag, //插件里面的正则换行时有问题，改为下面自己的正则
      /(?<=[\s]|^)#(\w*[\u4e00-\u9fa5_a-zA-Z0-9]+\w*)/g,
      (item) => {
        return item.replace(
          item,
          `[${item.trim()}](newsfeed://topic?keyword=${item
            .replace(' ', '')
            .replace('#', '')})`
        );
      }
    );
    //  \[#[a-zA-Z0-9_\u4e00-\u9fa5]*\]\(newsfeed:\/\/topic\?keyword=[a-zA-Z0-9_\u4e00-\u9fa5]*\)
    return newText;
  };
  //  将固定格式转换为普通文本
  changeLink = (text) => {
    const newText = text
      .replace(
        /\[#[a-zA-Z0-9_\u4e00-\u9fa5]*\]\(newsfeed:\/\/topic\?keyword=[a-zA-Z0-9_\u4e00-\u9fa5]*\)/g,
        (item) => {
          return item.replace(/\[#[a-zA-Z0-9_\u4e00-\u9fa5]*\]/, (res) => {
            return res.replace('[#', ' #').replace(']', '');
          });
        }
      )
      .replace(
        /\(newsfeed:\/\/topic\?keyword=[a-zA-Z0-9_\u4e00-\u9fa5]*\)/g,
        ''
      );
    return newText;
  };

  onMentionChange = (editorState) => {
    const { onChange, editorType } = this.props;
    const { editorText } = this.state;
    const newText = editorState.getCurrentContent().getPlainText();
    // const currentInlineStyle = editorState.getCurrentInlineStyle();
    //比较更新前后 oldText newText  避免不必要onChange触发
    if (editorText !== '' && editorText === newText) {
      this.setState({
        editorState,
      });
      return;
    }
    // const newEditorState =
    //   currentInlineStyle.size > 0
    //     ? RichUtils.toggleInlineStyle(editorState, 'TEXT')
    //     : editorState;
    this.setState(
      {
        editorState: editorState,
        editorText: newText,
      },
      () => {
        const newCurrentContent = editorState.getCurrentContent();
        const newContent = fromMsgText(convertToRaw(newCurrentContent));
        if (onChange) {
          onChange(editorType === 1 ? this.changeTag(newContent) : newContent);
        }
      }
    );
  };
  // onAddMention = (e) => {
  //   const { getMentionList } = this.props;
  //   getMentionList(e);
  // };

  submitClick = throttle(
    async () => {
      const { handleEnter } = this.props;
      if (handleEnter) {
        let isClear = await handleEnter();
        if (isClear !== false) {
          await this.onRemove();
          await this.setState(initState());
        }
      }
      this.hideEmoji();
    },
    5000,
    { trailing: false }
  );

  //列表滚动条滑动到底端时，列表加载5条数据
  onScroll = (event) => {
    const listBoxHeight = event.target.clientHeight;
    const listContentHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    if (listContentHeight - listBoxHeight === scrollTop) {
      this.setState({
        listSize: this.state.listSize + 5,
      });
    }
  };

  handleChange = (e) => {
    const {
      fileList,
      file: { status },
    } = e;
    const { getCommentAttached, editorType, getFiles } = this.props;
    if (status === 'uploading') {
      this.setState({
        loding: true,
      });
    }
    if (status === 'done') {
      if (getFiles && editorType === 3) {
        getFiles(fileList);
      } else {
        getCommentAttached(fileList);
      }
      this.setState({
        loding: false,
      });
    }
    this.setState({
      fileList,
    });
  };

  getFileData = (file) => {
    const { userId } = this.props;
    const imgCheck = /image/.test(file.type);
    const videoCheck = /video/.test(file.type);
    const gifCheck = /image\/gif/.test(file.type);
    let type = -1;
    if (imgCheck) {
      type = 1;
    }
    if (videoCheck) {
      type = 2;
    }
    if (gifCheck) {
      type = 3;
    }
    return {
      fileIndex: 0,
      type: type,
      userId,
    };
  };
  beforeUpload = (file, [originFileObj]) => {
    return new Promise(async (resolve, reject) => {
      const isUpload = await this.handleVerification(file);
      if (isUpload) {
        resolve(file);
      } else {
        reject();
      }
    });
  };
  handleVerification = (file) => {
    const { fileList } = this.state;
    const oldFileList = fileList.filter((item) => {
      return item.uid !== file.uid;
    });
    if (oldFileList.length + 1 > 1) {
      message.error('最多上傳一個文件!');
      return false;
    }
    switch (true) {
      case /image/.test(file.type):
        return this.imageVerification(file);
      case /video/.test(file.type):
        return this.videoVerification(file);
      case /image\/gif/.test(file.type):
        return this.gifVerification(file);
      default:
        message.error('您只能傳照片或者影像!');
        return false;
    }
  };

  imageVerification = (file) => {
    if (file.size > IMGMAX_SIZE) {
      message.error(`圖片大小不能超過5MB!`);
      return false;
    }
    return true;
  };
  videoVerification = (file) => {
    if (file.size > VIDEOMAX_SIZE) {
      message.error(`視頻大小不能超過30MB!`);
      return false;
    }
    return true;
  };
  gifVerification = (file) => {
    if (file.size > GIF_MAXSIZE) {
      message.error(`GIF大小不能超過2MB!`);
      return false;
    }
  };
  previewFile = (file) => {
    if (/video/.test(file.type)) {
      return getVideoSize(file).then(({ thumbnailImage }) => {
        return URL.createObjectURL(thumbnailImage);
      });
    } else if (/image/.test(file.type)) {
      return transformImage(file).then((image) => URL.createObjectURL(image));
    }
    return Promise.resolve(URL.createObjectURL(file));
  };
  onRemove = () => {
    const {
      removeFiles,
      removerFileList,
      messageLevel,
      // removeMentionList,
    } = this.props;
    this.setState({
      fileList: [],
      loding: false,
    });
    switch (messageLevel) {
      case 1:
        removerFileList();
        break;
      case 2:
        removeFiles();
        break;
      default:
        removeFiles();
    }
    // removeMentionList([]);
  };
  hideEmoji = () => {
    this.setState({
      showEmoji: false,
    });
  };
  //预览图片的时候回调
  onPreview = (file) => {
    const originUrl = get(file, ['response', 'data', 'originUrl']);
    this.setState({
      previewVisible: true,
      previewImage: getUrl(originUrl),
      fileType: /video/.test(file.type),
    });
  };
  onCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };
  keyDownClear = (e) => {
    this.setState({
      isEdit: true,
    });
  };

  render() {
    const {
      suggestions,
      listSize,
      showEmoji,
      fileList,
      previewImage,
      previewVisible,
      fileType,
      loding,
    } = this.state;
    const token = getToken();
    const { MentionSuggestions } = this.mentionPlugin;
    const { editorType, emojiKey, absolute, isEditComment } = this.props;
    const plugins = [this.mentionPlugin, editorType === 1 ? hashtagPlugin : ''];
    const { isEdit } = this.state;
    //editorType ,  1:新建帖子； 2:分享帖子； 3:留言; 4:编辑评论
    const editorStyle = classnames({
      [editorStyles.editorComment]: editorType === 3 || editorType === 4,
      [editorStyles.editor]: editorType === 1 || editorType === 2,
    });

    const newSuggestions = suggestions.slice(0, listSize);
    const uoloadOption = {
      accept: 'image/jpeg,image/jpg,image/png,image/svg,video/*',
      showUploadList: false,
      listType: 'picture',
      onChange: this.handleChange,
      action: '/fs/newsfeed_upload',
      onPreview: this.onPreview,
      previewFile: this.previewFile,
      onRemove: this.onRemove,
      data: this.getFileData,
      fileList: fileList,
      headers: {
        Authorization: token
          ? `${token.token_type} ${token.access_token}`
          : null,
      },
      beforeUpload: this.beforeUpload,
    };
    const uoloadOption2 = {
      ...uoloadOption,
      showUploadList: true,
      listType: 'picture-card',
    };
    const uoloadOption3 = {
      ...uoloadOption,
      showUploadList: false,
      listType: 'picture',
      accept: 'image/gif',
    };
    // console.log(this.isDisabled);
    return (
      <div className={mentionsStyles.mentionBox}>
        {(editorType === 3 || editorType === 4) && showEmoji && (
          <div
            className={
              absolute
                ? mentionsStyles.emojiStyle
                : mentionsStyles.emojiStyleRelative
            }
          >
            <Emoji emojiKey={emojiKey} />
          </div>
        )}
        {(editorType === 3 || editorType === 4) && (
          <div>
            <div className={mentionsStyles.operate}>
              {/* 表情 */}
              <Icon
                onClick={this.clickEmoji}
                type="smile"
                className={mentionsStyles.emojiIcon}
              />

              <div
                onClick={this.hideEmoji}
                style={{
                  margin: '0 5px',
                  pointerEvents: isEditComment ? 'none' : 'auto',
                }}
              >
                {/* <InsertImgAndVideo isShowList={true} /> */}
                <Upload {...uoloadOption3}>
                  <Button
                    disabled={this.isDisabled}
                    className={mentionsStyles.uploadGit}
                  >
                    GIF
                  </Button>
                </Upload>
              </div>

              {/* 插入图片或者视频 */}
              <div
                style={{ pointerEvents: isEditComment ? 'none' : 'auto' }}
                onClick={this.hideEmoji}
              >
                {/* <InsertImgAndVideo isShowList={true} /> */}
                <Upload {...uoloadOption}>
                  <Button
                    disabled={this.isDisabled}
                    className={mentionsStyles.uploadImg}
                  >
                    圖片/視頻
                  </Button>
                </Upload>
              </div>
            </div>
            <Upload {...uoloadOption2}></Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.onCancel}
            >
              {fileType ? (
                <video
                  controls="controls"
                  autoPlay="autoplay"
                  src={previewImage}
                  width={'100%'}
                  height={'100%'}
                />
              ) : (
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              )}
            </Modal>
          </div>
        )}

        <div
          placeholder={this.props.isEdit || isEdit ? '' : '在想些什麼?'}
          className={editorStyle}
          onClick={this.focus}
          // onKeyUp={this.keyDownClear}
          onKeyDown={this.keyDownClear}
        >
          <Editor
            editorState={this.state.editorState}
            onChange={this.onMentionChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <MentionSuggestions
            onScroll={this.onScroll}
            onSearchChange={this.onSearchChange}
            suggestions={newSuggestions}
            entryComponent={Entry}
            // onAddMention={this.onAddMention}
          />
        </div>
        {editorType === 3 && (
          <div className={mentionsStyles.submitBox}>
            <Button
              disabled={loding}
              onClick={this.submitClick}
              className={mentionsStyles.submitBtn}
            >
              提交
            </Button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    memberMap: state.members.get('memberMap'),
    userId: state.users.get('ownId'),
  };
}
Mention.propTypes = {
  editorType: PropTypes.number,
  isEdit: PropTypes.bool,
};

export default connect(mapStateToProps)(Mention);
