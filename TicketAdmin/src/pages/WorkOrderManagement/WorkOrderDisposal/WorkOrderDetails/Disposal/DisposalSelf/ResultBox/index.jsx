import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Radio } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

class ResultOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChangeFeedback = e => {
    const { onChangeFeedback } = this.props;
    onChangeFeedback(e.target.value);
  };

  onChange1 = value => {
    const { type, changeResponse, changeResolve } = this.props;
    if (type === 'res') {
      changeResponse(value.target.value);
    } else {
      changeResolve(value.target.value);
    }
  };

  onChange2 = value => {
    const { changeSatisfactory } = this.props;
    changeSatisfactory(value.target.value);
  };

  changeText = value => {
    const { changeText } = this.props;
    changeText(value.target.value);
  };

  render() {
    const {
      type,
      title,
      isResponse,
      isResolve,
      satisfactory,
      is_feedback,
      resResult,
    } = this.props;
    return (
      <div className={styles.orderResult}>
        <div className={styles.resultTitle}>
          <div className={styles.selectRadio}>
            <span className={styles.title}>{title}：</span>
            <div className={styles.content}>
              {type === 'reply' && (
                <div className={styles.contentTop}>
                  <Radio.Group onChange={this.onChangeFeedback} value={is_feedback}>
                    <Radio value={1}>已反馈</Radio>
                    <Radio value={0}>未反馈</Radio>
                  </Radio.Group>
                </div>
              )}
              {type === 'res' ? (
                <div className={styles.contentBottom}>
                  <div>
                    <span className={styles.radioTitle}>是否响应</span>
                    <Radio.Group
                      onChange={this.onChange1}
                      value={type === 'res' ? isResponse : isResolve}
                    >
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </div>
                </div>
              ) : (
                <div>
                  {is_feedback ? (
                    <div className={styles.contentBottom}>
                      <div>
                        <span className={styles.radioTitle}>是否解决</span>
                        <Radio.Group
                          onChange={this.onChange1}
                          value={type === 'res' ? isResponse : isResolve}
                        >
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </div>
                      <div>
                        <span className={styles.radioTitle}>是否满意</span>
                        <Radio.Group onChange={this.onChange2} value={satisfactory}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  ) : (
                    <span>未反馈原因：</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.phoneBtn}>
            <img src={require('../../../../../../../assets/icon/phone.png')} alt="" />
          </div>
        </div>
        <div className={styles.inputText}>
          <TextArea placeholder="请输入内容" rows={4} value={resResult} onChange={this.changeText} maxLength={300} />
        </div>
      </div>
    );
  }
}

ResultOrder.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(ResultOrder);
