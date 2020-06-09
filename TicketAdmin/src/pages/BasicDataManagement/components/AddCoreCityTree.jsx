import React from 'react';
import { Modal, Input, message } from 'antd';
import { addBasicData, editBasicData } from '@/services/basicDataManagement';

const modalTitle = {
  addTreeP: '添加所属分类',
  editTreeP: '修改',
};

const modalSpan = {
  city_type: '所属分类',
  ques_type: '所属分类',
};
class AddCoreCityTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.operation?.item?.name,
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
      addTreeP: addBasicData,
      editTreeP: editBasicData,
    };
    const addParams = {
      addTreeP: {
        name,
        pid: 0,
        category: operation.category,
      },
      editTreeP: {
        name,
        id: operation?.item?.id,
        category: operation?.category,
      },
    };
    typeCheckArr[operation.type](addParams[operation.type]).then(res => {
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

export default AddCoreCityTree;
