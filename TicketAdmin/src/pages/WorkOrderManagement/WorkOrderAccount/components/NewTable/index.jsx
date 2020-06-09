import React from 'react';
import { Table, Checkbox } from 'antd';

class NewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.sendSelectAllHandle(this.onToggleSelectAll, this.props.orderList.length);
  }

  get selectedRowLen() {
    const { selectedRowKeys } = this.props;
    return selectedRowKeys.length;
  }

  onSelectChange = keys => {
    this.props.onSelectToggle(keys);
  };

  onGetSelectAllRef = ref => {
    this.selectAllRef = ref;
  };

  // 改变搜索列表内容
  changeListSearch = (value, type) => {
    const { changeListSearch } = this.props;
    changeListSearch(type, value);
  };

  render() {
    const { columns, formatOrderList, selectedRowKeys } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnTitle: () => (
        <Checkbox
          // checked={checkedAll}
          ref={this.onGetSelectAllRef}
          onChange={this.onToggleSelectAll}
        />
      ),
    };
    return (
      <Table
        // className={styles.tableList}
        columns={columns}
        dataSource={formatOrderList}
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ x: formatOrderList.length > 0 ? 1500 : 0 }}
        rowKey={msg => {
          return msg.id;
        }}
      />
    );
  }
}

export default NewTable;
