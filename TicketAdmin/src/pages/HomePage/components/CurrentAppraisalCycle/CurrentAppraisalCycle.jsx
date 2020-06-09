import React from 'react';
import { connect } from 'dva';
import stylesGlobal from '../componentsGlobal.less';
import styles from './CurrentAppraisalCycle.less';

class CurrentAppraisalCycle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessmentCycleInfo: [
        {
          icon: require('../../images/tichu.png'),
          font: '已剔除',
          font2: '剔除占比',
          num: 10,
          color: 'rgba(255,102,102,1)',
          num1: 100,
        },
        {
          icon: require('../../images/1030.png'),
          font: '已挂账',
          font2: '挂帐占比',
          num: 6,
          color: '',
          num1: 100,
        },
      ],
    };
  }

  renderContent = () => {
    const { assessmentCycleInfo } = this.state;
    return (
      <>
        {assessmentCycleInfo.map((item, index) => {
          return (
            <div
              key={item.font}
              className={styles.CurrentAppraisalCycleBox}
              style={{ marginBottom: index % 2 === 0 ? '15px' : '' }}
            >
              <div className={styles.CountContentBox}>
                <img src={item.icon} alt="" />
                <span style={{ fontWeight: '400' }}>{item.font}</span>
                <span style={{ color: item.color }}>{item.num}</span>
              </div>
              <i className={styles.line} />
              <div className={styles.numberBox}>
                <div style={{ marginBottom: '10px' }}>
                  <p className={styles.numFont}>总工单数</p>
                  <p className={styles.totalWork}>{item.num1}</p>
                </div>
                <div>
                  <p className={styles.numFont}>{item.font2}</p>
                  <p className={styles.rejectionProportion} style={{ color: item.color }}>
                    {(item.num / item.num1) * 100}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  render() {
    return (
      <div className={`${stylesGlobal.AgencyTotalBox} ${stylesGlobal.mr}`}>
        <div className={stylesGlobal.agencyTotalBox}>
          <span className={stylesGlobal.agencyTotalFont}>
            <img src={require('../../images/tubiao.png')} alt="" />
            本考核周期内
          </span>
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

CurrentAppraisalCycle.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CurrentAppraisalCycle);
