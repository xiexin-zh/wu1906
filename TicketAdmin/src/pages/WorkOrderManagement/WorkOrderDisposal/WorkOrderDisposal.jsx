import React, { Component } from 'react';
import { connect } from 'dva';
import OrderList from './components/OrderList';
import styles from './WorkOrderDisposal.css';

class WorkOrderDisposal extends Component {
  // eslint-disable-next-line no-empty-pattern
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.orderList}>
        <OrderList isDetails={false} />
      </div>
    );
  }
}
WorkOrderDisposal.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(WorkOrderDisposal);
