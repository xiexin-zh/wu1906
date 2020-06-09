import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Radio, Button, message } from 'antd';
import { getLoginGroup } from '@/utils/constance';
import UploadFile from '@/components/FileUpload';
// import { centerCheckTicket } from '@/services/workOrderManagement';
// import PathLine from '@/components/PathLine';
import _ from 'lodash';
import styles from './index.less';

class ResultReduction extends Component {
  isCenterGroup = getLoginGroup() === 'centerGroup';

  isDepartment = getLoginGroup() === 'department';

  constructor(props) {
    super(props);
    this.state = {
      hasFeedBack: false, // 回显是否反馈
      deal_text: '', // 回显处理结果
      isResolve: true, // 回显是否解决
      isSatisfaction: true, // 回显是否满意
      // response_txt: '', // 回显响应内容
      reply_txt: '',

      hasReturn: 1, // 1-已回访  0-未回访
      return_isResolve: 1, // 回访是否解决 1-已解决  0-未解决
      returnValue: '',
      return_isSatisfaction: 1, // 回访是否满意 1-满意  0-不满意
      isPass: 1, // 通过 1-通过  0-驳回
      passValue: '',
      fileData: [],
    };
  }

  componentDidMount() {
    this.getReductionData();
  }

  // 获取审核回显数据
  getReductionData = async () => {
    const { id, dispatch } = this.props;
    const res = await dispatch({
      type: `order/getTicketCheckInfo`,
      payload: {
        ticket_id: id,
      },
    });
    if (res.state) {
      const { ticketResult, ticketFile, ticketCheck } = res.data;
      this.ticketCheck = ticketCheck;
      this.setState({
        fileData: ticketFile,
      });
      if (ticketResult) {
        const {
          is_reply,
          // response_txt,
          result_txt,
          is_resolved,
          is_satisfaction,
          reply_txt,
        } = ticketResult;
        this.setState({
          deal_text: result_txt,
          hasFeedBack: is_reply === 1,
          isResolve: is_resolved === 1,
          isSatisfaction: is_satisfaction === 1,
          // response_txt,
          reply_txt,
        });
      }
    }
    return true;
  };

  submit = async () => {
    const { id, remove, targetKey, getNewOrderList, dispatch } = this.props;
    const {
      hasReturn,
      return_isResolve,
      return_isSatisfaction,
      returnValue,
      isPass,
      passValue,
    } = this.state;

    if (hasReturn === 0 && returnValue.trim().length === 0) {
      return message.error('请填写未回访原因');
    }

    if (isPass === 0 && passValue.trim().length === 0) {
      return message.error('请填写驳回原因');
    }

    // 中心审核来自承办单位和部门的工单为一个接口；部门审核来自承办单位的未一个接口
    let api = '';
    if (this.isCenterGroup) {
      api = 'centerCheckTicket';
    }
    if (this.isDepartment) {
      api = 'deptCheckComp';
    }
    if (!api) {
      return message.error('您没有权限');
    }
    const params = {
      ticket_id: id,
      is_revisit: hasReturn,
      is_resolved: return_isResolve,
      is_satisfaction: return_isSatisfaction,
      reason: returnValue,
      is_pass: isPass,
      remark: passValue,
    };

    const res = await dispatch({
      type: `order/${api}`,
      payload: {
        ...params,
      },
    });
    if (res.state) {
      message.success('提交成功');
      remove(targetKey);
      getNewOrderList();
      // route.push('/WorkOrderManagement/WorkOrderDisposal/WorkOrderDetails');
    } else {
      message.error('提交失败');
    }

    return true;
  };

  // 文件上传成功后设置文件数据
  setFileData = () => {
    message.error('不能支持上传文件');
  };

  // 多选删除附件
  multipleDelFile = () => {
    message.error('不能支持删除');
  };

  // 单选删除附件
  singleDelFile = () => {
    message.error('不能支持删除');
  };

