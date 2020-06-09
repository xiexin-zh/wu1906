import React from 'react';
import { Tree, Spin } from 'antd';
import styles from './index.less';

const { TreeNode } = Tree;

function StructureTree(props) {
  const { treeData, onSelect, selectedKeys, onOperationTreeItem } = props;

  const renderTreeTitle = item => {
    return (
      item.name && (
        <>
          <span
            style={{
              color: selectedKeys.id === item.id ? 'rgba(36, 159, 222, 1)' : 'rgba(0, 0, 0, 0.65)',
              fontWeight: '500',
            }}
          >
            {item.name}
          </span>
          <span style={{ display: selectedKeys.id === item.id ? 'inline-block' : 'none' }}>
            <span
              className={`${styles.treeTitleIcon} ${styles.addIcon}`}
              data-type="addTreeP"
              onClick={e => onOperationTreeItem(e, item)}
            />

            {selectedKeys.pid !== 0 && (
              <span
                className={`${styles.treeTitleIcon} ${styles.editIcon}`}
                data-type="editTreeP"
                onClick={e => onOperationTreeItem(e, item)}
              />
            )}

            {selectedKeys.pid !== 0 && (
              <span
                className={`${styles.treeTitleIcon} ${styles.deleteIcon}`}
                data-type="deleteTreeP"
                onClick={e => onOperationTreeItem(e, item)}
              />
            )}
          </span>
        </>
      )
    );
  };

  const renderTree = data => {
    return data.map(item => {
      if (!item.children) {
        return <TreeNode title={renderTreeTitle(item)} key={item.id} dataRef={item} />;
      }
      return (
        <TreeNode title={renderTreeTitle(item)} key={item.id} dataRef={item}>
          {renderTree(item.children)}
        </TreeNode>
      );
    });
  };

  return (
    <div className={styles.StructureTreeBox}>
      <header>
        <span>组织架构</span>
        {/* <span
          className={`${styles.treeTitleIcon} ${styles.addIcon}`}
          data-type="addTreeP"
          onClick={onOperationTreeItem}
        /> */}
      </header>
      {treeData?.length ? (
        <Tree
          // checkable
          // disableCheckbox
          // selectable={false}
          // blockNode // 是否节点占据一行
          // defaultExpandParent // 默认展开父节点
          // multiple // 支持点选多个节点（节点本身）
          defaultExpandAll // 默认展开所有树节点
          className={styles.tree}
          onSelect={onSelect}
          selectedKeys={[selectedKeys.id]}
        >
          {renderTree(treeData)}
        </Tree>
      ) : (
        <div className={styles.example}>
          <Spin tip="Loading..." />
        </div>
      )}
    </div>
  );
}

export default StructureTree;
