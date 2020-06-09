import React, { useCallback, useRef } from 'react';
import { Input, Button, message } from 'antd';
import router from 'umi/router';
import { getLoginGroup } from '@/utils/constance';
import { leadersInstructions } from '@/services/workOrderManagement';
import styles from './leadersInstructions.less';

const { TextArea } = Input;

const LeadersInstructions = ({ id, orderDetails }) => {
  const textArea = useRef(null);
  const onSubmit = useCallback(() => {
    const txt = textArea?.current?.state?.value;
    if (!txt) {
      message.error('请填写处理意见');
      return;
    }
    leadersInstructions({
      ticket_id: id,
      process_txt: txt,
    }).then(res => {
      if (res.state) {
        router.push('/WorkOrderManagement/WorkOrderDisposal/');
      }
    });
  }, []);
  const isCenterGroup = getLoginGroup() === 'centerGroup';

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputBox}>
        <span className={styles.title}>处理意见：</span>
        {isCenterGroup ? (
          <div className={styles.box}>{orderDetails?.process_txt || ''}</div>
        ) : (
          <TextArea
            className={styles.input}
            maxLength={300}
            ref={textArea}
            placeholder="请输入内容"
          />
        )}
      </div>
      {!isCenterGroup && (
        <div className={styles.btnBox}>
          <Button type="primary" className={styles.leftDistance} onClick={onSubmit}>
            提交
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadersInstructions;
