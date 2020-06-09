import React from 'react';
import { connect } from 'dva';
import { Button, Input, Collapse, List } from 'antd';
import { SearchOutlined, RightOutlined } from '@ant-design/icons';

import styles from './KnowledgeBase.less';

const { Panel } = Collapse;

class KnowledgeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listItemInfo: [
        {
          title: '属 地 街 道',
          content:
            '小区内疫情防控工作，辖区户籍湖北返京人员集中隔离点的日常生活隔离防疫工作小区内疫情防控工作，辖区户籍湖北返京人员集中隔离点的日常生活隔离防疫工作。',
        },
        {
          title: '综合执法局',
          content: '商务楼宇、商场、餐馆疫情防控工作（依据京城管发〔2020〕8号）',
        },
        {
          title: '营商合作局',
          content: '规上企业的疫情防控工作（参考规上企业统计表）',
        },
        {
          title: '科技创新局',
          content: '规下企业和特殊园区疫情防控工作（参考34家园区名单）',
        },
      ],
    };
  }

  renderPanelHeader = () => {
    return <span className={styles.panelHeader}>疫情期间各部门职责范围</span>;
  };

  renderPanelContent = () => {
    const { listItemInfo } = this.state;
    return (
      <List bordered>
        {listItemInfo.map(item => {
          return (
            <List.Item key={item.content}>
              <List.Item.Meta
                description={<div className={styles.itemMetaDes}>{item.title}</div>}
              />
              <div
                style={{
                  width: '700px',
                }}
              >
                {item.content}
              </div>
            </List.Item>
          );
        })}
      </List>
    );
  };

  renderCollapse = () => {
    return (
      <Collapse accordion expandIconPosition="right" defaultActiveKey="1">
        <Panel header={this.renderPanelHeader()} key="1">
          {this.renderPanelContent()}
        </Panel>
      </Collapse>
    );
  };

  render() {
    return (
      <div className={styles.KnowledgeBaseBox}>
        <header>
          <div>
            <img src={require('../../images/tit_zsk.png')} alt="" />
            <span>知 识 库</span>
          </div>
          <div>
            <Input
              placeholder="请输入关键词"
              prefix={<SearchOutlined />}
              className={styles.input}
            />
            <Button type="link" style={{ color: 'rgba(36,159,222,1)' }}>
              更多 <RightOutlined />
            </Button>
          </div>
        </header>
        <main>{this.renderCollapse()}</main>
      </div>
    );
  }
}

KnowledgeBase.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(KnowledgeBase);
