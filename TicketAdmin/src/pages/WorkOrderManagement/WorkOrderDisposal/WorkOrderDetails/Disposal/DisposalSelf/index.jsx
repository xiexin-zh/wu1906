import React, { Component } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Icon, Button, Input, message } from 'antd';
import { getLoginGroup } from '@/utils/constance';
import OrderResult from './ResultBox';
import UploadFild from '../../../../../../components/FileUpload';
import styles from './index.less';

const { TextArea } = Input;

class DisposalSelf extends Component {
  indexGroup = getLoginGroup();

  constructor(props) {
    super(props);
    this.state = {
      isResponse: 0, // 是否响应
      resResult: '', // 响应内容
      dealResult: '', // 处理结果
      is_feedback: 0, // 是否反馈
      isResolve: 0, // 是否解决
      satisfactory: 0, // 是否满意
      replyResult: '', // 回复内容/未反馈原因
      fileData: [], // 文件
      response_url: '',
      reply_url: '',
    };
  }

  componentDidMount() {
    this.getOrderDoSelfData();
  }

  // 获取工单自处理保存的数据
  getOrderDoSelfData = async () => {
    const { id, dispatch } = this.props;
    let api = '';
    if (this.indexGroup === 'centerGroup') {
      api = 'getCenterDoSelf';
    }
    if (this.indexGroup === 'department') {
      api = 'getDeptDoSelf';
    }
    if (this.indexGroup === 'organize') {
      api = 'getCompDoSelf';
    }
    if (!api) {
      return false;
    }
    const res = await dispatch({
      type: `order/${api}`,
      payload: {
        ticket_id: id,
      },
    });
    if (res?.state) {
      const { ticketResult, ticketFile } = res.data;
      this.setState({
        fileData: ticketFile,
      });
      if (ticketResult) {
        const {
          is_response,
          response_txt,
          result_txt,
          is_reply,
          is_resolved,
          is_satisfaction,
          reply_txt,
        } = ticketResult;
        this.setState({
          isResponse: is_response,
          resResult: response_txt,
          dealResult: result_txt,
          is_feedback: is_reply,
          replyResult: reply_txt,
          isResolve: is_resolved,
          satisfactory: is_satisfaction,
        });
      }
    }
    return true;
  };

  // 返回工单列表
  // cancel = () => {
  //   router.push('/WorkOrderManagement/WorkOrderDisposal');
  // };

  // 修改是否响应
  changeResponse = isResponse => {
    this.setState({
      isResponse,
    });
  };

  // 修改响应结果信息
  changeResponseText = resResult => {
    this.setState({
      resResult,
    });
  };

  // 是否反馈
  onChangeFeedback = is_feedback => {
    this.setState({
      is_feedback,
    });
  };

  // 修改是否解决
  changeResolve = isResolve => {
    this.setState({
      isResolve,
    });
  };

  // 修改是否满意
  changeSatisfactory = satisfactory => {
    this.setState({
      satisfactory,
    });
  };

  // 修改回复结果
  changeResultText = replyResult => {
    this.setState({
      replyResult,
    });
  };

  // 文件上传成功后设置文件数据
  setFileData = data => {
    const { fileData } = this.state;
    this.setState({
      fileData: fileData.concat([data]),
    });
  };

  // 多选删除附件
  multipleDelFile = selectFileIds => {
    const { fileData } = this.state;
    let difference = [...fileData];
    for (let i = 0; i < selectFileIds.length; i += 1) {
      difference = difference.filter(item => {
        return selectFileIds[i] !== item.tf_id;
      });
    }

    this.setState({
      fileData: difference,
    });
  };

  // 单选删除附件
  singleDelFile = id => {
    const { fileData } = this.state;
    this.setState({
      fileData: fileData.filter(item => {
        return item.tf_id !== id;
      }),
    });
  };