  renderTicketCheck = () => {
    // console.log(this.ticketCheck);
    // return null;
    if (!_.isArray(this.ticketCheck)) {
      return null;
    }
    return this.ticketCheck.map(item => {
      const { is_revisit, is_pass, reason, remark } = item;
      const isRevisited = is_revisit === 1;
      const isPass = is_pass === 1;
      return (
        <>
          <div className={styles.caseReturn}>
            <span className={styles.title}>案件回访：</span>
            <div className={styles.warning}>
              <Icon type="info-circle" theme="filled" />
              <span>
                (案件处理完后，分中心向诉求人回访承办单位案件办理情况，记录案件处理满意度)
              </span>
            </div>
          </div>
          <div className={styles.returnResult}>
            <span className={styles.title}>回访结果：</span>
            <div className={styles.returnSelect}>
              <div className={styles.selectItem}>
                <Radio.Group value={is_revisit}>
                  <Radio value={1}>已回访</Radio>
                  <Radio value={0}>未回访</Radio>
                </Radio.Group>
              </div>
              {/* {isRevisited && (
              <div className={styles.optionItem}>
                <div className={styles.isResolve}>
                  <span>是否解决：</span>
                  <Radio.Group
                    value={return_isResolve}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </div>
                <div className={styles.isResolve}>
                  <span>是否满意：</span>
                  <Radio.Group
                    value={return_isSatisfaction}
                    onChange={e => {
                      this.setState({
                        return_isSatisfaction: e.target.value,
                      });
                    }}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </div>
              </div>
            )} */}
              <div className={styles.dealResult}>
                <span>{isRevisited ? '回访记录：' : '未回访原因：'}</span>
                <div className={styles.resultBox}>{reason}</div>
              </div>
            </div>
          </div>
          <div className={styles.checkResult}>
            <span className={styles.title}>审核结果</span>
            <div className={styles.checkSelect}>
              <div className={styles.selectItem}>
                <Radio.Group value={is_pass}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={0}>驳回</Radio>
                </Radio.Group>
              </div>
              <div className={styles.dealResult}>
                <span>{isPass ? '向市中心提交处置结果：' : '填写驳回原因：'}</span>
                <div className={styles.resultBox}>{remark}</div>
              </div>
            </div>
          </div>
        </>
      );
    });
  };

