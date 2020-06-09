/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable consistent-return */
/* eslint-disable react/no-string-refs */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Input, Select, Icon, Checkbox, DatePicker, message, Modal } from 'antd';
import moment from 'moment';
import { getLoginGroup } from '@/utils/constance';
import { regTel, format, regWx } from '../../utils/tools';
import FileUpload from '../FileUpload';

import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const getInitialData = (defaultData = {}) => {
  return {
    orderNum: '', // 工单编号
    orderFrom: '12315', // 工单来源
    orderFromData: ['12315', '网格', '基层上报', '预警'], // 工单来源选项
    callerTime: '', // 来电时间
    caller: '个人', // 来电主体
    callerData: ['个人', '企业'], // 来电主体选项
    callerName: '', // 来电人姓名
    callerSex: '男', // 来电人性别
    callerMobile: '', // 来电号码
    callerAdderss: '', // 详细地址
    phone1: '', // 联系方式1
    phone2: '', // 联系方式2
    orderTitle: '', // 工单标题
    orderClass: '诉求', // 工单类型
    orderClassData: ['诉求', '投诉', '建议'], // 工单类型选项
    taskType: '日常', // 任务分类
    taskTypeData: ['日常', '紧急'], // 任务分类选项

    happenAddress: '', // 发生地址
    mainContent: '', // 主要内容
    senderName: '', // 派单人员
    sendTime: 0, // 派单时间
    sendEndTIme: 0, // 截止时间
    dealTIme: '', // 处理时限
    dealSuggestion: '', // 处理意见
    fileData: [], // 附件列表
    remark: '', // 备注
    tags: '', // 标签

    visible: false, // 显示添加标签弹框

    secondLevel: [],
    thirdLevel: [],
    ques_thirdLevel: [],
    ques_secondLevel: [],

    ...defaultData,
  };
};

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class OrderForm extends Component {
  indexGroup = getLoginGroup();

  static defaultProps = {
    orderData: {
      id: '',
      t_no: '',
      // t_state,
      t_source: '',
      t_tel_time: new Date().getTime() / 1000,
      t_tel_subject: '',
      t_tel_name: '',
      t_tel_sex: '男',
      t_tel_tel: '',
      t_tel_address: '',
      t_tel_contact: '',
      t_title: '',
      t_type: '',
      t_task_type: '',

      t_city_type: '',
      t_ques_type: '',

      t_locality: '',
      t_details: '',
      t_send_orders: '',
      t_so_startime: new Date().getTime() / 1000,
      t_so_endtime: (new Date().getTime() + 24 * 60 * 60 * 1000) / 1000,
      t_hsuggestion: '',
      t_htimelimit: 1,
      t_hdetails: '',
      // t_organizer,
      // t_create_at,
      // t_update_at,
      t_remark: '',
      t_tags: '',
      ticketFile: [],
    },
    baseData: {
      source: [],
      tel_subject: [],
      task_type: [],
      type: [],
    },
  };

  constructor(props) {
    super(props);
    const { orderData, baseData } = props;
    const {
      id,
      t_no,
      // t_state,
      t_source,
      t_tel_time,
      t_tel_subject,
      t_tel_name,
      t_tel_sex,
      t_tel_tel,
      t_tel_address,
      t_tel_contact,
      t_title,
      t_type,
      t_task_type,
      t_city_type,
      t_ques_type,
      t_locality,
      t_details,
      t_send_orders,
      t_so_startime,
      t_so_endtime,
      process_endtime,
      t_hsuggestion,
      t_htimelimit,
      // t_hdetails,
      // t_organizer,
      // t_create_at,
      // t_update_at,
      t_remark,
      t_tags,
      ticketFile,
    } = orderData;
    const reCityType = t_city_type ? t_city_type.split(',') : [];
    const reQuesType = t_ques_type ? t_ques_type.split(',') : [];
    const { source, tel_subject, task_type, type } = baseData;
    this.state = getInitialData({
      ticket_id: id,
      orderNum: t_no, // 工单编号
      orderFrom: t_source, // 工单来源
      orderFromData: source, // 工单来源选项
      callerTime: t_tel_time, // 来电时间
      caller: t_tel_subject, // 来电主体
      callerData: tel_subject, // 来电主体选项
      callerName: t_tel_name, // 来电人姓名
      callerSex: t_tel_sex, // 来电人性别
      callerMobile: t_tel_tel, // 来电号码
      callerAdderss: t_tel_address, // 详细地址
      phone1: t_tel_contact ? t_tel_contact.split(',')[0] : '', // 联系方式1
      phone2: t_tel_contact ? t_tel_contact.split(',')[1] : '', // 联系方式2
      orderTitle: t_title, // 工单标题
      orderClass: t_type, // 工单类型
      orderClassData: type, // 工单类型选项
      taskType: t_task_type, // 任务分类
      taskTypeData: task_type, // 任务分类选项

      happenAddress: t_locality, // 发生地址
      mainContent: t_details, // 主要内容
      senderName: t_send_orders, // 派单人员
      sendTime: t_so_startime, // 派单时间
      sendEndTIme: this.indexGroup === 'centerGroup' ? t_so_endtime : process_endtime, // 截止时间
      dealTIme: t_htimelimit, // 处理时限
      dealSuggestion: t_hsuggestion, // 处理意见
      fileData: ticketFile, // 附件列表
      remark: t_remark, // 备注
      tags: t_tags, // 标签

      visible: false, // 显示添加标签弹框

      secondLevel: [],
      thirdLevel: [],
      ques_thirdLevel: [],
      ques_secondLevel: [],
      city_value1: reCityType[0] || '',
      city_value2: reCityType[1] || '',
      city_value3: reCityType[2] || '',
      ques_value1: reQuesType[0] || '',
      ques_value2: reQuesType[1] || '',
      ques_value3: reQuesType[2] || '',
    });
  }

  componentDidMount() {
    const { isCreate } = this.props;
    if (isCreate) {
      this.getTicketNo();
    }
  }

  // 获取工单编号
  getTicketNo = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'order/getTicketNo',
      payload: {},
    });
    if (res.state) {
      const { ticketNo } = res.data;
      this.setState({
        orderNum: ticketNo,
      });
    } else {
      message.error('工单编号获取失败，请刷新页面');
    }
  };

  // 返回工单列表
  cancel = () => {
    router.push('/WorkOrderManagement/WorkOrderDisposal');
  };

  // 选择来电时间
  selectCallerTime = (data, value) => {
    const time = new Date(value).getTime() / 1000;
    this.setState({
      callerTime: time,
    });
  };

  // 选择派单开始时间
  setSendStartTime = (data, value) => {
    const { sendEndTIme } = this.state;
    const time = new Date(value).getTime() / 1000;
    if (sendEndTIme < time) {
      return message.error('派单开始时间不能大于截止时间');
    }
    this.setState({
      sendTime: time,
    });
  };

  // 选择派单截止时间
  setSendEndTime = (data, value) => {
    const time = new Date(value).getTime() / 1000;
    const { sendTime } = this.state;
    if (parseInt(sendTime, 0) > time) {
      return message.error('派单截止时间不能小于开始时间');
    }
    this.setState({
      sendEndTIme: time,
    });
  };

  // 判断处理时限
  getTimeGap = () => {
    const { sendTime, sendEndTIme } = this.state;
    const timeGap = sendEndTIme - sendTime;
    const day = Math.floor(Math.ceil(timeGap) / 86400);
    return day;
  };

  // 文件上传成功后设置文件数据
  setFileData = data => {
    const { fileData } = this.state;
    this.setState({
      fileData: fileData.concat([data]),
    });
  };

  // 多选删除附件
  multipleDelFile = selectFileIds => {
    const { fileData } = this.state;
    let difference = [...fileData];
    for (let i = 0; i < selectFileIds.length; i += 1) {
      difference = difference.filter(item => {
        return selectFileIds[i] !== item.tf_id;
      });
    }

    this.setState({
      fileData: difference,
    });
  };

  // 单选删除附件
  singleDelFile = id => {
    const { fileData } = this.state;
    this.setState({
      fileData: fileData.filter(item => {
        return item.tf_id !== id;
      }),
    });
  };

  // 添加标签
  addTag = () => {
    this.setState({
      visible: true,
    });
  };

  // 保存标签
  saveTag = () => {
    const { tags } = this.state;
    const value = this.refs.tagRef.state.value;
    if (!value || value.trim().length === 0) {
      return message.error('请输入标签名称');
    }
    if (value.trim().length > 6) {
      return message.error('标签长度为1-6位');
    }
    const tagArr = tags ? tags.split(',') : [];

    if (tagArr.indexOf(value.trim()) !== -1) {
      return message.error('已存在该标签');
    }

    this.setState({
      visible: false,
      tags: [...tagArr, value.trim()].join(','),
    });
  };

  // 取消保存标签
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 删除标签
  delTag = value => {
    const { tags } = this.state;
    const tagArr = tags.split(',');
    const newTagArr = tagArr.filter(item => {
      return value !== item;
    });

    this.setState({
      tags: newTagArr.join(','),
    });
  };

  // 保存工单
  saveOrder = async () => {
    const { dispatch, isCreate, createOrder } = this.props;
    if (!createOrder) {
      return message.error('对不起您没有权限操作');
    }
    const {
      ticket_id,
      orderNum,
      orderFrom,
      callerTime,
      caller,
      callerName,
      callerSex,
      callerMobile,
      callerAdderss,
      phone1,
      phone2,
      orderTitle,
      orderClass,
      taskType,
      happenAddress,
      mainContent,
      senderName,
      sendTime,
      sendEndTIme,
      // dealTIme,
      dealSuggestion,
      remark,
      tags,
      fileData,
      city_value1,
      city_value2,
      city_value3,
      ques_value1,
      ques_value2,
      ques_value3,
    } = this.state;

    const fileList =
      fileData.length > 0
        ? fileData.map(item => {
            return {
              tf_title: item.tf_title,
              tf_filename: item.tf_filename,
              tf_url: item.tf_url,
              tf_format: item.tf_format,
              tf_size: item.tf_size,
            };
          })
        : [];
    if (orderNum.trim().length === 0) {
      return message.error('无工单编号，请刷新页面');
    }
    if (!orderFrom) {
      return message.error('请选择工单来源');
    }
    if (!callerTime) {
      return message.error('请选择来电时间');
    }
    if (!caller) {
      return message.error('请选择来电主体');
    }
    if (!orderClass) {
      return message.error('请选择工单类型');
    }
    if (!taskType) {
      return message.error('请选择任务类型');
    }
    if (!city_value1 || !ques_value1) {
      return message.error('请选择问题分类');
    }
    if (callerName.trim().length === 0) {
      return message.error('请填写来电人姓名');
    }
    if (callerName.trim().length > 20) {
      return message.error('来电人字数限制在20以内');
    }
    if (callerMobile.trim().length === 0) {
      return message.error('请填写来电号码');
    }
    if (!regTel(callerMobile)) {
      return message.error('手机号码格式错误');
    }
    if (callerAdderss.length === 0) {
      return message.info('来电人详细地址不能为空');
    }
    if (phone1.trim().length !== 0) {
      if (!regTel(phone1)) {
        return message.error('来电人联系方式-手机号码格式错误');
      }
    }
    if (phone2.trim().length !== 0) {
      if (!regWx(phone2)) {
        return message.error('微信号:6-20位 字母开头 字母 数字 下划线 减号');
      }
    }
    if (callerAdderss.length > 100) {
      return message.info('详细地址字数限制在100以内');
    }
    if (orderTitle.trim().length === 0) {
      return message.error('请填写工单标题');
    }
    if (orderTitle.trim().length > 100) {
      return message.error('工单标题字数限制在100以内');
    }
    if (happenAddress.trim().length > 100) {
      return message.error('发生地址字数限制在100以内');
    }
    if (mainContent.trim().length === 0) {
      return message.error('请填写主要内容');
    }
    if (mainContent.trim().length > 500) {
      return message.error('主要内容字数限制在500以内');
    }
    if (senderName.trim().length === 0) {
      return message.error('请填写派单人员');
    }
    if (senderName.trim().length > 20) {
      return message.error('派单人员字数限制在20以内');
    }
    if (!sendTime) {
      return message.error('请选择派单时间');
    }
    if (!sendEndTIme) {
      return message.error('请选择截止时间');
    }
    if (!dealSuggestion) {
      return message.error('请填写处理意见');
    }
    if (dealSuggestion.trim().length > 300) {
      return message.error('处理意见字数限制在300以内');
    }

    const params = {
      t_no: orderNum,
      t_source: orderFrom,
      t_tel_time: callerTime,
      t_tel_subject: caller,
      t_tel_name: callerName,
      t_tel_sex: callerSex,
      t_tel_tel: callerMobile,
      t_tel_address: callerAdderss,
      t_tel_contact: `${phone1},${phone2}`,
      t_title: orderTitle,
      t_type: orderClass,
      t_task_type: taskType,
      t_city_type: `${city_value1}${city_value2 ? `,${city_value2}` : ''}${
        city_value3 ? `,${city_value3}` : ''
      }`,
      t_ques_type: `${ques_value1}${ques_value2 ? `,${ques_value2}` : ''}${
        ques_value3 ? `,${ques_value3}` : ''
      }`,
      t_locality: happenAddress,
      t_details: mainContent,
      t_send_orders: senderName,
      t_so_startime: sendTime,
      t_so_endtime: sendEndTIme,
      t_hsuggestion: dealSuggestion,
      t_htimelimit: this.getTimeGap(),
      t_hdetails: '已处理',
      t_organizer: '指挥中心',
      t_remark: remark,
      t_tags: tags,
      ticketFile: JSON.stringify(fileList),
    };

    if (isCreate) {
      const res = await dispatch({
        type: 'order/addNewOrder',
        payload: {
          ...params,
        },
      });
      if (res.state) {
        message.success('保存成功');
        this.cancel();
      } else {
        message.error(res.message);
      }
    } else {
      params.ticket_id = ticket_id;
      const res = await dispatch({
        type: 'order/editOrder',
        payload: {
          ...params,
        },
      });
      if (res.state) {
        message.success('保存成功');
      } else {
        message.error(res.message);
      }
    }
  };

  render() {
    const {
      fileColums,
      fileData,
      orderNum,
      orderFrom,
      callerTime,
      caller,
      callerName,
      callerSex,
      callerMobile,
      callerAdderss,
      phone1,
      phone2,
      orderTitle,
      orderClass,
      taskType,
      happenAddress,
      mainContent,
      senderName,
      sendTime,
      sendEndTIme,
      // dealTIme,
      dealSuggestion,
      remark,
      tags,
      orderFromData,
      callerData,
      orderClassData,
      taskTypeData,
      thirdLevel,
      secondLevel,
      ques_thirdLevel,
      ques_secondLevel,
      city_value1,
      city_value2,
      city_value3,
      ques_value1,
      ques_value2,
      ques_value3,
    } = this.state;

    const { isCreate, createOrder, cityType, quesType } = this.props;
    const tagsArr = !tags || tags.length === 0 ? [] : tags.split(',');
    return (
      <div className={styles.orderForm}>
        {/* 填写信息 */}
        <div className={styles.fullMsg}>
          {/* 基础信息 */}
          <div className={styles.baseMsg}>
            <div className={styles.msgTitle}>
              <img src={require('../../assets/icon/icon-fj.png')} alt="" />
              <span>基础信息</span>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>工单编号：</label>
                </div>
                <div className={styles.msgInput}>
                  <Input disabled value={orderNum} />
                </div>
              </div>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>工单来源：</label>
                </div>
                <div className={styles.msgInput}>
                  <Select
                    style={{ width: '150px' }}
                    value={orderFrom}
                    onChange={value => {
                      this.setState({
                        orderFrom: value,
                      });
                    }}
                  >
                    {orderFromData &&
                      orderFromData.length > 0 &&
                      orderFromData.map(item => {
                        return (
                          <Option key={item.id} value={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>来电时间：</label>
                </div>
                <div className={styles.msgInput}>
                  <DatePicker
                    allowClear={false}
                    value={moment(format(callerTime * 1000), dateFormat)}
                    showTime
                    placeholder="选择时间"
                    onChange={this.selectCallerTime}
                  />
                </div>
              </div>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>来电主体：</label>
                </div>
                <div className={styles.msgInput}>
                  <Select
                    style={{ width: '150px' }}
                    value={caller}
                    onChange={value => {
                      this.setState({
                        caller: value,
                      });
                    }}
                  >
                    {callerData &&
                      callerData.length > 0 &&
                      callerData.map(item => {
                        return (
                          <Option key={item.id} value={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {/* 来电人信息 */}
          <div className={styles.baseMsg}>
            <div className={styles.msgTitle}>
              <img src={require('../../assets/icon/icon-fj.png')} alt="" />
              <span>来电人信息</span>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>姓名：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input
                    style={{ width: '70px' }}
                    value={callerName}
                    onChange={e => {
                      this.setState({
                        callerName: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={styles.label} style={{ width: '70px' }}>
                  <label>性别：</label>
                </div>
                <div className={styles.callerInput}>
                  <Select
                    style={{ width: '50px' }}
                    value={callerSex}
                    onChange={value => {
                      this.setState({
                        callerSex: value,
                      });
                    }}
                  >
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </div>
                <div className={styles.label}>
                  <label>来电号码：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input
                    style={{ width: '140px' }}
                    value={callerMobile}
                    onChange={e => {
                      this.setState({
                        callerMobile: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={styles.label}>
                  <label>详细地址：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input
                    style={{ width: '250px' }}
                    value={callerAdderss ? callerAdderss.substr(0, 100) : ''}
                    onChange={e => {
                      this.setState({
                        callerAdderss: e.target.value.substr(0, 100),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>手机号码：</label>
                </div>
                <div className={styles.relation}>
                  {/* <span>手机号码：</span> */}
                  <Input
                    style={{ marginRight: '10px' }}
                    value={phone1}
                    onChange={e => {
                      this.setState({
                        phone1: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={styles.relation}>
                  <span>微信号：</span>
                  <Input
                    value={phone2}
                    onChange={e => {
                      this.setState({
                        phone2: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 反映问题 */}
          <div className={styles.baseMsg}>
            <div className={styles.msgTitle}>
              <img src={require('../../assets/icon/icon-fj.png')} alt="" />
              <span>反映问题</span>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>工单标题：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input
                    style={{ width: '250px' }}
                    value={orderTitle ? orderTitle.substr(0, 100) : ''}
                    onChange={e => {
                      this.setState({
                        orderTitle: e.target.value.substr(0, 100),
                      });
                    }}
                  />
                </div>
                <div className={styles.label}>
                  <label>工单类型：</label>
                </div>
                <div className={styles.callerInput}>
                  <Select
                    style={{ width: '70px' }}
                    value={orderClass}
                    onChange={value => {
                      this.setState({
                        orderClass: value,
                      });
                    }}
                  >
                    {orderClassData &&
                      orderClassData.length > 0 &&
                      orderClassData.map(item => {
                        return (
                          <Option key={item.id} value={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
                <div className={styles.label}>
                  <label>任务类型：</label>
                </div>
                <div className={styles.callerInput}>
                  <Select
                    style={{ minWidth: '100px' }}
                    value={taskType}
                    onChange={value => {
                      this.setState({
                        taskType: value,
                      });
                    }}
                  >
                    {taskTypeData &&
                      taskTypeData.length > 0 &&
                      taskTypeData.map(item => {
                        return (
                          <Option key={item.id} value={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>市级问题分类：</label>
                </div>
                <div className={styles.callerInput}>
                  <Select
                    placeholder="一级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={city_value1}
                    onChange={value => {
                      this.setState({
                        secondLevel: cityType.filter(item => {
                          return item.id === value;
                        })[0].children,
                        city_value1: cityType.filter(item => {
                          return item.id === value;
                        })[0].name,
                        thirdLevel: [],
                        city_value2: '',
                        city_value3: '',
                      });
                    }}
                  >
                    {cityType &&
                      cityType.length > 0 &&
                      cityType.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  <Select
                    placeholder="二级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={city_value2}
                    onChange={value => {
                      this.setState({
                        thirdLevel: secondLevel.filter(item => {
                          return item.id === value;
                        })[0].children,
                        city_value2: secondLevel.filter(item => {
                          return item.id === value;
                        })[0].name,
                        city_value3: '',
                      });
                    }}
                  >
                    {secondLevel &&
                      secondLevel.length > 0 &&
                      secondLevel.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  <Select
                    placeholder="三级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={city_value3}
                    onChange={value => {
                      this.setState({
                        city_value3: thirdLevel.filter(item => {
                          return item.id === value;
                        })[0].name,
                      });
                    }}
                  >
                    {thirdLevel &&
                      thirdLevel.length > 0 &&
                      thirdLevel.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>问题分类：</label>
                </div>
                <div className={styles.callerInput}>
                  <Select
                    placeholder="一级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={ques_value1}
                    onChange={value => {
                      this.setState({
                        ques_secondLevel: quesType.filter(item => {
                          return item.id === value;
                        })[0].children,
                        ques_value1: quesType.filter(item => {
                          return item.id === value;
                        })[0].name,
                        ques_thirdLevel: [],
                        ques_value2: '',
                        ques_value3: '',
                      });
                    }}
                  >
                    {quesType &&
                      quesType.length > 0 &&
                      quesType.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  <Select
                    placeholder="二级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={ques_value2}
                    onChange={value => {
                      this.setState({
                        ques_thirdLevel: ques_secondLevel.filter(item => {
                          return item.id === value;
                        })[0].children,
                        ques_value2: ques_secondLevel.filter(item => {
                          return item.id === value;
                        })[0].name,
                        ques_value3: '',
                      });
                    }}
                  >
                    {ques_secondLevel &&
                      ques_secondLevel.length > 0 &&
                      ques_secondLevel.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  <Select
                    placeholder="三级分类"
                    style={{ minWidth: '120px', marginRight: '10px' }}
                    value={ques_value3}
                    onChange={value => {
                      this.setState({
                        ques_value3: ques_thirdLevel.filter(item => {
                          return item.id === value;
                        })[0].name,
                      });
                    }}
                  >
                    {ques_thirdLevel &&
                      ques_thirdLevel.length > 0 &&
                      ques_thirdLevel.map(item => {
                        return (
                          <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>发生地址：</label>
                </div>
                <div className={styles.callerInput}>
                  <div className={styles.address}>
                    <input
                      type="text"
                      value={happenAddress ? happenAddress.substr(0, 100) : ''}
                      onChange={e => {
                        this.setState({
                          happenAddress: e.target.value.substr(0, 100),
                        });
                      }}
                    />
                    {/* <Icon className={styles.addressIcon} type="environment" /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mainContent}>
              <div className={styles.main_msgBox}>
                <div className={styles.label}>
                  <label>主要内容：</label>
                </div>
                <div className={styles.callerInput}>
                  <TextArea
                    rows={4}
                    placeholder="请输入内容"
                    value={mainContent ? mainContent.substr(0, 500) : ''}
                    onChange={e => {
                      this.setState({
                        mainContent: e.target.value.substr(0, 500),
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <div className={styles.label}>
                  <label>派单人员：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input
                    style={{ width: '70px' }}
                    value={senderName}
                    onChange={e => {
                      this.setState({
                        senderName: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className={styles.label}>
                  <label>派单时间：</label>
                </div>
                <div className={styles.callerInput}>
                  <DatePicker
                    allowClear={false}
                    showTime
                    value={moment(format(sendTime * 1000), dateFormat)}
                    placeholder="选择时间"
                    style={{ minWidth: '190px' }}
                    onChange={this.setSendStartTime}
                  />
                </div>
                <div className={styles.label}>
                  <label>截止时间：</label>
                </div>
                <div className={styles.callerInput}>
                  <DatePicker
                    allowClear={false}
                    showTime
                    value={moment(format(sendEndTIme * 1000), dateFormat)}
                    style={{ minWidth: '190px' }}
                    placeholder="选择时间"
                    onChange={this.setSendEndTime}
                  />
                </div>
                <div className={styles.label}>
                  <label>处理时限：</label>
                </div>
                <div className={styles.callerInput}>
                  <Input disabled style={{ width: '90px' }} value={`${this.getTimeGap()}自然日`} />
                </div>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.main_msgBox}>
                <div className={styles.label}>
                  <label>处理意见：</label>
                </div>
                <div className={styles.callerInput}>
                  <TextArea
                    rows={4}
                    placeholder="请输入内容"
                    value={dealSuggestion ? dealSuggestion.substr(0, 300) : ''}
                    onChange={e => {
                      this.setState({
                        dealSuggestion: e.target.value.substr(0, 300),
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.uploadFile}>
              <div className={styles.fileBox}>
                <div className={styles.fileBoxTitle}>
                  <img src={require('../../assets/icon/icon-fj.png')} alt="" />
                  <span>附件</span>
                </div>
                <div className={styles.filePlugin}>
                  <FileUpload
                    isCreate={isCreate}
                    fileColums={fileColums}
                    fileData={fileData}
                    setFileData={this.setFileData}
                    singleDelFile={this.singleDelFile}
                    multipleDelFile={this.multipleDelFile}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div className={styles.remark}>
            <div className={styles.msgTitle}>
              <img src={require('../../assets/icon/icon-fj.png')} alt="" />
              <span>备注</span>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                <TextArea
                  placeholder="请输入内容"
                  value={remark ? remark.substr(0, 300) : ''}
                  rows={4}
                  onChange={e => {
                    this.setState({
                      remark: e.target.value.substr(0, 300),
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className={styles.tags}>
            <div className={styles.msgTitle}>
              <img src={require('../../assets/icon/icon-fj.png')} alt="" />
              <span>标签</span>
            </div>
            <div className={styles.msgBoxGroup}>
              <div className={styles.msgBox}>
                {tagsArr.length > 0 &&
                  tagsArr.map(item => {
                    return (
                      <div key={item} className={styles.tagItem}>
                        <Checkbox>{item}</Checkbox>
                        <Icon
                          onClick={() => this.delTag(item)}
                          type="minus-circle"
                          style={{ color: '#ccc', cursor: 'pointer' }}
                        />
                      </div>
                    );
                  })}

                <div className={styles.addTags} onClick={this.addTag}>
                  <Icon type="edit" />
                  <span>添加标签</span>
                </div>
              </div>
            </div>
          </div>

          {/* 保存 编辑 */}
          {createOrder && (
            <div className={styles.footerSave}>
              {/* {!isCreate && (
              <Button className={styles.addBtn} icon="form">
                编辑
              </Button>
            )} */}
              <Button className={styles.addBtn} icon="save" onClick={this.saveOrder}>
                保存
              </Button>
            </div>
          )}
        </div>

        {/* 添加标签弹框 */}
        <Modal
          destroyOnClose
          title="添加标签"
          centered
          visible={this.state.visible}
          onOk={this.saveTag}
          onCancel={this.handleCancel}
        >
          <div>
            <Input placeholder="请输入标签名称" ref="tagRef" />
          </div>
        </Modal>
      </div>
    );
  }
}

OrderForm.propTypes = {};
function mapStateToProps(state) {
  return {
    groupId: state.user.rights.groupId,
    createOrder: state.user.rights.createOrder,
    baseData: state.login.baseData,
    cityType: state.login.cityType,
    quesType: state.login.quesType,
  };
}

export default connect(mapStateToProps)(OrderForm);
