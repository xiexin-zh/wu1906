import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { Button, Input } from 'antd';
import { connect } from 'dva';
import { PlusSquareOutlined } from '@ant-design/icons';
import styles from './HomePage.less';

import CountContent from './components/CountContent';
import CurrentAppraisalCycle from './components/CurrentAppraisalCycle';
import ProcessContent from './components/ProcessContent';
import WorkOrderReminder from './components/WorkOrderReminder';
import KnowledgeBase from './components/KnowledgeBase';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 点击创建新工单
  createNewOrder = () => {
    router.push('/WorkOrderManagement/WorkOrderDisposal/CreateWorkOrder');
  };

  renderSubTitle = () => {
    return (
      <Button type="primary" style={{ background: '#249FDE', borderColor: '#249FDE' }}>
        可视化
      </Button>
    );
  };

  renderExtra = () => {
    return (
      <div className={styles.subTitleRightBtn}>
        <Input
          placeholder="工单/诉求人/电话/地点"
          prefix={
            <img
              src={require('./images/ico_ss@2x.png')}
              alt=""
              className={styles.exImg}
              style={{ marginTop: '4px' }}
            />
          }
          className={styles.MR}
        />
        <Button
          style={{ borderColor: 'rgba(36,159,222,1)', color: 'rgba(36,159,222,1)' }}
          className={styles.MR}
        >
          <img src={require('./images/ico_pldr@2x.png')} alt="" className={styles.exImg} />
          批量导入
        </Button>
        <Button
          style={{ borderColor: 'rgba(36,159,222,1)', color: 'rgba(36,159,222,1)' }}
          className={styles.MR}
        >
          <img src={require('./images/ico_pldr@2x.png')} alt="" className={styles.exImg} />
          导入
        </Button>
        <Button
          type="primary"
          className={styles.MR}
          onClick={this.createNewOrder}
          style={{ background: 'rgba(36,159,222,1)' }}
        >
          <PlusSquareOutlined />
          创建
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.HomePageBox}>
        <PageHeaderWrapper breadcrumb subTitle={this.renderSubTitle()} extra={this.renderExtra()}>
          <div className={styles.homeContent}>
            <div className={styles.contentTop}>
              {/* 待办总量 */}
              <CountContent />
              {/* 本考核周期内 */}
              <CurrentAppraisalCycle />
              {/* 办理进程 */}
              <ProcessContent />
            </div>
            <div className={styles.contentBottom}>
              {/* 工单提醒 */}
              <WorkOrderReminder />
              {/* 知识库 */}
              <KnowledgeBase />
            </div>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

HomePage.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(HomePage);
