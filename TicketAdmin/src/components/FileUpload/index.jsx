import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Icon, Table, Modal, message } from 'antd';

import { format, downloadFile } from '../../utils/tools';
import styles from './index.less';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFileIds: [], // 已选择的附件id -> arr
      fileColums: [
        {
          title: '附件名称',
          dataIndex: 'tf_title',
          key: 'tf_title',
          align: 'center',
        },
        {
          title: '上传时间',
          dataIndex: 'tf_create_at',
          key: 'tf_create_at',
          align: 'center',
        },
        {
          title: '上传人',
          dataIndex: 'tf_sender',
          key: 'tf_sender',
          align: 'center',
        },
        {
          title: '格式',
          dataIndex: 'tf_format',
          key: 'tf_format',
          align: 'center',
        },
        {
          title: '大小',
          dataIndex: 'tf_size',
          key: 'tf_size',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          align: 'center',
          render: (value, data) => {
            return (
              <Icon
                onClick={() => this.singleDelFile(data)}
                type="delete"
                style={{ color: '#249fde' }}
              />
            );
          },
        },
      ],
    };
  }

  // 设置文件上传附带参数
  setUploadData = () => {
    return {
      upload_type: 'docs',
    };
  };

  // 文件上传前
  beforeUpload = (file, fileList) => {
    console.log(file, fileList);
    return false;
  };

  // 文件上传成功后设置文件数据
  setFileData = data => {
    const { lastModified, uid, response } = data.file;
    const { clientName, ext, fileSize, src, filename } = response.data;
    const { setFileData, currentUser } = this.props;
    const { name } = currentUser;
    setFileData({
      tf_title: clientName,
      tf_create_at: format(lastModified),
      tf_sender: name,
      tf_format: ext,
      tf_id: uid,
      tf_size: fileSize,
      tf_url: src,
      tf_filename: filename,
    });
  };

  // 多选删除附件
  multipleDelFile = () => {
    const { selectFileIds } = this.state;
    if (selectFileIds.length === 0) {
      return message.error('请选择要删除的附件');
    }
    if (selectFileIds.length === 1) {
      const id = selectFileIds[0];

      this.singleDelFile({ tf_id: id });
    } else {
      Modal.confirm({
        title: '删除提示',
        content: '确定删除所选附件吗',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const { multipleDelFile } = this.props;
          multipleDelFile(selectFileIds);
        },
      });
    }
    return true;
  };

  // 单选删除附件
  singleDelFile = data => {
    Modal.confirm({
      title: '删除提示',
      content: '确定删除该附件吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { singleDelFile } = this.props;
        const { tf_id } = data;
        singleDelFile(tf_id);
      },
    });
  };

  // 下载选择的文件
  downLoadFile = () => {
    const { selectFileIds } = this.state;
    if (selectFileIds.length === 0) {
      return message.error('请选择要下载的附件');
    }
    if (selectFileIds.length > 1) {
      return message.error('只能选择一个附件');
    }
    const { fileData } = this.props;

    const file = fileData.filter(item => {
      return item.tf_id === selectFileIds[0];
    });
    const { tf_url, tf_title } = file[0];
    downloadFile(tf_url, tf_title);
    return true;
  };

  // table多选
  onSelectChange = data => {
    this.setState({
      selectFileIds: data,
    });
  };

  render() {
    const { fileData, stopUpload } = this.props;
    const { fileColums } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
    };

    const that = this;

    const uploadProps = {
      name: 'upload_resource',
      action: '/api/admin/upload',
      headers: {
        Authorization: `Bearer ${decodeURIComponent(atob(localStorage.getItem('token')))}`,
      },
      showUploadList: false,
      // accept: 'image/jpeg,image/jpg,image/png',
      // beforeUpload: this.beforeUpload,
      data: this.setUploadData,
      onChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response.state) {
            message.success(`文件上传成功`);
            that.setFileData(info);
          } else {
            const { error_code } = info.file.response;
            if (error_code === 500) {
              message.error('支持格式：doc、docx、xls、xlsx、pdf、jpg、jpeg、png等');
            } else {
              message.error(info.file.response.message);
            }
          }
        } else if (info.file.status === 'error') {
          message.error(`文件上传失败`);
        }
      },
    };
    return (
      <>
        <div className={styles.optionsBtn}>
          <div className={styles.filebtnUpload}>
            <Upload {...uploadProps} disabled={stopUpload}>
              <Icon type="plus" style={{ fontSize: '12px' }} />
              <span style={{ fontSize: '12px' }}>添加</span>
            </Upload>
          </div>
          <div className={styles.filebtns} onClick={this.multipleDelFile}>
            <Icon className={styles.btn} type="delete" />
            <span>删除</span>
          </div>
          <div className={styles.filebtns} onClick={this.downLoadFile}>
            <Icon className={styles.btn} type="download" />
            <span>下载</span>
          </div>
        </div>
        <div className={styles.fileTable}>
          <Table
            columns={fileColums}
            dataSource={fileData}
            rowSelection={rowSelection}
            pagination={false}
            rowKey={data => {
              return data.tf_id;
            }}
          />
        </div>
      </>
    );
  }
}

FileUpload.propTypes = {};
function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
  };
}

export default connect(mapStateToProps)(FileUpload);