  // 工单处理暂存/提交
  saveOrder = async type => {
    const {
      isResponse,
      resResult,
      dealResult,
      isResolve,
      satisfactory,
      replyResult,
      fileData,
      response_url,
      reply_url,
      is_feedback,
    } = this.state;
    if (!resResult.trim().length) {
      return message.error('请填写响应结果');
    }
    if (type === 1 && !dealResult.trim().length) {
      return message.error('请填写处理结果');
    }
    if (type === 1 && !replyResult.trim().length) {
      return message.error('请填写回复结果');
    }
    if (resResult.trim().length > 300) {
      return message.error('响应结果字数限制在300以内');
    }
    if (type === 1 && dealResult.trim().length > 300) {
      return message.error('处理结果字数限制在300以内');
    }
    if (type === 1 && replyResult.trim().length > 300) {
      return message.error('回复结果字数限制在300以内');
    }
    const fileList =
      fileData.length > 0
        ? fileData.map(item => {
            return {
              tf_title: item.tf_title,
              tf_filename: item.tf_filename,
              tf_url: item.tf_url,
              tf_format: item.tf_format,
              tf_size: item.tf_size,
            };
          })
        : [];
    const { id, dispatch, remove, targetKey, getNewOrderList } = this.props;
    const params = {
      ticket_id: id,
      is_response: isResponse,
      response_txt: resResult,
      response_url,
      response_save: 1,
      result_txt: dealResult,
      is_resolved: isResolve,
      is_satisfaction: satisfactory,
      reply_txt: replyResult,
      reply_url,
      is_send: type,
      ticketFile: JSON.stringify(fileList),
      is_reply: is_feedback,
    };
    let api = '';
    if (this.indexGroup === 'centerGroup') {
      api = 'centerDoSelf';
    }
    if (this.indexGroup === 'department') {
      api = 'deptDoSelf';
    }
    if (this.indexGroup === 'organize') {
      api = 'compDoSelf';
    }
    const res = await dispatch({
      type: `order/${api}`,
      payload: {
        ...params,
      },
    });
    if (res.state) {
      message.success(res.message);
      remove(targetKey);
      getNewOrderList();
    } else {
      message.error('操作失败');
    }

    return true;
  };

  render() {
    const {
      isResponse,
      resResult,
      isResolve,
      satisfactory,
      replyResult,
      fileData,
      is_feedback,
      dealResult,
    } = this.state;
    const {
      orderDetails: { process_txt, reject_reason },
    } = this.props;
    return (
      <div className={styles.disposalSelf}>
        <div className={styles.disposalTitle}>
          <Icon type="info-circle" />
          <span>{`自处理（案件不需要分派承办单位，向${
            this.indexGroup === 'department' ? '市中心' : '部门'
          }回复处理结果）`}</span>
        </div>
        {(this.indexGroup === 'department' || this.indexGroup === 'organize') && (
          <div
            className={`${styles.handelResult} ${styles.resResult}`}
            style={{ paddingBottom: '50px' }}
          >
            <span>处理意见：</span>
            <TextArea
              placeholder="请输入内容"
              defaultValue={process_txt}
              disabled
              style={{ height: '94px' }}
            />
          </div>
        )}
        {reject_reason && (
          <div
            className={`${styles.handelResult} ${styles.resResult}`}
            style={{ paddingBottom: '50px' }}
          >
            <span className={styles.title}>驳回原因：</span>
            <TextArea
              className={styles.textArea}
              value={reject_reason}
              disabled
              maxLength={300}
              rows={4}
            />
          </div>
        )}
        <div className={styles.resResult}>
          <OrderResult
            type="res"
            title="响应结果"
            isResponse={isResponse}
            resResult={resResult}
            changeResponse={this.changeResponse}
            changeText={this.changeResponseText}
          />
          <div className={styles.saveRes}>
            <Button onClick={() => this.saveOrder(0)} icon="save">
              保存
            </Button>
          </div>
        </div>
        <div className={styles.handelResult}>
          <span>处理结果：</span>
          <TextArea
            placeholder="请输入内容"
            value={dealResult}
            onChange={e => {
              this.setState({
                dealResult: e.target.value,
              });
            }}
            rows={4}
          />
        </div>
        <OrderResult
          type="reply"
          title="回复结果"
          isResolve={isResolve}
          satisfactory={satisfactory}
          resResult={replyResult}
          is_feedback={is_feedback}
          changeResolve={this.changeResolve}
          changeSatisfactory={this.changeSatisfactory}
          changeText={this.changeResultText}
          onChangeFeedback={this.onChangeFeedback}
        />
        <div className={styles.uploadFile}>
          <span className={styles.uploadTitle}>上传附件：</span>
          <div className={styles.fileBox}>
            <UploadFild
              fileData={fileData}
              setFileData={this.setFileData}
              singleDelFile={this.singleDelFile}
              multipleDelFile={this.multipleDelFile}
            />
          </div>
        </div>
        <div className={styles.footerSave}>
          {/* <Button className={styles.save} onClick={() => this.saveOrder(0)}>
            暂存
          </Button> */}
          <Button className={styles.submit} onClick={() => this.saveOrder(1)}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

DisposalSelf.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(DisposalSelf);
