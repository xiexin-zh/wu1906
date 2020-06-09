import React, { Component } from 'react';
import styles from './index.css';
import { getUrl } from '../../../utils/utils';
class Icon extends Component {
  render() {
    const { url, text, marginRight = 0, width = 20 } = this.props;
    return (
      <div className={styles.icons}>
        <img src={getUrl(url)} alt="" style={{ marginRight, width }} />
        <span>{text}</span>
      </div>
    );
  }
}

export default Icon;
