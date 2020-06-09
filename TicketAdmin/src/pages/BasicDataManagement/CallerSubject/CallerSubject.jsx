import React from 'react';
import { connect } from 'dva';
import { Button, message, Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTicketOption, delBasicData } from '@/services/basicDataManagement';
import publicStyle from '../publicStyle.less';
import BasicDataBackup from '../components/BasicDataBackup';
import ShareTable from '../components/ShareTable';

class CallerSubject extends React.Component {
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
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '来电主体',
        dataIndex: 'name',
        key: 'name',
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
    await this.getTicketOptionLists();
  }

  getTicketOptionLists = () => {
    this.setState({
      loading: true,
    });
    getTicketOption({
      category: 'tel_subject',
    }).then(result => {
      const { data, message: msg, error_code } = result;
      this.setState({
        loading: false,
      });
      if (error_code !== 200) {
        message.warning(msg);
        return;
      }
      message.success(msg);
      this.setState({
        lists: data,
      });
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 添加/编辑/删除
  tableClickEvent = (event, record = {}) => {
    const currentClickState = event.target.getAttribute('data-key');
    if (!currentClickState) {
      return;
    }
    if (currentClickState === 'delete') {
      Modal.confirm({
        content: `是否确认删除 ${record.name} 来电主体?`,
        onOk: () => {
          delBasicData({
            id: record.id,
            category: 'tel_subject',
          }).then(res => {
            const { error_code, message: msg } = res;
            if (error_code !== 200) {
              message.error(msg);
              return;
            }
            message.success(msg);
            this.cloneModal();
            this.getTicketOptionLists();
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
        category: 'tel_subject',
      },
    });
  };

  cloneModal = () => {
    this.setState({
      visible: false,
    });
  };

  renderExtra = () => {
    return (
      <Button type="primary" onClick={this.tableClickEvent} data-key="add">
        <PlusSquareOutlined />
        添加主体
      </Button>
    );
  };

  render() {
    const { loading, lists, selectedRowKeys, visible, operation } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={publicStyle.pageContent}>
        <PageHeaderWrapper title="来电主体" breadcrumb extra={this.renderExtra()}>
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
            <BasicDataBackup
              visible={visible}
              cloneModal={this.cloneModal}
              operation={operation}
              refreshTable={this.getTicketOptionLists}
            />
          )}
        </PageHeaderWrapper>
      </div>
    );
  }
}

CallerSubject.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CallerSubject);
