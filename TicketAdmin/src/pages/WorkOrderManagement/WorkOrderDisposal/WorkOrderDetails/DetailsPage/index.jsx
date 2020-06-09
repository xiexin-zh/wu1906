import React, { Component } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Button, Icon, message } from 'antd';
// import OrderList from '../components/OrderList';
import { getLoginGroup } from '@/utils/constance';
import { getCenterReject } from '@/services/workOrderManagement';
import OrderForm from '../../../../../components/OrderForm';
import Remind from '../Remind';
import ProcessStep from '../Step';
import Disposal from '../Disposal';
import Process from '../Process';
import ResultReduction from '../Disposal/ResultReduction/index';
import ApplyToCancelAccount from '../Disposal/ApplyToCancelAccount/applyToCancelAccount';

import styles from './index.less';

class DetailsPage extends Component {
  // eslint-disable-next-line no-empty-pattern
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      disposalTab: [
        { id: 1, name: '工单处理', icon: 'file-sync' },
        { id: 2, name: '工单进程', icon: 'stop' },
      ],
      orderDetails: {},
      centerReject: {},
    };
  }

  componentDidMount() {
    this.getOrderDetails();
    this.getCenterRejectHandle();
  }

  get isCenterGroupWait() {
    const { indexOrderState } = this.props;
    return getLoginGroup() === 'centerGroup' && indexOrderState === 'wait';
  }

  get isDepartmentWait() {
    const { indexOrderState } = this.props;
    return getLoginGroup() === 'department' && indexOrderState === 'wait';
  }

  getCenterRejectHandle = () => {
    getCenterReject({
      ticket_id: this.props?.id || '',
    }).then(res => {
      this.setState({
        centerReject: res?.data || {},
      });
    });
  };

  // 获取工单详情信息
  getOrderDetails = async () => {
    const { dispatch, id } = this.props;
    const res = await dispatch({
      type: 'order/getOrderDetails',
      payload: { ticket_id: id },
    });
    if (res.state) {
      const { data } = res;
      this.setState({
        orderDetails: data,
      });
    } else {
      message.error('数据获取失败');
    }
  };

  // 返回工单列表
  // cancel = () => {
  //   router.push('/WorkOrderManagement/WorkOrderDisposal');
  // };

  // 切换工单处理tab
  changeDisTab = id => {
    this.setState({
      active: id,
    });
  };

  renderWorkOrder = () => {
    const { remove, targetKey, getNewOrderList, indexOrderState } = this.props;
    const { orderDetails, centerReject } = this.state;
    const { id, t_state, reject_opt } = orderDetails;
    if (!id) {
      return null;
    }
    if (reject_opt && indexOrderState === 'wait') {
      return (
        <ApplyToCancelAccount
          data={centerReject}
          isCancel={centerReject?.ticketReject?.is_reject === 0}
          orderDetails={orderDetails}
          id={id}
        />
      );
    }
    return this.isCenterGroupWait || this.isDepartmentWait ? (
      <ResultReduction
        id={id}
        targetKey={targetKey}
        remove={remove}
        getNewOrderList={getNewOrderList}
        orderDetails={orderDetails}
        isDepartmentWait={this.isDepartmentWait}
      />
    ) : (
      <Disposal
        id={id}
        orderStatus={t_state}
        targetKey={targetKey}
        remove={remove}
        getNewOrderList={getNewOrderList}
        orderDetails={orderDetails}
      />
    );
  };

  render() {
    const { active, disposalTab, orderDetails } = this.state;
    const { id } = orderDetails;

    return (
      <div className={styles.orderDeatils}>
        <div className={styles.details_header}>
          <div className={styles.orderTitle}>
            <div className={styles.title_left}>
              <div className={styles.title_left_subTitle}>
                <img alt="" src={require('../../../../../assets/icon/work_new1.png')} />
                <span>工单详情</span>
              </div>
            </div>
            <div className={styles.title_right}>
              <Button icon="cloud-download" className={styles.order_import}>
                导出
              </Button>
              {/* <Button icon="rollback" className={styles.order_cancel} onClick={this.cancel}>
                返回
              </Button> */}
            </div>
          </div>
        </div>
        <div className={styles.details_main}>
          <div className={styles.main_left}>{id && <OrderForm orderData={orderDetails} />}</div>
          <div className={styles.main_right}>
            <div className={styles.main_right_title}>
              <div>
                <Icon type="clock-circle" />
                <span>智能识别</span>
              </div>
              <div>
                <Icon type="info-circle" />
                <span>备注</span>
              </div>
            </div>
            <div className={styles.remindList}>
              <Remind title="同人提醒" />
            </div>
            <div className={styles.remindList}>
              <Remind title="同诉提醒" />
            </div>
            <div className={styles.process}>
              <div className={styles.title}>
                <Icon type="file-sync" />
                <span>工单进程</span>
              </div>
              <div className={styles.step}>
                <ProcessStep />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.details_footer}>
          <div className={styles.disposalTab}>
            {disposalTab.map(item => {
              return (
                <li
                  onClick={() => this.changeDisTab(item.id)}
                  className={item.id === active ? styles.active : ''}
                  key={item.id}
                >
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </li>
              );
            })}
          </div>
          {active === 1 ? this.renderWorkOrder() : <Process id={id} />}
        </div>
      </div>
    );
  }
}
DetailsPage.propTypes = {};
function mapStateToProps(state) {
  return {
    indexOrderState: state.order.indexOrderState,
  };
}
export default connect(mapStateToProps)(DetailsPage);
