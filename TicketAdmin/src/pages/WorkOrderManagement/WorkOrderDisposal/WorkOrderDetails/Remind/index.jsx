import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';

import styles from './index.less';

class Remind extends Component {
  // eslint-disable-next-line no-empty-pattern
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title } = this.props;
    return (
      <div className={styles.remind}>
        <div className={styles.remindTitle}>
          <div className={styles.title}>
            <Icon type="bell" theme="filled" />
            <span>{title}</span>
          </div>
          <div className={styles.order}>
            <span>关联工单：</span>
            <span>6</span>
          </div>
        </div>
        <div className={styles.remindList}>
          <div className={styles.listItem}>
            <div className={styles.itemName}>
              <Icon type="check-circle" theme="filled" />
              <span>热线-200316-024596</span>
            </div>
            <div className={styles.closeIcon}>
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.listItem}>
            <div className={styles.itemName}>
              <Icon type="check-circle" theme="filled" />
              <span>热线-200316-024596</span>
            </div>
            <div className={styles.closeIcon}>
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.listItem}>
            <div className={styles.itemName}>
              <Icon type="check-circle" theme="filled" />
              <span>热线-200316-024596</span>
            </div>
            <div className={styles.closeIcon}>
              <Icon type="close" />
            </div>
          </div>
          <div className={styles.listItem}>
            <div className={styles.itemName}>
              <Icon type="check-circle" theme="filled" />
              <span>热线-200316-024596</span>
            </div>
            <div className={styles.closeIcon}>
              <Icon type="close" />
            </div>
          </div>
        </div>
        <div className={styles.save}>
          <Button type="primary" icon="save">
            保存
          </Button>
        </div>
      </div>
    );
  }
}
Remind.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Remind);
