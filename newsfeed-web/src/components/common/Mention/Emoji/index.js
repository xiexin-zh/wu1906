import React from 'react';
// import { connect } from 'dva';
import emojiStyle from '../../../../assets/emoji/index.css';
import { wechatEmoji } from '../../../../assets/emoji';
import styles from './index.scss';
import { emitter } from '../../../../utils/draftEmitter';

export default class Emoji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  addEmoji = (item) => {
    const { emojiKey } = this.props;
    emitter.emit(`addEmoji_${emojiKey}`, item);
  };
  render() {
    return (
      <div>
        <ul className={styles.emojiList}>
          {wechatEmoji.map((item, i) => {
            return (
              <span
                key={i}
                className={emojiStyle.wechatBox}
                onClick={() => this.addEmoji(item)}
              >
                <span
                  className={`${emojiStyle.emoji} ${
                    emojiStyle[
                      `emoji-${item.eng
                        .slice(1, item.eng.length - 1)
                        .replace('!', '')}`
                    ]
                  }`}
                ></span>
              </span>
            );
          })}
        </ul>
      </div>
    );
  }
}
