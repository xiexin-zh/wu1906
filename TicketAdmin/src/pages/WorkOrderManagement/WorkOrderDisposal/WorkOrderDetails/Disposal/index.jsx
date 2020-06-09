import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import Toggle from '@/components/Toggle';
import Empty from '@/pages/empty';
import { defaultDispatchList, getLoginGroup } from '@/utils/constance';
import ApplyToCancelAccount from './ApplyToCancelAccount/applyToCancelAccount';
import OrderAssign from './OrderAssign';
import DisposalSelf from './DisposalSelf';
import OrderRemark from './OrderRemark';
import ResultReduction from './ResultReduction';
import LeadersInstructions from './LeadersInstructions/leadersInstructions';

import styles from './index.less';

const cancelList = ['申请剔除', '申请挂帐'];

class Disposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disposalTabs: [],
      current: '',
      showList: false,
    };
    this.isCancel = true;
  }

  componentDidMount() {
    const { group_id: groupId } = JSON.parse(localStorage.getItem('currentUserInfo') || '{}');
    const { indexOrderState } = this.props;
    const accessMap = {
      '2':
        indexOrderState === 'ing'
          ? ['orderAssign', 'disposalSelf', 'orderRemark', 'leadersInstructions']
          : ['orderAssign', 'disposalSelf', 'orderRemark'], // 分中心组
      '3': [
        // 部门组
        'disposalSelf',
        'orderAssign',
        'orderRemark',
        'applyForReturn',
        'applyToDelay',
        'applyToCancelAccount',
      ],
      '4': [
        // 领导组
        'leadersInstructions',
        'orderRemark',
      ],
      '5': ['disposalSelf', 'applyToCancelAccount', 'applyForReturn'],
    };
    const tableList = accessMap[groupId];
    const indexList = tableList.map(item =>
      this.componentDispatchList.find(innerItem => innerItem.id === item),
    );
    const { orderDetails } = this.props;
    const { reject_reason } = orderDetails || {};
    const newCurrent = indexList[0] ? indexList[0].id : '';

    const isOrganize = getLoginGroup() === 'organize';
    const isLeaderGroup = getLoginGroup() === 'leaderGroup';

    let computedCurrent = 0;
    if (isOrganize) {
      computedCurrent = 'disposalSelf';
    } else if ((defaultDispatchList.includes(indexOrderState) && !isLeaderGroup) || reject_reason) {
      computedCurrent = 'orderAssign';
    } else {
      computedCurrent = newCurrent;
    }
    this.setState({
      // disposalTabs: indexList.filter(item => item.hide !== 0),
      disposalTabs: indexList,
      current: computedCurrent,
    });
  }

  get componentDispatchList() {
    return [
      {
        id: 'leadersInstructions',
        name: '领导批示',
        component: params => <LeadersInstructions {...params} />,
      },
      { id: 'orderAssign', name: '工单分派', component: params => <OrderAssign {...params} /> },
      { id: 'disposalSelf', name: '自处理', component: params => <DisposalSelf {...params} /> },
      { id: 'orderRemark', name: '工单标记', component: params => <OrderRemark {...params} /> },
      { id: 'applyForReturn', name: '申请退回', component: params => <Empty {...params} /> },
      { id: 'applyToDelay', name: '申请延迟', component: params => <Empty {...params} /> },
      {
        id: 'applyToCancelAccount',
        name: '申请剔挂帐',
        children: cancelList,
        hide: this.props?.orderDetails?.reject_opt,
        component: params => {
          return <ApplyToCancelAccount {...params} isCancel={this.isCancel} />;
        }, // 默认是申请剔除
      },
    ];
  }

  // change tab
  changeTab = id => {
    this.setState({
      current: id,
    });
  };

  setShowList = () => this.setState(state => ({ showList: !state.showList }));

  renderContent = () => {
    const { current, disposalTabs } = this.state;
    const { id, remove, targetKey, getNewOrderList, orderDetails } = this.props;
    // const isOrganizerDealWith = !current; // 承办单位没有tab项
    const params = {
      id,
      remove,
      targetKey,
      getNewOrderList,
      orderDetails,
    };

    const indexItem = disposalTabs.find(item => item.id === current);

    return !indexItem ? <DisposalSelf {...params} /> : indexItem.component(params);
  };

  render() {
    const { disposalTabs, current, showList } = this.state;
    const { id, orderStatus, remove, targetKey, getNewOrderList } = this.props;
    // 后端获取的工单状态有问题
    // 审核页面
    if (orderStatus === 2) {
      return (
        <ResultReduction
          id={id}
          orderStatus={orderStatus}
          getNewOrderList={getNewOrderList}
          remove={remove}
          targetKey={targetKey}
        />
      );
    }

    return (
      <div className={styles.disposal}>
        <div className={styles.disposal_tab}>
          <div className={styles.tabLeft}>
            {disposalTabs.length > 0 &&
              disposalTabs.map(item => {
                const { children } = item;
                return (
                  <Toggle
                    Component={() => (
                      <li
                        onClick={() => {
                          this.changeTab(item.id);
                          if (current === item.id) {
                            this.setShowList();
                          }
                        }}
                        className={item.id === current ? styles.active : ''}
                        key={item.id}
                        style={children ? { marginRight: 0, paddingRight: '5px' } : {}}
                      >
                        {item.name}
                      </li>
                    )}
                    list={children}
                    isUp={!showList}
                    hoverItem={this.isCancel ? cancelList[0] : cancelList[1]}
                    setHoverItem={param => {
                      this.isCancel = param === cancelList[0];
                    }}
                    setIsUp={this.setShowList}
                  />
                );
              })}
          </div>
          <div className={styles.tabRight}>
            <Button icon="exception">工单督办</Button>
            <Button icon="delete">工单删除</Button>
          </div>
        </div>
        <div className={styles.disposalContent}>{this.renderContent()}</div>
      </div>
    );
  }
}

Disposal.propTypes = {};
function mapStateToProps(state) {
  return {
    indexOrderState: state.order.indexOrderState,
  };
}
export default connect(mapStateToProps)(Disposal);
