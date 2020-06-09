import React from 'react';
import { Modal, Input, message } from 'antd';
import { createDepartment, editDepartment } from '@/services/organizationStructure';

const modalTitle = {
  addTreeP: '添加子级',
  editTreeP: '修改',
};

const modalSpan = {
  addTreeP: '子级名称',
  editTreeP: '组织名称',
};
class AddTreeSubclass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.operation.type === 'editTreeP' ? props.operation?.item?.name : '',
    };
  }

  change = e => {
    this.setState({
      name: e.target.value,
    });
  };

  handleOk = () => {
    const { cloneModal, operation, refresh } = this.props;
    const { name } = this.state;
    if (!name) {
      message.error('内容不能为空');
      return;
    }
    if (name.length > 10) {
      message.error('内容不能超过 10 个字');
      return;
    }
    const typeCheckArr = {
      addTreeP: createDepartment,
      editTreeP: editDepartment,
    };
    const params = {
      name,
      pid: operation.type === 'editTreeP' ? operation.item.pid : operation.item.id,
      // remark: operation.item.remark,
      status: operation.item.status,
      sort: operation.item.sort,
      department_id: operation.type === 'editTreeP' ? operation.item.id : '',
    };
    typeCheckArr[operation.type](params).then(res => {
      const { error_code, message: msg } = res;
      if (error_code !== 200) {
        message.error(msg);
        return;
      }
      message.success(msg);
      refresh();
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
            alignItems: 'center',
          }}
        >
          <span>{modalSpan[operation.type]}</span>
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

export default AddTreeSubclass;
