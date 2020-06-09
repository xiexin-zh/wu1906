import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import AddMark from '@/components/AddMark';
import styles from './index.less';

class OrderRemark extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.orderRemark}>
        <div className={styles.topTitle}>
          <span>添加工单标记</span>
        </div>
        <AddMark />
        <div className={styles.footerSave}>
          <Button className={styles.save}>暂存</Button>
          <Button className={styles.submit}>提交</Button>
        </div>
      </div>
    );
  }
}

OrderRemark.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(OrderRemark);
