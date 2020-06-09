import React from 'react';
import { Table } from 'antd';

function ShareTable(props) {
  const { loading, columns, lists, rowSelection, tableClickEvent } = props;
  return (
    <Table
      align="center"
      loading={loading}
      columns={columns}
      dataSource={lists}
      rowSelection={rowSelection}
      pagination={false}
      rowKey={data => {
        return data.id;
      }}
      onRow={record => {
        return {
          onClick: event => {
            tableClickEvent(event, record);
          }, // 点击行
        };
      }}
    />
  );
}

export default ShareTable;