  render() {
    const {
      hasFeedBack,
      deal_text,
      // response_txt,
      reply_txt,
      isResolve,
      isSatisfaction,
      hasReturn,
      return_isResolve,
      return_isSatisfaction,
      returnValue,
      isPass,
      passValue,
      fileData,
    } = this.state;

    return (
      <div className={styles.resultReduction}>
        <div className={styles.resultTitle}>
          <span className={styles.title}>处置结果审核：</span>
          <div className={styles.warning}>
            <Icon type="info-circle" theme="filled" />
            <span>(审核部门向分中心提出的处置结果)</span>
          </div>
        </div>
        {/* <div className={styles.turnStatus}>
          <span className={styles.title}>转派情况：</span>
          <div className={styles.statusProcess}>
            <div className={styles.turnProcess}>
              <PathLine />
            </div>
          </div>
        </div> */}
        <div className={styles.dealResult}>
          <span className={styles.title}>处理结果：</span>
          <div className={styles.resultBox}>{deal_text}</div>
        </div>
        <div className={styles.feedback}>
          <span className={styles.title}>向申诉人反馈结果：</span>
          <div className={styles.feedbackOption}>
            <div className={styles.optionItem}>
              <Radio.Group>
                <Radio value={1} checked={hasFeedBack} disabled={!hasFeedBack}>
                  已反馈
                </Radio>
                <Radio value={2} checked={!hasFeedBack} disabled={hasFeedBack}>
                  未反馈
                </Radio>
              </Radio.Group>
            </div>
            {(this.isCenterGroup || this.isDepartment) && hasFeedBack ? (
              <div className={styles.selectOption}>
                <div className={styles.isResolve}>
                  <span>是否解决：</span>
                  <Radio.Group>
                    <Radio value={1} checked={isResolve} disabled={!isResolve}>
                      是
                    </Radio>
                    <Radio value={2} checked={!isResolve} disabled={isResolve}>
                      否
                    </Radio>
                  </Radio.Group>
                </div>
                <div className={styles.isResolve}>
                  <span>是否满意：</span>
                  <Radio.Group>
                    <Radio value={1} checked={isSatisfaction} disabled={!isSatisfaction}>
                      是
                    </Radio>
                    <Radio value={2} checked={!isSatisfaction} disabled={isSatisfaction}>
                      否
                    </Radio>
                  </Radio.Group>
                </div>
                <div className={styles.replyText}>{reply_txt}</div>
              </div>
            ) : (
              <div className={styles.noFeedBack}>
                <span>未反馈原因：</span>
                <div className={styles.resultBox}>{reply_txt}</div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.upFiles}>
          <span className={styles.upTitle}>上传附件：</span>
          <div className={styles.fileBox}>
            <UploadFile
              stopUpload
              fileData={fileData}
              setFileData={this.setFileData}
              singleDelFile={this.singleDelFile}
              multipleDelFile={this.multipleDelFile}
            />
          </div>
        </div>
        {this.renderTicketCheck()}
        <div className={styles.caseReturn}>
          <span className={styles.title}>案件回访：</span>
          <div className={styles.warning}>
            <Icon type="info-circle" theme="filled" />
            <span>(案件处理完后，分中心向诉求人回访部门案件办理情况，记录案件处理满意度)</span>
          </div>
        </div>
        <div className={styles.returnResult}>
          <span className={styles.title}>回访结果：</span>
          <div className={styles.returnSelect}>
            <div className={styles.selectItem}>
              <Radio.Group
                value={hasReturn}
                onChange={e => {
                  this.setState({
                    hasReturn: e.target.value,
                  });
                }}
              >
                <Radio value={1}>已回访</Radio>
                <Radio value={0}>未回访</Radio>
              </Radio.Group>
            </div>
            {hasReturn === 1 && (
              <div className={styles.optionItem}>
                <div className={styles.isResolve}>
                  <span>是否解决：</span>
                  <Radio.Group
                    value={return_isResolve}
                    onChange={e => {
                      this.setState({
                        return_isResolve: e.target.value,
                      });
                    }}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </div>
                <div className={styles.isResolve}>
                  <span>是否满意：</span>
                  <Radio.Group
                    value={return_isSatisfaction}
                    onChange={e => {
                      this.setState({
                        return_isSatisfaction: e.target.value,
                      });
                    }}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </div>
              </div>
            )}

            <div className={styles.returnNote}>
              <div className={styles.callPhone}>
                <img src={require('@/assets/icon/phone.png')} alt="" />
              </div>
              <span className={hasReturn === 1 ? styles.title : styles.title1}>
                {hasReturn === 1 ? '回访记录：' : '未回访原因：'}
              </span>
              <textarea
                placeholder={hasReturn === 1 ? '请输入内容：' : '请输入未回访原因：'}
                value={returnValue}
                onChange={e => {
                  this.setState({
                    returnValue: e.target.value.substr(0, 300),
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.checkResult}>
          <span className={styles.title}>审核结果</span>
          <div className={styles.checkSelect}>
            <div className={styles.selectItem}>
              <Radio.Group
                value={isPass}
                onChange={e => {
                  this.setState({
                    isPass: e.target.value,
                  });
                }}
              >
                <Radio value={1}>通过</Radio>
                <Radio value={0}>驳回</Radio>
              </Radio.Group>
            </div>
            <div className={styles.notice}>
              {isPass === 1 ? '向市中心提交处置结果：' : '填写驳回原因：'}
            </div>
            <div className={styles.resultBox}>
              <textarea
                placeholder={isPass === 1 ? '请输入处置结果：' : '请输入驳回原因：'}
                value={passValue}
                onChange={e => {
                  this.setState({
                    passValue: e.target.value.substr(0, 300),
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.submit}>
          <Button icon="save" onClick={this.submit}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

ResultReduction.propTypes = {};
function mapStateToProps(state) {
  return {
    groupId: state.user.rights.groupId,
  };
}
export default connect(mapStateToProps)(ResultReduction);
