import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

class PathLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className={styles.leftBtn}>
          <Icon type="left-circle" />
        </div>
        <div className={styles.rightBtn}>
          <Icon type="right-circle" />
        </div>
        <div className={styles.linesBox}>
          <div className={styles.lineItem}>
            <div className={styles.hollowCircle}>
              <span className={styles.solidCircle} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PathLine.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(PathLine);
