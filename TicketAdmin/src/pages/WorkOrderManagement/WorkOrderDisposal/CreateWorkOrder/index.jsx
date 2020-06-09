import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button } from 'antd';
import OrderForm from '../../../../components/OrderForm';

import styles from './index.less';

class CreateWorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 返回工单列表
  cancel = () => {
    router.push('/WorkOrderManagement/WorkOrderDisposal');
  };

  render() {
    return (
      <div className={styles.createWork}>
        {/* title */}
        <div className={styles.orderTitle}>
          <div className={styles.title_left}>
            <div className={styles.title_left_rourte}>{'工单管理>工单创建'}</div>
            <div className={styles.title_left_subTitle}>
              <img alt="" src={require('../../../../assets/icon/work_new1.png')} />
              <span>工单详情</span>
            </div>
          </div>
          <div className={styles.title_right}>
            <Button icon="cloud-download" className={styles.order_import}>
              导入
            </Button>
            <Button icon="rollback" className={styles.order_cancel} onClick={this.cancel}>
              返回
            </Button>
          </div>
        </div>
        <OrderForm isCreate />
      </div>
    );
  }
}

CreateWorkOrder.propTypes = {};
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CreateWorkOrder);
