import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
// import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        {/* <SelectLang /> 多语言切换 */}
        <div className={styles.topLeftImg}>
          <div className={styles.topLeftCorner}>
            <div className={styles.loginTop2Title}>接诉即办</div>
            <div className={styles.topLeftCornerLine}>
              <i className={`${styles.line} ${styles.leftLine}`} />
              <span>服务平台</span>
              <i className={`${styles.line} ${styles.rightLine}`} />
            </div>
          </div>
          <img src="/login_images/loginTop2.png" alt="" />
        </div>
        <div className={styles.bottomRightImg}>
          <img src="/login_images/loginBottom3.png" alt="" />
        </div>
        {children}
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
