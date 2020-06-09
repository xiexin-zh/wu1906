import dva from 'dva';
import { message } from 'antd';
import ReactDom from 'react-dom';
import Inter from './components/Inter';
import 'antd/dist/antd.css';
import './index.scss';
import createHistory from 'history/createBrowserHistory';
const history = createHistory({
  basename: process.env.NODE_ENV !== 'production' ? '' : '/newsfeed_web', //這裡放入你對應的 basename
});

message.config({
  maxCount: 1,
});

let savedState = null;
const saveAndLoad = (r) => (state, action) => {
  const newState = r(state, action);
  //恢復成重繪之前的狀態
  if (action.type === 'save') {
    savedState = newState;
  }
  //恢復成退出之前的狀態
  if (action.type === 'load') {
    return savedState;
  }
  return newState;
};

// 忽略錯誤
const needErrHandle = [];

// 1. Initialize
const app = dva({
  history: history,
  onReducer: saveAndLoad,
  onError(error, dispatch, action) {
    // error from model effect
    if (error.code && error.data) {
      message.error(error.data.message);
    }
    if (error.status === 401) {
      message.error(error.data.error);
      dispatch({
        type: 'load',
      });
    }
    console.info(error);
    if (!needErrHandle.includes(action.key)) {
      error.preventDefault();
    }
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

app.model(require('./models/session').default);
app.model(require('./models/rtm').default);
app.model(require('./models/IMChannels').default);
app.model(require('./models/notification').default);
app.model(require('./models/users').default);
app.model(require('./models/userInfo').default);
app.model(require('./models/members').default);
app.model(require('./models/posts').default);
app.model(require('./models/updatePersonalGroupInfo').default); // 更新個人/群組資訊（暫時更新 個人/群組 頭像和背景）
app.model(require('./models/votes').default);
app.model(require('./models/groupInfo').default);
app.model(require('./models/share').default);
app.model(require('./models/groupOption').default);
app.model(require('./models/files').default);
app.model(require('./models/search').default);
app.model(require('./models/postsPopup').default);
// 5. Start
// app.start('#root');
const App = app.start();
ReactDom.render(
  <Inter>
    <App />
  </Inter>,
  document.querySelector('#root')
);
