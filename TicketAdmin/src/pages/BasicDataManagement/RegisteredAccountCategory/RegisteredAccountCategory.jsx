import React from 'react';
import { Button, message, Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getAllOnAccount, delBasicData } from '@/services/basicDataManagement';
import publicStyle from '../publicStyle.less';
import AddDebarmentType from '../components/AddDebarmentType';
import ShareTable from '../components/ShareTable';

class RegisteredAccountCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      selectedRowKeys: [],
      loading: false,
      visible: false,
      operation: {
        type: 'add',
        data: {},
      },
      category: 'OnAccount',
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: '',
        key: 'index',
        render: (text, record, index) => index + 1,
      },
      {
        title: '挂帐类别',
        dataIndex: 'name',
        key: 'name',
        onCell: () => {
          return {
            style: {
              maxWidth: 800,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: () => (
          <>
            <Button
              type="primary"
              data-key="edit"
              style={{
                marginLeft: '5px',
              }}
            >
              编辑
            </Button>
            <Button
              style={{
                color: '#FA6400',
                border: '1px solid #FA6400',
                marginLeft: '5px',
              }}
              data-key="delete"
            >
              删除
            </Button>
          </>
        ),
      },
    ];
  }

  async componentDidMount() {
    await this.getAllOnAccountLists();
  }

  getAllOnAccountLists = () => {
    this.setState({
      loading: true,
    });
    getAllOnAccount().then(result => {
      const { error_code, message: msg, data } = result;
      this.setState({
        loading: false,
      });
      if (error_code !== 200) {
        message.error(msg);
        return;
      }
      message.success(msg);
      const lists = [];
      data.forEach(item => {
        const obj = {
          id: item.id,
          name: item.name,
        };
        lists.push(obj);
      });
      this.setState({ lists });
    });
  };

  // 添加/编辑/删除
  tableClickEvent = (event, record = {}) => {
    const currentClickState = event.target.getAttribute('data-key');
    if (!currentClickState) {
      return;
    }
    const { category } = this.state;
    if (currentClickState === 'delete') {
      Modal.confirm({
        content: `是否确认删除 ${record.name} 挂帐类别?`,
        onOk: () => {
          delBasicData({
            id: record.id,
            category,
          }).then(res => {
            const { error_code, message: msg } = res;
            if (error_code !== 200) {
              message.error(msg);
              return;
            }
            message.success(msg);
            this.cloneModal();
            this.getAllOnAccountLists();
          });
        },
      });
      return;
    }
    this.setState({
      visible: true,
      operation: {
        type: currentClickState,
        data: record,
        category,
      },
    });
  };

  cloneModal = () => {
    this.setState({
      visible: false,
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  renderExtra = () => {
    return (
      <Button
        type="primary"
        onClick={event => this.tableClickEvent(event, { pid: 0 })}
        data-key="addP"
      >
        <PlusSquareOutlined />
        添加类别
      </Button>
    );
  };

  render() {
    const { loading, lists, visible, operation, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={publicStyle.pageContent}>
        <PageHeaderWrapper breadcrumb extra={this.renderExtra()}>
          <main>
            <ShareTable
              loading={loading}
              columns={this.columns}
              lists={lists}
              rowSelection={rowSelection}
              tableClickEvent={this.tableClickEvent}
            />
          </main>
          {visible && (
            <AddDebarmentType
              visible={visible}
              cloneModal={this.cloneModal}
              operation={operation}
              refreshTable={this.getAllOnAccountLists}
            />
          )}
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default RegisteredAccountCategory;
