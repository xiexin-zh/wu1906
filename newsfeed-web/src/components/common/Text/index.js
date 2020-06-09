import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import { connect } from 'dva';
import styles from './Text.scss';
// import reactDom from 'react-dom';
import { isFunction } from 'lodash';
import { withRouter } from 'dva/router';
import { msgToArr } from '../../../utils/message';
import { wechatEmoji } from '../../../assets/emoji';
import emojiStyle from '../../../assets/emoji/index.css';
// import { getUsername } from '../../../utils/utils';
const FONT_SIZE = 16;

class Text extends React.PureComponent {
  static propTypes = {
    content: PropTypes.string,
    limitLine: PropTypes.number,
  };

  static defaultProps = {
    limitLine: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMoreBtn: false,
      showAllContent: false,
    };
    this.lastDom = null;
  }

  componentDidMount() {
    const { limitLine } = this.props;
    if (this.el && this.el.scrollHeight > this.lineHeight * limitLine) {
      this.setState({
        showMoreBtn: true,
      });
    }
    // this.contentText.addEventListener('click', this.toLinkPage)
  }

  handleMoreShow = (event) => {
    event.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();
    const { showAllContent } = this.state;
    this.setState({
      showAllContent: !showAllContent,
    });
  };

  get lineHeight() {
    return 1.25 * FONT_SIZE;
  }
  componentDidUpdate(prevProps) {
    const { limitLine, content } = this.props;
    if (content !== prevProps.content) {
      if (this.el && this.el.scrollHeight > this.lineHeight * limitLine) {
        this.setState({
          showMoreBtn: true,
        });
      } else {
        this.setState({
          showMoreBtn: false,
        });
      }
    }
  }

  getTextBoxStyle() {
    const { limitLine } = this.props;
    const { showAllContent } = this.state;
    return {
      fontSize: `${FONT_SIZE}px`,
      lineHeight: `${this.lineHeight}px`,
      maxHeight: showAllContent ? 'none' : `${this.lineHeight * limitLine}px`,
      display: 'flex',
    };
  }
  // 将每个匹配的分成数组然后替换里面的内容
  renderContentEmoji() {
    const { content } = this.props;
    const txtReg = new RegExp(' ', 'g');
    let text = content.replace(txtReg, '&nbsp;&nbsp;');
    const textToArr = msgToArr(text);

    return textToArr;
  }
  msgToContent(content) {
    if (!content) {
      return;
    }
    let { members } = this.props;
    const userMentionReg = RegExp(/@<=(=[\w]+)=>/g);
    const groupMention = RegExp(
      /\[([^\[\]]+)\]\(newsfeed:\/\/mention\?type=([^\(\)]+)&id=([^\(\)]+)\)/g
    );
    const hashtagReg = /(\[([^\[\]]+)\]\(newsfeed:\/\/([^\(\)]+)\?keyword=([^\[\]]+)\))/g;
    if (!isFunction(content.matchAll)) {
      return;
    }

    let result = content.matchAll(
      new RegExp(
        `${userMentionReg.source}|${groupMention.source}|${hashtagReg.source}`,
        'g'
      )
    );
    let newList = [];
    newList = Array.from(result);
    if (newList) {
      newList.forEach((item) => {
        if (item[1]) {
          const mention = members.get(item[1]);
          if (!mention) {
            return null;
          }
          const name =
            mention.given_name || mention.givenName || mention.username;

          content = content.replace(
            `@<=${mention.id}=>`,
            `<a data-type="user" data-url=${mention.id} >@${name}</a>`
          );
          // href='/user/${mention.id}
        } else if (item[3] === 'group') {
          if (!item[4]) {
            return null;
          }
          content = content.replace(
            `[${item[2]}](newsfeed://mention?type=group&id=${item[4]})`,
            `<a data-type="groups" data-url=${item[4]}>${item[2]}</a>`
          );
        } else if (item[7] === 'topic') {
          content = content.replace(
            `[#${item[8]}](newsfeed://topic?keyword=${item[8]})`,
            `<a data-type="topic" data-url=${item[8]}>#${item[8]}</a>`
          );
        }
      });
    }
    return content;
  }
  toLinkPage = (e) => {
    const type = e.target.getAttribute('data-type');
    const content = e.target.getAttribute('data-url');
    if (!type || !content) {
      return;
    }
    const { history } = this.props;
    // eslint-disable-next-line default-case
    switch (type) {
      case 'user':
        history.push(`/user/${content}`);
        break;
      case 'groups':
        history.push(`/groups/${content}`);
        break;
      case 'topic':
        history.push(`/search?q=%23${content}`);
        break;
    }
  };

  render() {
    // const {
    //   //  content,
    //   //   members,
    //   history,
    // } = this.props;

    const { showAllContent, showMoreBtn } = this.state;
    const messageClassName = classnames({
      [styles.wrapper]: true,
      [styles.showAllContent]: showAllContent,
    });
    return (
      <div
        className={messageClassName}
        style={{
          marginBottom: this.renderContentEmoji()[0].text
            ? `${this.lineHeight}px`
            : 0,
        }}
      >
        {this.renderContentEmoji()[0].text && (
          <div
            ref="constnet"
            className={styles.textBox}
            style={this.getTextBoxStyle()}
          >
            <div
              ref={(el) => {
                this.el = el;
              }}
            >
              {this.renderContentEmoji().map((item, index) => {
                switch (item.type) {
                  case 'normal':
                    return (
                      <span
                        key={index}
                        style={{
                          margin: 0,
                        }}
                        onClick={this.toLinkPage}
                        dangerouslySetInnerHTML={{
                          __html: this.msgToContent(item.text),
                        }}
                      ></span>
                    );

                  case 'wechat':
                    const wechatItem = wechatEmoji.find(
                      (emoji) =>
                        item.data === emoji.chs ||
                        item.data === emoji.cht ||
                        item.data === emoji.eng
                    );
                    if (wechatItem) {
                      return (
                        <span
                          key={index}
                          className={`${styles.emoji} ${emojiStyle.emoji} ${
                            emojiStyle[
                              `emoji-${wechatItem.eng
                                .slice(1, wechatItem.eng.length - 1)
                                .replace('!', '')}`
                            ]
                          }`}
                        >
                          {wechatItem.eng}
                        </span>
                      );
                    }
                    const newTxt = item.data;
                    return (
                      <span
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: newTxt,
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
            <i className={styles.flag} ref={(node) => (this.lastDom = node)} />{' '}
          </div>
        )}
        {showMoreBtn && (
          <button
            className={styles.showMoreBtn}
            style={{
              lineHeight: `${this.lineHeight}px`,
            }}
            onClick={this.handleMoreShow}
          >
            {`${showAllContent ? '收起' : '...查看更多'}`}{' '}
          </button>
        )}{' '}
      </div>
    );
  }
}
export default withRouter(Text);
