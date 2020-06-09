import React from 'react';
import { connect } from 'dva';
import stylesGlobal from '../componentsGlobal.less';
import styles from './CountContent.less';

class CountContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalsNum: 95,
      agencyTotalInfo: [
        {
          icon: require('../../images/ico_dcl.png'),
          font: '待处理',
          num: 50,
        },
        {
          icon: require('../../images/ico_dsh.png'),
          font: '待审核',
          num: 45,
        },
        {
          icon: require('../../images/ico_jjcs.png'),
          font: '即将超时',
          num: 2,
        },
        {
          icon: require('../../images/ico_ycs.png'),
          font: '已超时',
          num: 2,
        },
      ],
    };
  }

  renderContent = () => {
    const { agencyTotalInfo } = this.state;
    return (
      <div className={stylesGlobal.countBox}>
        {agencyTotalInfo.map((info, index) => {
          return (
            <div
              key={info.font}
              className={styles.CountContentBox}
              style={{ margin: index % 2 === 0 ? '0 15px 15px 0' : '' }}
            >
              <img src={info.icon} alt="" />
              <span style={{ fontWeight: '400' }}>{info.font}</span>
              <span>{info.num}</span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { totalsNum } = this.state;
    return (
      <div className={`${stylesGlobal.AgencyTotalBox} ${stylesGlobal.mr}`}>
        <div className={stylesGlobal.agencyTotalBox}>
          <span className={stylesGlobal.agencyTotalFont}>
            <img src={require('../../images/tubiao.png')} alt="" />
            待办总量
          </span>
          <span className={stylesGlobal.agencyTotalNum}>
            {totalsNum}
            <span className={stylesGlobal.numCompany}>件</span>
          </span>
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

CountContent.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CountContent);
