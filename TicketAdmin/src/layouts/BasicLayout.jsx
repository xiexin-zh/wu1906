/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { routeUrlMap as routeMap, routeIconMap } from '@/utils/routeMap';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';

import logo from '../assets/logo.svg';
// import routerMap from ''

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */

// const defaultFooterDom = (
//   <DefaultFooter
//     copyright="2019 蚂蚁金服体验技术部出品"
//     links={[
//       {
//         key: 'Ant Design Pro',
//         title: 'Ant Design Pro',
//         href: 'https://pro.ant.design',
//         blankTarget: true,
//       },
//       {
//         key: 'github',
//         title: <Icon type="github" />,
//         href: 'https://github.com/ant-design/ant-design-pro',
//         blankTarget: true,
//       },
//       {
//         key: 'Ant Design',
//         title: 'Ant Design',
//         href: 'https://ant.design',
//         blankTarget: true,
//       },
//     ]}
//   />
// );

// const footerRender = () => {
//   if (!isAntDesignPro()) {
//     return defaultFooterDom;
//   }

//   return (
//     <>
//       {defaultFooterDom}
//       <div
//         style={{
//           padding: '0px 24px 24px',
//           textAlign: 'center',
//         }}
//       >
//         <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
//           <img
//             src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
//             width="82px"
//             alt="netlify logo"
//           />
//         </a>
//       </div>
//     </>
//   );
// };

class BasicLayout extends React.PureComponent {
  componentDidMount() {
    document.title = '投诉即办';
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'global/getMenuListHandle',
        payload: 0,
      });
    }
  }

  get serverRouteMap() {
    const { menuList: list } = this.props;
    if (!list || list.length === 0) {
      return {};
    }
    const newList = (list || []).map(item => ({
      id: item.id,
      pid: item.pid,
      name: item.name,
    }));
    const map = {};
    newList.forEach(item => {
      const { id, pid, name } = item;
      const url = routeMap[`${pid}/${id}`];
      map[url] = name;
    });

    return {
      ...map,
    };
  }

  get accessList() {
    const { menuList: list } = this.props;
    if (!list || list.length === 0) {
      return [];
    }
    const newList = (list || []).map(item => ({
      id: item.id,
      pid: item.pid,
      name: item.name,
    }));
    const urlList = [];
    newList.forEach(item => {
      const { id, pid } = item;
      const url = routeMap[`${pid}/${id}`];
      if (url) {
        urlList.push(url);
      }
    });

    return urlList;
  }

  handleMenuCollapse = payload => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  menuDataRender = menuList => {
    return menuList
      .map(item => {
        const localItem = {
          ...item,
          children: item.children ? this.menuDataRender(item.children) : [],
        };
        return Authorized.check(item.authority, localItem, null);
      })
      .filter(item => this.accessList.includes(item.path) || item.path === '/home');
  };

  render() {
    const {
      children,
      settings,
      location = {
        pathname: '/',
      },
      collapsed,
    } = this.props;

    const authorized = getAuthorityFromRouter(
      this.props.route.routes,
      location.pathname || '/',
    ) || {
      authority: undefined,
    };

    const { serverRouteMap } = this;
    return (
      <ProLayout
        siderWidth={222}
        logo={logo}
        menuHeaderRender={() => (
          <div className="menu-title" style={{ visibility: `${collapsed ? 'hidden' : 'visible'}` }}>
            <div className="topLeftCorner">
              <div className="loginTop2Title">接诉即办</div>
              <div className="topLeftCornerLine">
                <i className="line leftLine" />
                <span>服务平台</span>
                <i className="line rightLine" />
              </div>
            </div>
          </div>
        )}
        onCollapse={this.handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return serverRouteMap[menuItemProps.path] ? (
              <div>{serverRouteMap[menuItemProps.path]}</div>
            ) : null;
          }

          if (serverRouteMap[menuItemProps.path]) {
            return routeIconMap[menuItemProps.path] ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>{routeIconMap[menuItemProps.path]()}</div>
                <a
                  href={`#${menuItemProps.path}`}
                  style={{ marginLeft: '11px', color: '#fff', fontWeight: 'bold' }}
                >
                  {serverRouteMap[menuItemProps.path]}
                </a>
              </div>
            ) : (
              <Link to={menuItemProps.path}>{serverRouteMap[menuItemProps.path]}</Link>
            );
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        subMenuItemRender={menuItemProps => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return serverRouteMap[menuItemProps.path] ? (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                <div>{routeIconMap[menuItemProps.path]()}</div>
                <div style={{ marginLeft: '11px' }}>{serverRouteMap[menuItemProps.path]}</div>
              </div>
            ) : null;
          }
          return serverRouteMap[menuItemProps.path] ? (
            <Link to={menuItemProps.path}>{serverRouteMap[menuItemProps.path]}</Link>
          ) : null;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menu={{ locale: false }}
        footerRender={false}
        {...this.props}
        menuDataRender={this.menuDataRender}
        formatMessage={formatMessage}
        // headerRender={false}// content head hide
        rightContentRender={() => <RightContent />} // content head right render
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    );
  }
}

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
  menuList: global.menuList,
}))(BasicLayout);
