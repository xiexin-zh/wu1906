import React from 'react';
import { Modal, Input, message } from 'antd';
import { addBasicData, editBasicData } from '@/services/basicDataManagement';

const modalTitle = {
  addP: '添加类别',
  addC: '添加子类别',
  edit: '编辑类别',
};

const modalSpan = {
  OnAccount: '挂帐类别',
  reject: '剔除类别',
};

const { TextArea } = Input;
class AddDebarmentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.operation.type === 'edit' ? props.operation?.data?.name : '',
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
    if (name.length > 200) {
      message.error('内容不能超过 200 个字');
      return;
    }
    const typeCheckArr = {
      addP: addBasicData,
      addC: addBasicData,
      edit: editBasicData,
    };

    const params = {
      name,
      category: operation.category,
    };
    if (operation.type === 'addP') {
      params.pid = operation?.data?.pid;
    } else if (operation.type === 'addC') {
      params.pid = operation?.data?.id;
    } else if (operation.type === 'edit') {
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
        title={modalTitle[operation.type]}
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
            // alignItems: 'center',
          }}
        >
          <span>{modalSpan[operation.category]}</span>
          <TextArea
            style={{ width: '310px' }}
            onChange={this.change}
            placeholder="请输入"
            autoSize={{ minRows: 3, maxRows: 3 }}
            defaultValue={name}
          />
        </div>
      </Modal>
    );
  }
}

export default AddDebarmentType;
