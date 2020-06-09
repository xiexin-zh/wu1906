import React from 'react';
import { Modal, Input, message } from 'antd';
import { addBasicData, editBasicData } from '@/services/basicDataManagement';

const modalTitle = {
  source: '添加来源',
  tel_subject: '添加主体',
  type: '添加类型',
  task_type: '添加类型',
  city_type: '添加子分类',
  ques_type: '添加子分类',
};

const modalSpan = {
  source: '工单来源',
  tel_subject: '来电主体',
  type: '工单类型',
  task_type: '任务类型',
  city_type: '市级问题分类',
  ques_type: '中心问题分类',
};
class BasicDataBackup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.operation?.data?.name,
    };
  }

  change = e => {
    this.setState({
      name: e.target.value,
    });
  };

  handleOk = () => {
    const { cloneModal, operation, refreshTable } = this.props;
    const { name } = this.state;

    if (!name) {
      message.error('内容不能为空');
      return;
    }
    if (name.length > 10) {
      message.error('内容不能超过 10 个字');
      return;
    }
    const hasPid =
      operation.type === 'add' &&
      (operation.category === 'ques_type' || operation.category === 'city_type');
    const typeCheckArr = {
      add: addBasicData,
      edit: editBasicData,
    };

    const params = {
      name,
      category: operation.category,
    };
    if (hasPid) {
      params.pid = operation?.selectedKeys?.id;
    } else {
      params.id = operation?.data?.id;
    }

    typeCheckArr[operation.type](params).then(res => {
      const { error_code, message: msg } = res;
      if (error_code !== 200) {
        message.error(msg);
        return;
      }
      message.success(msg);
      refreshTable();
      cloneModal();
    });
  };

  render() {
    const { visible, operation, cloneModal } = this.props;
    const { name } = this.state;
    return (
      <Modal
        centered
        width="450px"
        title={modalTitle[operation.category]}
        destroyOnClose
        visible={visible}
        onOk={this.handleOk}
        okText="提交"
        onCancel={cloneModal}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{modalSpan[operation.category]}</span>
          <Input
            placeholder="请输入"
            style={{ width: '310px' }}
            defaultValue={name}
            onChange={this.change}
          />
        </div>
      </Modal>
    );
  }
}

export default BasicDataBackup;
