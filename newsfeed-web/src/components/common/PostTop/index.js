import React from 'react';
import MDLink from '../MDLink';

import styles from './index.css';

class PostTop extends React.PureComponent {
  render() {
    const { top, markList } = this.props;
    return (
      <div className={styles.wrapper}>
        <MDLink markList={markList} text={top} subStrLength={20} />
      </div>
    );
  }
}
export default PostTop;
