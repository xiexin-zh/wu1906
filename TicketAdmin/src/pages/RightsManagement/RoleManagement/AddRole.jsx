import React from 'react';
import { Modal, Input, message } from 'antd';
import { connect } from 'dva';
import styles from './AddRole.less';
import { createUserGroupRole, editUserGroupRole } from '@/services/RoleManagement';

const { TextArea } = Input;

class AddRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: {
        name: '',
        remark: '',
      },
    };
    this.modalTitle = {
      add: '添加角色',
      edit: '角色编辑',
    };
  }

  componentDidMount() {
    const { add_edit_role_state, recordData } = this.props;
    if (add_edit_role_state === 'edit') {
      this.setState({
        inputVal: {
          name: recordData.name,
          remark: recordData.remark,
          user_group_id: recordData.id,
        },
      });
    }
  }

  inputChange = e => {
    const { inputVal } = this.state;
    const key = e.target.getAttribute('data-key');
    const val = e.target.value;
    this.setState({
      inputVal: {
        ...inputVal,
        [key]: val,
      },
    });
  };

  onSubmitChange = () => {
    const { inputVal } = this.state;
    const { add_edit_role_state, onModalVisible, getRolesLists } = this.props;
    if (!inputVal.name) {
      message.error('角色名称不能为空');
      return;
    }
    if (inputVal.remark.length > 50) {
      message.error('描述信息不能大于 50 个字');
      return;
    }
    const request = {
      add: createUserGroupRole,
      edit: editUserGroupRole,
    };
    request[add_edit_role_state]({
      ...inputVal,
    }).then(result => {
      if (!result.state) {
        message.error(result.message);
        return;
      }
      message.success(result.message);
      onModalVisible();
      getRolesLists();
    });
  };

  render() {
    const { visible, onModalVisible, add_edit_role_state } = this.props;
    const { inputVal } = this.state;
    return (
      <Modal
        title={this.modalTitle[add_edit_role_state]}
        visible={visible}
        onOk={this.onSubmitChange}
        onCancel={onModalVisible}
        centered
        destroyOnClose
        okText="提交"
        cancelText="取消"
        // footer={null}
      >
        <>
          <div className={styles.addContentItem}>
            <span>角色名称</span>
            <Input
              placeholder="请输入"
              className={styles.inputArea}
              onChange={this.inputChange}
              defaultValue={inputVal.name}
              data-key="name"
            />
          </div>
          <div className={styles.addContentItem}>
            <span>描述信息</span>
            <TextArea
              className={styles.inputArea}
              onChange={this.inputChange}
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 3 }}
              defaultValue={inputVal.remark}
              data-key="remark"
            />
          </div>
        </>
      </Modal>
    );
  }
}

AddRole.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AddRole);
