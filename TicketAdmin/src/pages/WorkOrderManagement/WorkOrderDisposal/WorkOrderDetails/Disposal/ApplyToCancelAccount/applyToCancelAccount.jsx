import React from 'react';
import { Button, message, Radio } from 'antd';
import router from 'umi/router';
import _ from 'lodash';
import TextInputBox from '@/components/TextInputBox';
import UploadFile from '@/components/FileUpload';
import FlexWrapper from '@/components/FlexWrapper';
import {
  getAllRejectType,
  getAllOnAccount,
  deptReject,
  centerCheckReject,
  compReject,
} from '@/services/workOrderManagement';
import RenderCancelIntroduction from '@/components/CheckBoxList';
import { cancelList, getLoginGroup } from '@/utils/constance';
import styles from './applyToCancelAccount.less';

class ApplyToCancelAccount extends React.PureComponent {
  state = {
    fileData: [],
    cancelData: [],
    accountData: [],
    radioResult: 1, // 1审核通过，0驳回
    resultContent: '',
    checkedData: [],
  };

  // submitOrderHandleMap={
  //   department:this.onSubmit,
  //   organize:this.onOrganizeSubmit,
  // }

  async componentDidMount() {
    const cancelRes = await getAllRejectType({ category: 'reject' });
    const accountRes = await getAllOnAccount();
    this.setState({
      cancelData: cancelRes?.data || [],
      accountData: accountRes?.data || [],
    });
  }

  get defaultCheckList() {
    const { data } = this.props;
    if (_.isEmpty(data) || _.isEmpty(this.allCheckData)) {
      return [];
    }
    const pid = data?.ticketReject?.master_type;
    const id = data?.ticketReject?.slave_type;
    const parentId = `0/${pid}`;
    const childId = `${pid}/${id}`;
    return [parentId, childId];
  }

  get allCheckData() {
    const { isCancel } = this.props;
    const { cancelData, accountData } = this.state;
    return isCancel ? cancelData : accountData;
  }

  setContentRef = ref => {
    this.contentRef = ref;
  };

  setResultRef = ref => {
    this.resultRef = ref;
  };

  setResultContentRef = ref => {
    this.resultContentRef = ref;
  };

  setCheckedData = data => {
    this.checkedData = data;
    this.setState(state => {
      return {
        checkedData: state.checkedData,
      };
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

  onSubmit = () => {
    const { fileData } = this.state;
    const { orderDetails, isCancel } = this.props;
    const ticket_id = orderDetails?.id || '';
    const content = this.contentRef?.state?.value || '';
    const result = this.resultRef?.state?.value || '';
    if (this.checkedData.length === 0) {
      message.error('请选择类别');
    }
    const levelOneData = this.checkedData.filter(item => item.includes('0/'));
    const levelTwoData = this.checkedData.filter(item => !item.includes('0/'));
    const levelOneDataArr = (levelOneData?.[0] || '').split('/');
    const levelTwoDataArr = (levelTwoData?.[0] || '').split('/');
    const str = cancelList[isCancel ? 0 : 1];
    if (levelOneData.length > 1 || levelTwoData.length > 1) {
      message.error(`${str}类别或者子类别最多选择一项`);
      return;
    }

    if (levelOneDataArr[1] !== levelTwoDataArr[0]) {
      message.error('请选择对应的类别项');
      return;
    }

    const isOrganize = getLoginGroup() === 'organize';

    (isOrganize ? compReject : deptReject)({
      ticket_id,
      is_reject: isCancel ? 0 : 1,
      appeal_txt: content,
      case_txt: result,
      master_type: levelOneDataArr?.[1],
      slave_type: levelTwoDataArr?.[1] || 0,
      ticketFile: JSON.stringify(fileData),
    }).then(res => {
      if (res?.state) {
        router.push('/WorkOrderManagement/WorkOrderDisposal/');
      }
      if (!res?.state) {
        message.error(res?.message);
      }
    });
  };

  onCenterSubmit = () => {
    const { id } = this.props;
    const { radioResult } = this.state;
    const remark = this.resultContentRef?.state?.value;
    if (!remark) {
      message.error('请输入审核意见');
      return;
    }
    centerCheckReject({
      ticket_id: id,
      is_pass: radioResult,
      remark,
    }).then(res => {
      if (res.state) {
        router.push('/WorkOrderManagement/WorkOrderDisposal/');
      }
    });
  };

  onSetResult = e => this.setState({ radioResult: e?.target?.value });

  render() {
    const { orderDetails, isCancel, data } = this.props;
    const { fileData, resultContent, radioResult } = this.state;
    const content = orderDetails?.t_details || '';
    const result = orderDetails?.t_hdetails || '';
    const onlyShow = !!data;
    return (
      <div className={styles.box}>
        <TextInputBox
          onlyShow={onlyShow}
          defaultValue={content}
          setRef={this.setContentRef}
          title="诉求内容"
        />
        <TextInputBox
          onlyShow={onlyShow}
          defaultValue={result}
          setRef={this.setResultRef}
          title="情况说明"
        />
        <FlexWrapper
          title={`*${isCancel ? cancelList[0] : cancelList[1]}说明`}
          wrapperClass={styles.cancelIntroductionWrapper}
          Component={() => (
            <RenderCancelIntroduction
              data={this.allCheckData}
              isCancel={isCancel}
              disabled={onlyShow}
              checkedData={onlyShow ? this.defaultCheckList : this.state.checkedData}
              setCheckedData={this.setCheckedData}
            />
          )}
        />
        <FlexWrapper
          title="上传附件"
          wrapperClass={styles.fileBox}
          Component={() => (
            <div className={styles.outBox}>
              {onlyShow && <div className={styles.mask} />}
              <UploadFile
                fileData={fileData}
                setFileData={this.setFileData}
                singleDelFile={this.singleDelFile}
                multipleDelFile={this.multipleDelFile}
              />
            </div>
          )}
        />
        {onlyShow && (
          <FlexWrapper
            title="*审核结果"
            wrapperClass={styles.resultBox}
            noBorder
            Component={() => (
              <div className={styles.resultBox}>
                <div className={styles.checkBox}>
                  <Radio.Group onChange={this.onSetResult} value={radioResult}>
                    <Radio value={1}>通过</Radio>
                    <Radio value={0} className={styles.leftDistance}>
                      驳回
                    </Radio>
                  </Radio.Group>
                </div>
                <TextInputBox
                  inputClass={styles.inputClass}
                  defaultValue={resultContent}
                  setRef={this.setResultContentRef}
                  title=""
                />
              </div>
            )}
          />
        )}
        <div className={styles.btnBox}>
          <Button onClick={data ? this.onCenterSubmit : this.onSubmit} type="primary">
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default ApplyToCancelAccount;
